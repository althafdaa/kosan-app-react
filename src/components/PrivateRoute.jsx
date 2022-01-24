import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStats } from '../Hooks/useAuthStats';

const PrivateRoute = () => {
  const { isLoggedIn, checkingStatus } = useAuthStats();

  if (checkingStatus) {
    return <h3 className='text-xl font-bold'>Loading</h3>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
