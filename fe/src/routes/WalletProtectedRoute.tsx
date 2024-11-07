import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function WalletProtectedRoute({ children }: { children: React.ReactNode }) {
  const hasVerification = localStorage.getItem('walletVerificationCode');
  const location = useLocation();

  useEffect(() => {
    return () => {
      // Cleanup when leaving wallet routes
      if (!location.pathname.includes('/mypro/wallet') && 
          !location.pathname.includes('/mypro/bank') && 
          !location.pathname.includes('/mypro/naptien') &&
          !location.pathname.includes('/mypro/WithdrawPage')) {
        localStorage.removeItem('walletVerificationCode');
      }
    };
  }, [location]);

  if (!hasVerification && location.pathname !== '/mypro/wallet') {
    return <Navigate to="/mypro/wallet" replace />;
  }

  return <>{children}</>;
}

export default WalletProtectedRoute;
