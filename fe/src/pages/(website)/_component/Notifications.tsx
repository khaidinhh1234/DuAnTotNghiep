
import React, { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import instance from '@/configs/client';
interface NotificationsProps {
  onUnreadCountChange: (count: number) => void;
}
interface Notification {
  id: number;
  tieu_de: string;
  noi_dung: string;
  hinh_thu_nho: string;
  trang_thai_da_doc: "0" | "1";
  duong_dan: string;
  id_duong_dan: string;
  created_at: string;
}

interface NotificationResponse {
  data: Notification[];
  thong_bao_chua_doc: number;
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

const fetchNotifications = async (): Promise<NotificationResponse> => {
  const response = await instance.get<NotificationResponse>('/thong-bao');
  return response.data;
};

const markAsRead = async (notificationId: number): Promise<void> => {
  await instance.post(`/thong-bao/da-doc/${notificationId}`);
};

const Notifications: React.FC<NotificationsProps> = ({ onUnreadCountChange }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notificationResponse, isLoading, error } = useQuery<NotificationResponse, Error>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 30000
  });
  useEffect(() => {
    if (notificationResponse?.thong_bao_chua_doc !== undefined) {
      onUnreadCountChange(notificationResponse.thong_bao_chua_doc);
    }
  }, [notificationResponse?.thong_bao_chua_doc, onUnreadCountChange]);
  const handleNotificationClick = async (notification: Notification): Promise<void> => {
    if (notification.trang_thai_da_doc === "0") {
      await markAsRead(notification.id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
    if (notification.duong_dan) {
      navigate(`/${notification.duong_dan}/${notification.id_duong_dan}`);
    }
  };

  return (
    <div className="relative w-96 -right-3 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="absolute -top-2 right-1 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-stone-500"></div>
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
      <h2 className='font-bold '>Thông báo</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Đang tải thông báo...</div>
      ) : error || !notificationResponse?.data.length ? (
        <div className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <svg 
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <p className="text-gray-500 text-lg">Không có thông báo nào</p>
          </div>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
            {notificationResponse.data.map((notification) => (
              <NotificationItem 
                key={notification.id} 
                notification={notification}
                onNotificationClick={handleNotificationClick}
              />
            ))}
          </ul>
          
          <div className="p-4 border-t border-gray-200">
            <a 
              href="/mypro/notification" 
              className="block text-center text-sm text-black-600 hover:text-blue-800"
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
