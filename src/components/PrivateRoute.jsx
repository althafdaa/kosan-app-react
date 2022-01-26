import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStats } from '../Hooks/useAuthStats';
import LoadingScreen from './LoadingScreen';

const PrivateRoute = () => {
  const { isLoggedIn, checkingStatus } = useAuthStats();

  if (checkingStatus) {
    return <LoadingScreen />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to='/sign-in' />;
};

export default PrivateRoute;
