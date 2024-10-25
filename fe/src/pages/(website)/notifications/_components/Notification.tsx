
import { useQuery } from '@tanstack/react-query';
import instanceClient from "@/configs/client";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Pagination } from 'antd';

interface Notification {
  id: number;
  user_id: number;
  tieu_de: string;
  noi_dung: string;
  loai: string;
  duong_dan: string;
  loai_duong_dan: string;
  id_duong_dan: string;
  da_doc: string;
  trang_thai_da_doc: string;
  hinh_thu_nho: string | null;
  created_at: string;
  updated_at: string;
}

const ITEMS_PER_PAGE = 4;

const getNotifications = async (): Promise<Notification[]> => {
  const response = await instanceClient.get('/thong-bao');
  return response.data;
};

const NotificationPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  });

  if (isLoading) return <div>Loading...</div>;

  const orderNotifications = notifications?.filter(notif => notif.loai === "Đơn hàng") || [];

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = orderNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const groupedNotifications = paginatedNotifications.reduce((groups: Record<string, Notification[]>, notification) => {
    const date = new Date(notification.created_at).toLocaleDateString('vi-VN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="lg:col-span-9 col-span-8 lg:pl-5">
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-xl font-bold">Thông báo Đơn hàng</h1>
        <button className="text-blue-500 text-sm">Đánh dấu Đã đọc tất cả</button>
      </div>

      {Object.entries(groupedNotifications).map(([date, notifications]) => (
        <div key={date} className="mt-6">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex justify-between items-end border-b border-hrBlack pb-5 mb-5">
              <div className="flex items-center">
                {notification.hinh_thu_nho ? (
                  <img
                    src={notification.hinh_thu_nho}
                    alt="notification"
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <i className="fa-regular fa-box w-14 h-14 bg-neutral-200 rounded-full text-center py-4 text-2xl" />
                )}
                <div className="px-4">
                  <Link to={`/${notification.duong_dan}/${notification.id_duong_dan}`}>
                    <h4 className="font-bold text-base mb-2">{notification.tieu_de}</h4>
                    <p className="text-[#A4A1AA]">{notification.noi_dung}</p>
                  </Link>
                </div>
              </div>
              <p className="text-[#A4A1AA] text-xs">
                {date}-{new Date(notification.created_at).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          onChange={handlePageChange}
          total={orderNotifications.length}
          pageSize={ITEMS_PER_PAGE}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default NotificationPage;
