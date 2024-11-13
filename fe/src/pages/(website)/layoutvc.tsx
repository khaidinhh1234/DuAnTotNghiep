

import { useWalletRouteCheck } from "@/services/useWalletRouteCheck";
import MenuIcon from "../(van_chuyen)/menu";
import { useState } from "react";
import { Link } from "react-router-dom";


const Layoutvc = () => {
  useWalletRouteCheck();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 cursor-pointer"
      >
        <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-600 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-gray-600 transition-transform duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
         <Link to="/shipper2"><p  className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Vận chuyển</p></Link> 
         <Link  to="/return-orders"> <p className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Hoàn hàng</p> </Link>
        </div>
      )}
    </div>
  );
};

export default Layoutvc;
