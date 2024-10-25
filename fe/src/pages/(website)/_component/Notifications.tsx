import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import instance from '@/configs/client';

interface Notification {
  id: number;
  tieu_de: string;
  noi_dung: string;
  hinh_thu_nho: string | null;
  trang_thai_da_doc: "0" | "1";
  duong_dan: string | null;
  created_at: string;
}

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick: (notification: Notification) => void;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  });
};

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onNotificationClick }) => (
  <li 
    onClick={() => onNotificationClick(notification)}
    className={`flex items-start p-3 hover:bg-gray-50 cursor-pointer ${notification.trang_thai_da_doc === "0" ? 'bg-blue-50' : ''}`}
  >
    <div className="flex-shrink-0">
      <img 
        src={notification.hinh_thu_nho || '/default-notification-icon.png'} 
        alt="" 
        className="w-10 h-10 rounded-full"
      />
    </div>
    <div className="ml-3 flex-1">
      <div className="text-sm font-medium text-gray-900">{notification.tieu_de}</div>
      <div className="text-sm text-gray-500">{notification.noi_dung}</div>
      <div className="text-xs text-gray-400 mt-1">{formatDate(notification.created_at)}</div>
    </div>
  </li>
);

const fetchNotifications = async (): Promise<Notification[]> => {
  const response = await instance.get<Notification[]>('/thong-bao');
  return response.data;
};

const markAsRead = async (notificationId: number): Promise<void> => {
  await instance.put(`/thong-bao/${notificationId}/mark-read`);
};

const markAllAsRead = async (): Promise<void> => {
  await instance.put('/thong-bao/mark-all-read');
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { data: notifications, isLoading, error } = useQuery<Notification[], Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000
  });

  const handleNotificationClick = async (notification: Notification): Promise<void> => {
    if (notification.trang_thai_da_doc === "0") {
      await markAsRead(notification.id);
      queryClient.invalidateQueries(['notifications']);
    }
    if (notification.duong_dan) {
      navigate(`/${notification.duong_dan}`);
    }
  };

  const handleMarkAllAsRead = async (): Promise<void> => {
    await markAllAsRead();
    queryClient.invalidateQueries(['notifications']);
  };

  return (
<div className="relative w-96 -right-3 bg-white rounded-lg shadow-xl border border-gray-200">
<div className="absolute -top-2 right-1 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-stone-500"></div>  
    <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm text-black-600 hover:text-blue-800"
          >
            Đánh dấu tất cả đã đọc
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Đang tải thông báo...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">Có lỗi xảy ra khi tải thông báo</div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {notifications?.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onNotificationClick={handleNotificationClick}
              />
            ))}
          </ul>
          
          <div className="p-4 border-t border-gray-200">
            <a 
              href="/notifications" 
              className="block text-center text-sm  text-black-600 hover:text-blue-800"
            >
              Xem tất cả
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
