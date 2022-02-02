import React, { useState, useRef, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import LoadingScreen from '../components/LoadingScreen';
import { useDispatch, useSelector } from 'react-redux';
import { editListingHandler } from '../store/addListingAction';
import { isEdited } from '../store/addListingSlice';

const EditListing = () => {
  const [formData, setFormData] = useState({});
  const [editingListing, setEditingListing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);
  const params = useParams();

  const dispatch = useDispatch();
  const editted = useSelector((state) => state.add.isEdited);

  console.log(isLoading);

  // fetch based on UID for UPDATE/EDIT
  useEffect(() => {
    setIsLoading(true);
    const fetchEdit = async () => {
      const docRef = doc(db, 'listings', params.listingUID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEditingListing(docSnap.data());
        setFormData({
          ...docSnap.data(),
          geolocation: {
            lat: docSnap.data().geolocation.lat,
            long: docSnap.data().geolocation.long,
          },
        });
        setIsLoading(false);
      }
    };
    fetchEdit();
  }, [params.listingUID, dispatch]);

  // authenticantion
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

    dispatch(
      editListingHandler({
        ...formData,
        params: params,
      })
    );
  };

  if (editted) {
    navigate(`/type/${formData.type}/${params.listingUID}`);
    dispatch(isEdited(null));
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className='py-6 px-4 flex flex-col gap-4 mb-34'>
      <header>
        <h1 className='text-3xl font-bold'>
          Update Iklan {editingListing.name}
        </h1>
      </header>
      {isLoading && (
        <div className='alert alert-warning'>
          <FaBell />
          <label>Tunggu sebentar ya...!</label>
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
                formData.type === 'apartement' && 'form-clicked'
              }`}
              value='apartement'
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

          <div className='flex flex-col lg:flex-row gap-4 mt-4'>
            <div className='flex flex-col'>
              <label className='font-semibold' htmlFor='lat'>
                Latitude
              </label>
              <input
                className='rounded-md p-2 border-2 outline-2 focus:outline-green-600 '
                type='number'
                id='lat'
                value={formData.geolocation.lat}
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
                type='number'
                id='long'
                value={formData.geolocation.long}
                onChange={formHandler}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <a
            className='text-sm hover:text-blue-300'
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
            Update Iklan
          </button>
        </form>
      </main>
    </div>
  );
};

export default EditListing;
