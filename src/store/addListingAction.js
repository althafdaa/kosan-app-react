import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { addListingLoading, listingAdded } from './addListingSlice';

export const addListingHandler = (data) => {
  const { images, lat, long } = data;
  console.log(data);
  const auth = getAuth();
  return async (dispatch) => {
    let geolocation = {};

    // UPLOADING IMAGE START
    const storeImage = async (img) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${img.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);

        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      toast.error('Uploading image failed');
      return;
    });
    // UPLOADING IMAGE END

    geolocation.lat = lat;
    geolocation.long = long;

    // COPYING STATE || FINAL STATE
    const formDataCopy = {
      ...data,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    // CLEANING UP DATA
    delete formDataCopy.images;
    delete formDataCopy.lat;
    delete formDataCopy.long;

    // ADDING TO FIRESTORE
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    dispatch(addListingLoading(false));

    if (docRef) {
      dispatch(
        listingAdded({
          added: true,
          uuid: docRef.id,
        })
      );
    }
    toast.success('Listing saved');
  };
};
