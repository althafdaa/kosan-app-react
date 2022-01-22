import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './Pages/Explore';
import Discounted from './Pages/Discounted';
import ForgotPassword from './Pages/ForgotPassword';
import Profile from './Pages/Profile';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Explore />}></Route>
          <Route path='/discount' element={<Discounted />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/sign-in' element={<SignIn />}></Route>
          <Route path='/sign-up' element={<SignUp />}></Route>
          <Route path='/forgot-password' element={<ForgotPassword />}></Route>
        </Routes>
        {/* NAVBAR */}
        <Navbar />
      </Router>
    </>
  );
}

export default App;
