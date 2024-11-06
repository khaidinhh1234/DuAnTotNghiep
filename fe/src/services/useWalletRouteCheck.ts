import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useWalletRouteCheck = () => {
  const location = useLocation();

  useEffect(() => {
    const walletRoutes = [
      '/mypro/wallet',
      '/mypro/bank',
      '/mypro/naptien',
      '/mypro/WithdrawPage'
    ];

    if (!walletRoutes.some(route => location.pathname.includes(route))) {
      localStorage.removeItem('walletVerificationCode');
    }
  }, [location.pathname]);
};
