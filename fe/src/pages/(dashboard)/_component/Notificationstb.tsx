import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Pagination, Spin } from 'antd';
import instance from '@/configs/admin';
import instanceClient from '@/configs/client';

type NotificationType = keyof typeof NOTIFICATION_TYPES;

const NOTIFICATION_TYPES = {
    ALL: 'Tất cả',
    ORDER: 'Đơn hàng',
    PROMOTION: 'Ưu đãi', 
    WALLET: 'Ví tiền'
  } as const;

interface NotificationResponse {
  data: Notification[];
  thong_bao_chua_doc: number;
}

interface Notification {
  id: number;
  user_id: number;
  tieu_de: string;
  noi_dung: string;
  loai: string;
  duong_dan: string;
  loai_duong_dan: string | null;
  id_duong_dan: string;
  da_doc: string;
  trang_thai_da_doc: string;
  hinh_thu_nho: string;
  created_at: string;
  updated_at: string;
}

interface GroupedNotifications {
  [date: string]: Notification[];
}

const ITEMS_PER_PAGE = 6;

const NotificationPage1 = (): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>(NOTIFICATION_TYPES.ALL);
  const queryClient = useQueryClient();

  const { data: notificationResponse, isLoading } = useQuery<NotificationResponse>({
    queryKey: ['notifications', selectedType],
    queryFn: async () => {
      const response = await instance.get<NotificationResponse>(
        selectedType === NOTIFICATION_TYPES.ALL 
          ? '/thong-bao'
          : `/thong-bao?loai=${selectedType}`
      );
      return response.data;
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await instance.post(`/thong-bao/da-doc/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await instanceClient.post('/thong-bao/da-doc-tat-ca');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
  

  const handleNotificationClick = (notification: Notification): void => {
    if (notification.trang_thai_da_doc === "0") {
      markAsReadMutation.mutate(notification.id);
    }
  };


  if (isLoading)
    return (
      <div>
        <div className="flex items-center justify-center mt-[250px]">
          <div className=" ">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  const notifications = notificationResponse?.data || [];
  const filteredNotifications = selectedType === NOTIFICATION_TYPES.ALL 
    ? notifications 
    : notifications.filter((notif: Notification) => notif.loai === selectedType);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const groupedNotifications = paginatedNotifications.reduce((groups: GroupedNotifications, notification) => {
    const date = new Date(notification.created_at).toLocaleDateString('vi-VN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const hasUnreadNotifications = filteredNotifications.some(
    (notification: Notification) => notification.trang_thai_da_doc === "0"
  );

  const getNotificationLink = (notification: Notification): string => {
    switch (notification.loai) {
      case NOTIFICATION_TYPES.PROMOTION:
        return '/admin/chuongtrinhuudai';
      case NOTIFICATION_TYPES.WALLET:
        return '/admin/orders/ruttien';
      case NOTIFICATION_TYPES.ORDER:
        return '/admin/orders/list';
      default:
        return '#';
    }
  };

  if (filteredNotifications.length === 0) {
    return (
        
        <div className="flex  w-[1500px] mt-10 ml-10">
        <div className="w-64 bg-white shadow-md mr-6 h-fit">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Loại thông báo</h2>
            <ul className="space-y-2">
              {Object.values(NOTIFICATION_TYPES).map((type) => (
                <li 
                  key={type}
                  className={`
                    cursor-pointer p-2 rounded
                    ${selectedType === type 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100'
                    }
                  `}
                  onClick={() => {
                    setSelectedType(type);
                    setCurrentPage(1);
                  }}
                >
                  <div className="flex items-center">
                    {type === NOTIFICATION_TYPES.ALL && <i className="fas fa-bell mr-2" />}
                    {type === NOTIFICATION_TYPES.ORDER && <i className="fas fa-shopping-cart mr-2" />}
                    {type === NOTIFICATION_TYPES.PROMOTION && <i className="fas fa-tag mr-2" />}
                    {type === NOTIFICATION_TYPES.WALLET && <i className="fas fa-wallet mr-2" />}
                    {type}
                    <span className="ml-auto">
                      {notifications.filter(n => 
                        type === NOTIFICATION_TYPES.ALL || n.loai === type
                      ).length}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center p-4 bg-white shadow">
            <h1 className="text-xl font-bold">Thông báo {selectedType}</h1>
          </div>
          <div className="flex flex-col items-center justify-center py-10 pt-36">
            <img src="/public/Shop.png" alt="No Notifications" className="w-48 h-48" />
            <p className="text-gray-500 mt-10">Chưa có thông báo nào</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex  w-[1500px] mt-10 ml-10">
      <div className="w-64 bg-white shadow-md mr-6 h-fit">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Loại thông báo</h2>
          <ul className="space-y-2">
            {Object.values(NOTIFICATION_TYPES).map((type) => (
              <li 
                key={type}
                className={`
                  cursor-pointer p-2 rounded
                  ${selectedType === type 
                    ? 'bg-blue-500 text-white' 
                    : 'hover:bg-gray-100'
                  }
                `}
                onClick={() => {
                  setSelectedType(type);
                  setCurrentPage(1);
                }}
              >
                <div className="flex items-center">
                  {type === NOTIFICATION_TYPES.ALL && <i className="fas fa-bell mr-2" />}
                  {type === NOTIFICATION_TYPES.ORDER && <i className="fas fa-shopping-cart mr-2" />}
                  {type === NOTIFICATION_TYPES.PROMOTION && <i className="fas fa-tag mr-2" />}
                  {type === NOTIFICATION_TYPES.WALLET && <i className="fas fa-wallet mr-2" />}
                  {type}
                  <span className="ml-auto">
                    {notifications.filter(n => 
                      type === NOTIFICATION_TYPES.ALL || n.loai === type
                    ).length}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-xl font-bold">Thông báo {selectedType}</h1>
          {hasUnreadNotifications && (
            <button 
              className="text-blue-500 text-sm hover:text-blue-700 transition-colors duration-200"
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
            >
              {markAllAsReadMutation.isPending ? 'Đang xử lý...' : 'Đánh dấu Đã đọc tất cả'}
            </button>
          )}
        </div>

        {Object.entries(groupedNotifications).map(([date, notifications]) => (
          <div key={date} className="mt-6">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`flex justify-between items-end border-b border-hrBlack pb-5 mb-5 cursor-pointer transition-colors duration-200 ${
                  notification.trang_thai_da_doc === "0" 
                    ? 'bg-gray-300 hover:bg-white' 
                    : 'bg-white hover:bg-gray-100'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
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
                    <Link to={getNotificationLink(notification)}>
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

<div className="flex justify-end">
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={filteredNotifications.length}
            pageSize={ITEMS_PER_PAGE}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage1;
