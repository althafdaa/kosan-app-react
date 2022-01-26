import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/bundle';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { getDoc, doc } from 'firebase/firestore';
import { FaArrowLeft, FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingScreen from '../components/LoadingScreen';

const SingleListing = () => {
  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(null);

  const params = useParams();
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const fetchData = async () => {
        setIsLoading(true);
        const docRef = doc(db, 'listings', params.listingUID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data());
          setIsLoading(false);
        }
      };

      fetchData();
    }
    isMounted.current = false;
  }, [params.listingUID]);

  const shareHandler = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => {
      setShareCopied(false);
    }, 2000);
  };

  const rentHandler = () => {
    toast.info('Feature not available yet :(, sorry');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <header className='relative h-1/6 lg:h-1/3 mb-2'>
        <Swiper
          className='h-full'
          slidesPerView={1}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
        >
          {listing.imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <img
                className='object-cover object-center w-full h-full'
                src={url}
                alt='foto'
              />
              <div
                className='cursor-pointer absolute right-5 top-5 rounded-full bg-slate-900 opacity-50 hover:opacity-100 p-4'
                onClick={shareHandler}
              >
                <FaShareAlt className='text-white' />
              </div>
              {shareCopied && (
                <p className='bg-slate-900 text-white absolute top-20 right-5 text-xs shadow-md rounded-lg px-2 py-1 inline-block'>
                  Link Copied
                </p>
              )}
              <div
                className='cursor-pointer absolute left-5 top-5 rounded-full bg-slate-900 opacity-50 hover:opacity-100 p-4'
                onClick={shareHandler}
              >
                <Link to='/'>
                  <FaArrowLeft className='text-white' />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </header>
      <main className='px-4'>
        <div className='border-b-2 pb-2 border-gray-200'>
          <h1 className='text-3xl font-bold'> {listing.name}</h1>
          <p
            className={`border-2 inline-block px-4 rounded-md shadow-md font-semibold ${
              listing.type === 'kosan'
                ? 'bg-green-600 text-green-50'
                : 'bg-red-600 text-red-50'
            }`}
          >
            {listing.type === 'kosan' ? 'Kosan' : 'Apartement'}
          </p>
        </div>

        <div className='border-b-2 pb-2 border-gray-200'>
          {listing.offer && (
            <p className='text-xs bg-green-600 text-green-50 font-semibold rounded-md py-1 px-2'>
              <span className='line-through mr-4'>
                {listing.normalPrice
                  .toString()
                  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}
              </span>
              Hemat Rp
              {(listing.normalPrice - listing.discountedPrice)
                .toString()
                .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}
            </p>
          )}
          <div className='flex justify-between items-center p-2'>
            <div>
              {' '}
              {listing.offer && <p className='font-bold'>HARGA SPESIAL</p>}
              <p className='font-semibold'>
                Rp
                {listing.offer
                  ? listing.discountedPrice
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
                  : listing.normalPrice
                      .toString()
                      .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}{' '}
                / bulan
              </p>
            </div>{' '}
            <button
              onClick={rentHandler}
              className='bg-green-600 font-bold text-green-50 py-2 px-8 rounded-lg shadow-md hover:bg-green-700'
            >
              Rent
            </button>
          </div>
        </div>
        <div className='p-2 border-b-2 border-gray-200'>
          <h1 className='text-xl font-semibold mb-2'>Lokasi</h1>

          <div className='bg-green-600 w-full' style={{ height: '200px' }}>
            <MapContainer
              className='w-full h-full'
              center={[listing.geolocation.lat, listing.geolocation.long]}
              zoom={16}
              scrollWheelZoom={false}
            >
              <TileLayer url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />
              <Marker
                position={[listing.geolocation.lat, listing.geolocation.long]}
              ></Marker>
            </MapContainer>
          </div>
          <p className='mt-2'>{listing.location}</p>
        </div>
        <div className='p-2 border-b-2 border-gray-200 font-semibold'>
          <h1 className='text-xl font-semibold'>Fasilitas</h1>
          <div className='px-1'>
            {' '}
            <p>Akses 24 jam</p>
            <p>Tidak ada min. pembayaran</p>
            <p>Kesempatan mendapat diskon</p>
            {listing.furnished ? <p>Fully furnished</p> : <p>Non furnished</p>}
            {listing.bathrooms ? (
              <p>Kamar mandi dalam</p>
            ) : (
              <p>Kamar mandi luar</p>
            )}
            <p>Bebas biaya parkir</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default SingleListing;
