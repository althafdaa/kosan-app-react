import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useAuthStats = () => {
  const [isLoggedIn, setIsLoggedId] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedId(true);
      }
      setCheckingStatus(false);
    });
  });

  return { isLoggedIn, checkingStatus };
};
