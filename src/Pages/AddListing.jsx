import React, { useState, useRef, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';

const AddListing = () => {
  const [formData, setFormData] = useState({
    bathrooms: false,
    discountedPrice: 0,
    furnished: false,
    images: {},
    location: '',
    name: '',
    normalPrice: 0,
    offer: true,
    lat: 0,
    long: 0,
    type: 'kosan',
    parking: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else navigate('/sign-in');
      });
    }
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const formHandler = (e) => {
    e.preventDefault();

    // jika targetnya file
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      if (e.target.value === 'true') {
        setFormData((prev) => ({
          ...prev,
          [e.target.id]: true,
        }));
      }
      if (e.target.value === 'false') {
        setFormData((prev) => ({
          ...prev,
          [e.target.id]: false,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [e.target.id]: e.target.value,
        }));
      }
    }
  };

  const listingSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let geolocation = {};

    // form validation
    if (formData.discountedPrice >= formData.normalPrice) {
      setIsLoading(false);
      toast.error('Harga diskonnya lebih tinggi dari harga normal tuh!');
      return;
    }
    if (formData.images.length > 6) {
      setIsLoading(false);
      toast.error('Gambar yang diupload maksimal 6 ya!');
      return;
    }

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
      [...formData.images].map((image) => storeImage(image))
    ).catch(() => {
      setIsLoading(false);
      toast.error('Uploading image failed');
      return;
    });
    // UPLOADING IMAGE END

    geolocation.lat = formData.lat;
    geolocation.long = formData.long;

    // COPYING STATE || FINAL STATE
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    // CLEANING UP DATA
    delete formDataCopy.images;
    delete formDataCopy.lat;
    delete formDataCopy.long;

    console.log(formDataCopy);

    // ADDING TO FIRESTORE
    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    setIsLoading(false);
    toast.success('Listing saved');
    navigate(`/type/${formDataCopy.type}/${docRef.id}`);
    // navigate('/profile');
  };

  return (
    <div className='py-6 px-4 grid gap-4 mb-34'>
      <header>
        <h1 className='text-3xl font-bold'>Rent Your Place</h1>
      </header>
      {isLoading && (
        <div className='alert alert-warning'>
          <FaBell />
          <label>Posting your Listings...</label>
        </div>
      )}

      <main>
        <form className='flex flex-col' onSubmit={listingSubmitHandler}>
          <label className='font-semibold' htmlFor='type'>
            Jenis Hunian
          </label>
          <div className='flex gap-4 mb-2'>
            <button
              className={`rounded-lg text-black border-2 shadow-xs px-8 py-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                formData.type === 'kosan' && 'form-clicked'
              }`}
              value='kosan'
              id='type'
              type='button'
              onClick={formHandler}
              disabled={isLoading}
            >
              Kosan
            </button>
            <button
              className={`rounded-lg text-black border-2 shadow-xs px-4 py-2  font-semibold hover:bg-green-600 hover:text-green-50 ${
                formData.type === 'apart' && 'form-clicked'
              }`}
              value='apart'
              id='type'
              type='button'
              onClick={formHandler}
              disabled={isLoading}
            >
              Apartemen
            </button>
          </div>

          <label className='font-semibold' htmlFor='name'>
            Nama Hunian
          </label>
          <input
            className='rounded-md p-2 border-2 outline-2 focus:outline-green-600'
            placeholder='ex: Rumah Kosan Dramaga'
            type='text'
            id='name'
            value={formData.name}
            onChange={formHandler}
            maxLength='32'
            minLength='10'
            required
            disabled={isLoading}
          />
          <div className='mt-2 flex items-center gap-4'>
            <label className='font-semibold' htmlFor='offer'>
              Kamar Mandi Dalam
            </label>
            <div className='flex gap-4 mb-2'>
              <button
                className={`rounded-lg text-black border-2 shadow-xs px-4 py-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                  formData.bathrooms && 'form-clicked'
                }`}
                value={true}
                type='button'
                id='bathrooms'
                onClick={formHandler}
                disabled={isLoading}
              >
                ✓
              </button>
              <button
                className={`rounded-lg text-black border-2 shadow-xs px-4 py-2  font-semibold hover:bg-green-600 hover:text-green-50 ${
                  !formData.bathrooms && 'form-clicked'
                }`}
                value={false}
                type='button'
                id='bathrooms'
                onClick={formHandler}
                disabled={isLoading}
              >
                X
              </button>
            </div>
          </div>

          <div className='mt-2 flex items-center gap-4'>
            <label className='font-semibold' htmlFor='furnished'>
              Fully Furnished
            </label>
            <div className='flex gap-4 mb-2'>
              <button
                className={`rounded-lg text-black border-2 shadow-xs px-4 py-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                  formData.furnished && 'form-clicked'
                }`}
                value={true}
                type='button'
                id='furnished'
                onClick={formHandler}
                disabled={isLoading}
              >
                ✓
              </button>
              <button
                className={`rounded-lg text-black border-2 shadow-xs px-4 py-2  font-semibold hover:bg-green-600 hover:text-green-50 ${
                  !formData.furnished && 'form-clicked'
                }`}
                value={false}
                type='button'
                id='furnished'
                onClick={formHandler}
                disabled={isLoading}
              >
                X
              </button>
            </div>
          </div>

          <label className='font-semibold' htmlFor='location'>
            Alamat Hunian
          </label>
          <input
            className='rounded-md p-2 h-16 border-2 outline-2 focus:outline-green-600 '
            placeholder='ex: Jalan Terapi IA'
            type='text'
            id='location'
            value={formData.location}
            onChange={formHandler}
            minLength='10'
            required
            disabled={isLoading}
          />

          <div className='flex gap-4 mt-4'>
            <div className='flex flex-col'>
              <label className='font-semibold' htmlFor='lat'>
                Latitude
              </label>
              <input
                className='rounded-md p-2 border-2 outline-2 focus:outline-green-600 '
                defaultValue='0'
                type='number'
                id='lat'
                value={formData.lat}
                onChange={formHandler}
                required
                disabled={isLoading}
              />
            </div>
            <div className='flex flex-col'>
              <label className='font-semibold' htmlFor='long'>
                Longitude
              </label>
              <input
                className='rounded-md p-2 border-2 outline-2 focus:outline-green-600 '
                defaultValue='0'
                type='number'
                id='long'
                value={formData.long}
                onChange={formHandler}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <a
            className='text-sm'
            href='https://blogsecond.com/2018/09/mendapatkan-latitude-dan-longitude-gmaps/'
            target='_blank'
            rel='noreferrer'
          >
            Cara mendapatkan nilai latitude dan longitude ?
          </a>
          <div className='mt-2'>
            <label className='font-semibold' htmlFor='offer'>
              Special Discount
            </label>
            <div className='flex gap-4 mb-2'>
              <button
                className={`rounded-lg text-black border-2 shadow-xs px-4 py-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                  formData.offer && 'form-clicked'
                }`}
                value={true}
                type='button'
                id='offer'
                onClick={formHandler}
                disabled={isLoading}
              >
                Yes
              </button>
              <button
                className={`rounded-lg text-black border-2 shadow-xs px-4 py-2  font-semibold hover:bg-green-600 hover:text-green-50 ${
                  !formData.offer && 'form-clicked'
                }`}
                value={false}
                type='button'
                id='offer'
                onClick={formHandler}
                disabled={isLoading}
              >
                No
              </button>
            </div>
          </div>

          <div className='mt-2 flex gap-8 items-center'>
            <label className='font-semibold' htmlFor='normalPrice'>
              Harga Normal
            </label>
            <div className='flex items-center gap-2'>
              <p>Rp</p>
              <input
                className='rounded-md p-2 border-2 outline-2 focus:outline-green-600'
                defaultValue='0'
                type='number'
                id='normalPrice'
                value={formData.normalPrice}
                onChange={formHandler}
                required
                disabled={isLoading}
              />
              <p className='font-semibold'>/ bulan</p>
            </div>
          </div>
          {formData.offer && (
            <div className='mt-2 flex gap-4 items-center'>
              <label className='font-semibold' htmlFor='discountedPrice'>
                Harga Diskon 🔥
              </label>
              <div className='flex items-center gap-2'>
                <p>Rp</p>
                <input
                  className='rounded-md p-2 border-2 outline-2 focus:outline-green-600'
                  defaultValue='0'
                  type='number'
                  id='discountedPrice'
                  value={formData.discountedPrice}
                  onChange={formHandler}
                  required
                  disabled={isLoading}
                />
                <p className='font-semibold'>/ bulan</p>
              </div>
            </div>
          )}
          <div className='mt-2'>
            <label className='font-semibold' htmlFor='name'>
              Foto Hunian
            </label>
            <p className='text-sm text-green-600'>
              Foto pertama akan menjadi cover (max 6)
            </p>
            <input
              className='mt-2'
              type='file'
              id='images'
              onChange={formHandler}
              max='6'
              accept='.jpg,.png,.jpeg'
              multiple
              required
              disabled={isLoading}
            />
          </div>

          <button
            className='mt-6 p-2 w-3/6 self-center bg-green-600 text-green-50 font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95'
            type='submit'
            disabled={isLoading}
          >
            Buat Iklan
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddListing;
