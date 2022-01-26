import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from './components/PrivateRoute';
import Explore from './Pages/Explore';
import Discounted from './Pages/Discounted';
import ForgotPassword from './Pages/ForgotPassword';
import Profile from './Pages/Profile';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Navbar from './components/Navbar';
import Type from './Pages/Type';
import AddListing from './Pages/AddListing';
import SingleListing from './Pages/SingleListing';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className='object-contain lg:px-64 overflow-auto h-full flex flex-col'>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route path='/type/:typeName' element={<Type />} />
          <Route path='/discount' element={<Discounted />} />
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/add-listing' element={<AddListing />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route
            path='/type/:typeName/:listingUID'
            element={<SingleListing />}
          />
        </Routes>
        {/* NAVBAR */}
        <Navbar />
      </Router>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;
