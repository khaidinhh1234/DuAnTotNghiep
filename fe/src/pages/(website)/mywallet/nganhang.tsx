
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import instanceClient from "@/configs/client";
import CreditCardForm from "./cart";
import { Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const banks = [
  { name: 'Agribank', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730368831/Agribank_dk6etr.png' },
  { name: 'BIDV', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730368831/Remove-bg.ai_1730368278163_z2amlh.png' },
  { name: 'VietinBank', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730368830/vietinbank-logo_wijgpc.png' },
  { name: 'MB', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730369995/Logo_MB_new_vncg2s.png' },
  { name: 'SCB', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730368830/y_nghi_logo_scb_truc_ngang_1__lcjqv6.webp' },
  { name: 'Techcombank', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730370081/Techcombank_logo_gqwney.png' },
  { name: 'TPBank', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730368830/Logo-TPBank_mkek2w.webp' },
  { name: 'VPBank', logo: 'https://res.cloudinary.com/dpundwxg1/image/upload/v1730368831/VPBank_logo.svg_eciill.png' },
];

const fetchLinkedBanks = async () => {
  const response = await instanceClient.get('/danh-sach-ngan-hang');
  return response.data?.data?.map((bank: any) => ({
    accountNumber: bank.tai_khoan_ngan_hang,
    accountHolder: bank.ten_chu_tai_khoan,
    bankName: bank.ngan_hang,
    id: bank.id,
    logo: bank.logo_ngan_hang
  }));
};

interface Bank {
  name: string;
  logo: string;
  accountNumber: string;
  accountHolder: string;
  bankName: string;
  id: string;
  userId?: string;
}

const BankAccount = () => {
  const [showBankSelection, setShowBankSelection] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: linkedBanks = [], isLoading, isError } = useQuery({
    queryKey: ['linkedBanks'],
    queryFn: fetchLinkedBanks,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0
  });

  const deleteBankMutation = useMutation({
    mutationFn: (bankId: string) => {
      return instanceClient.post(`/huy-lien-ket-ngan-hang/${bankId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedBanks'] });
      toast.success('Xóa tài khoản ngân hàng thành công');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  });

  const handleBankClick = (bankId: any) => {
    setSelectedBankId(selectedBankId === bankId ? null : bankId);
  };

  const handleBankSelection = (bank: any) => {
    setSelectedBank({
      name: bank?.name,
      logo: bank?.logo,
      accountNumber: bank?.accountNumber,
      accountHolder: bank?.accountHolder,
      bankName: bank?.bankName,
      id: bank?.id,
      userId: bank?.userId,
    });
    setShowCreditCardModal(true);
    setShowBankSelection(false);
  };

  const handleModalClose = () => {
    setShowCreditCardModal(false);
    queryClient.invalidateQueries({ queryKey: ['linkedBanks'] });
  };

  const handleWithdraw = () => {
    const selectedBankId = selectedBanks[0];
    const selectedBank = linkedBanks.find((bank: { id: string }) => bank.id === selectedBankId);
    navigate('/mypro/WithdrawPage', {
      state: {
        bankData: {
          id: selectedBankId,
          bankName: selectedBank?.bankName,
          accountNumber: selectedBank?.accountNumber,
          accountHolder: selectedBank?.accountHolder,
          logo: selectedBank?.logo,
        }
      }
    });
  };

  const handleCheckboxChange = (bankId: string, checked: boolean) => {
    setSelectedBanks(checked ? [bankId] : []);
  };

  const handleDeleteBank = (bankId: string) => {
    deleteBankMutation.mutate(bankId);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-500">
        Không thể tải dữ liệu. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative">
      <div className="flex items-center justify-between px-4 py-4 bg-white font-bold text-lg border-b border-gray-200">
        <div className="flex items-center">
          <Link to="/mypro/wallet">
            <i className="fa-light fa-wallet mr-2"></i>
          </Link>
          Tài khoản Ngân hàng liên kết
        </div>
        {selectedBanks.length > 0 && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            onClick={handleWithdraw}
          >
            Rút tiền
          </button>
        )}
      </div>

      {showCreditCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
            <button
              onClick={handleModalClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-times text-xl"></i>
            </button>
            {selectedBank && <CreditCardForm bankData={selectedBank} />}
          </div>
        </div>
      )}

      {!showBankSelection && (
        <>
          {linkedBanks.map((bank: any) => (
            <div key={bank.id}>
              <div
                className="flex items-center px-2 py-2 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                onClick={() => handleBankClick(bank.id)}
              >
                <Checkbox
                  onClick={(event) => event.stopPropagation()}
                  onChange={(e) => handleCheckboxChange(bank.id, e.target.checked)}
                  checked={selectedBanks.includes(bank.id)}
                />
                <img src={bank.logo} alt={bank.bankName} className="w-12 h-12 mr-3 object-contain" />
                <div className="flex-1">
                  <div className="font-medium">{bank.bankName}</div>
                  <div className="text-sm text-gray-500">{bank.accountHolder}</div>
                </div>
                <div className="text-gray-500">***{bank.accountNumber.slice(-4)}</div>
                <div className={`w-3 h-3 ml-2 transform border-r-2 border-b-2 border-gray-500 transition-transform duration-200 ${selectedBankId === bank.id ? 'rotate-[225deg]' : 'rotate-45'}`}></div>
              </div>
              <div 
                className={`bg-gray-50 overflow-hidden transition-all duration-300 ease-in-out ${
                  selectedBankId === bank.id ? 'max-h-64 py-4' : 'max-h-0'
                }`}
              >
                <div className="px-4 space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">Số tài khoản</label>
                    <p className="font-medium">****{bank.accountNumber.slice(-4)}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Chủ tài khoản</label>
                    <p className="font-medium">{bank.accountHolder}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Ngân hàng</label>
                    <p className="font-medium">{bank.bankName}</p>
                  </div>
                  <button 
                    className="w-full py-2.5 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBank(bank.id);
                    }}
                  >
                    Xóa liên kết
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div 
            className="flex items-center px-4 py-4 bg-white border-b border-gray-200 cursor-pointer hover:bg-gray-100 text-gray-500"
            onClick={() => setShowBankSelection(true)}
          >
            <i className="fa-light fa-square-plus mr-2"></i>
            Thêm Tài khoản Ngân hàng liên kết
          </div>
        </>
      )}

      {showBankSelection && (
        <div className="max-w-screen-md mx-auto p-4 mt-6">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => setShowBankSelection(false)}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl">Thêm Tài khoản Ngân hàng liên kết</h1>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {banks.map((bank) => (
              <div 
                key={bank.name} 
                className="text-center cursor-pointer hover:opacity-80 p-4 border rounded-lg transition-transform hover:scale-105"
                onClick={() => handleBankSelection(bank)}
              >
                <img src={bank.logo} alt={bank.name} className="mx-auto w-24 h-24 object-contain" />
                <p className="mt-2 text-sm font-medium">{bank.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BankAccount;
