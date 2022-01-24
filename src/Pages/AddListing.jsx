import React, { useState, useRef, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaTimes } from 'react-icons/fa';

const AddListing = () => {
  const [enableGeolocation, setEnableGeolocation] = useState(true);
  const [formData, setFormData] = useState({
    type: 'kosan',
    name: '',
    bathrooms: false,
    furnished: false,
    address: '',
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    lat: 0,
    long: 0,
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
  }, [isMounted]);

  const formHandler = (e) => {
    e.preventDefault();
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }
    if (e.target.value === 'false') {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prev) => ({
        ...prev,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  const listingSubmitHandler = (e) => {
    e.preventDefault();
    console.log(formData);
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
          />
          <div className='mt-2'>
            <label className='font-semibold' htmlFor='name'>
              Kamar Mandi Dalam
            </label>
            <button
              className={`ml-2 rounded-lg text-black border-2 shadow-xs p-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                formData.bathrooms && 'form-clicked'
              }`}
              value={true}
              type='button'
              id='bathrooms'
              onClick={formHandler}
            >
              <FaCheck />
            </button>
            <button
              className={`ml-2 rounded-lg text-black border-2 shadow-xs p-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                !formData.bathrooms && 'form-clicked'
              }`}
              value={false}
              type='button'
              id='bathrooms'
              onClick={formHandler}
            >
              <FaTimes />
            </button>
          </div>

          <div className='mt-2'>
            <label className='font-semibold' htmlFor='furnished'>
              Fully Furnished
            </label>
            <button
              className={`ml-2 rounded-lg text-black border-2 shadow-xs p-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                formData.furnished && 'form-clicked'
              }`}
              value={true}
              type='button'
              id='furnished'
              onClick={formHandler}
            >
              <FaCheck />
            </button>
            <button
              className={`ml-2 mb-2 rounded-lg text-black border-2 shadow-xs p-2 font-semibold hover:bg-green-600 hover:text-green-50 ${
                !formData.furnished && 'form-clicked'
              }`}
              value={false}
              type='button'
              id='furnished'
              onClick={formHandler}
            >
              <FaTimes />
            </button>
          </div>

          <label className='font-semibold' htmlFor='address'>
            Alamat Hunian
          </label>
          <input
            className='rounded-md p-2 h-16 border-2 outline-2 focus:outline-green-600 '
            placeholder='ex: Jalan Terapi IA'
            type='text'
            id='address'
            value={formData.address}
            onChange={formHandler}
            minLength='10'
            required
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
              />
            </div>
          </div>

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
              >
                No
              </button>
            </div>
          </div>

          <div className='mt-2 flex gap-8 items-center'>
            <label className='font-semibold' htmlFor='regularPrice'>
              Harga Normal
            </label>
            <div className='flex items-center gap-2'>
              <p>Rp</p>
              <input
                className='rounded-md p-2 border-2 outline-2 focus:outline-green-600'
                defaultValue='0'
                type='number'
                id='regularPrice'
                value={formData.regularPrice}
                onChange={formHandler}
                required
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
                {' '}
                <p>Rp</p>
                <input
                  className='rounded-md p-2 border-2 outline-2 focus:outline-green-600'
                  defaultValue='0'
                  type='number'
                  id='discountedPrice'
                  value={formData.discountedPrice}
                  onChange={formHandler}
                  required
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
            />
          </div>

          <button
            className='mt-6 p-2 w-3/6 self-center bg-green-600 text-green-50 font-semibold rounded-lg shadow-md hover:bg-green-700 active:scale-95'
            type='submit'
          >
            Buat Iklan
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddListing;
