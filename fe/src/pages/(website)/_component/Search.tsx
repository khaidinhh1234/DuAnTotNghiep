// import { SearchOutlined } from "@ant-design/icons";
// import { Input, Modal } from "antd";
// import { useEffect, useState } from "react";
// import instanceClient from "@/configs/client";
// import { useQuery } from "@tanstack/react-query";
// import { Link } from "react-router-dom";

// interface SearchResult {
//   id: number;
//   danh_muc_id: number;
//   ten_san_pham: string;
//   anh_san_pham: string;
//   ma_san_pham: string;
//   duong_dan: string;
//   mo_ta_ngan: string;
//   noi_dung: string;
//   luot_xem: number;
//   trang_thai: number;
//   gia_tot: number;
//   hang_moi: number;
//   created_at: string;
//   updated_at: string;
//   deleted_at: null;
// }

// const Search = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [searchValue, setSearchValue] = useState("");

//   const { data: searchResults, refetch } = useQuery({
//     queryKey: ["search", searchValue],
//     queryFn: async () => {
//       if (!searchValue.trim()) return [];
//       const response = await instanceClient.get(`/tim-kiem-goi-y?query=${encodeURIComponent(searchValue)}`);
//       return response.data;
//     },
//     enabled: false
//   });

//   const handleSearch = async (value: string) => {
//     setSearchValue(value);
//     if (value.trim()) {
//       await refetch();
//     }
//   };

//   return (
//     <div className="relative">
//       <SearchOutlined 
//         className="text-xl cursor-pointer" 
//         onClick={() => setIsModalVisible(true)}
//       />
      
//       <Modal
//         open={isModalVisible}
//         onCancel={() => {
//           setIsModalVisible(false);
//           setSearchValue("");
//         }}
//         footer={null}
//         width={800}
//         title="Tìm kiếm sản phẩm"
//       >
//         <div className="space-y-4">
//           <Input
//             placeholder="Nhập từ khóa tìm kiếm"
//             size="large"
//             value={searchValue}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
// <div className="max-h-[60vh] overflow-y-auto px-4">
//   {searchResults?.length > 0 ? (
//     <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
//       {searchResults.map((item: SearchResult) => (
//         <Link 
//           to={`/product-detail/${item.duong_dan}`} 
//           key={item.id}
//           onClick={() => setIsModalVisible(false)}
//         >
//           <div className="border rounded-lg p-4 hover:shadow-xl transition-shadow bg-white">
//             <img 
//               src={item.anh_san_pham} 
//               alt={item.ten_san_pham}
//               className="w-full h-60 object-cover rounded-md"
//             />
//             <h3 className="font-medium mt-3 text-gray-800 line-clamp-2">
//               {item.ten_san_pham}
//             </h3>
//             <p className="text-sm text-gray-500 mt-1">{item.ma_san_pham}</p>
//           </div>
//         </Link>
//       ))}
//     </div>
//   ) : searchValue && (
//     <div className="text-center py-8 text-gray-500">
//       Không tìm thấy kết quả phù hợp
//     </div>
//   )}
// </div>

//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default Search;
import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useEffect, useState } from "react";
import instanceClient from "@/configs/client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

interface SearchResult {
  id: number;
  danh_muc_id: number;
  ten_san_pham: string;
  anh_san_pham: string;
  ma_san_pham: string;
  duong_dan: string;
  mo_ta_ngan: string;
  noi_dung: string;
  luot_xem: number;
  trang_thai: number;
  gia_tot: number;
  hang_moi: number;
  created_at: string;
  updated_at: string;
  deleted_at: null;
}

const Search = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const { data: searchResults, refetch } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return [];
      const response = await instanceClient.get(`/tim-kiem-goi-y?query=${encodeURIComponent(searchValue)}`);
      return response.data;
    },
    enabled: false
  });

  const handleSearch = async (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      const results = await refetch();
      // Only save to history if search returned results
      if (results.data && results.data.length > 0) {
        if (!searchHistory.includes(value.trim())) {
          const newHistory = [value.trim(), ...searchHistory.slice(0, 9)];
          setSearchHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }
      }
    }
  };
  

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="relative">
      <SearchOutlined 
        className="text-xl cursor-pointer" 
        onClick={() => setIsModalVisible(true)}
      />
      
      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSearchValue("");
        }}
        footer={null}
        width={800}
        title="Tìm kiếm sản phẩm"
      >
        <div className="space-y-4">
          <Input
            placeholder="Nhập từ khóa tìm kiếm"
            size="large"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="rounded-full px-4 py-2"
          />
          
          {!searchValue && searchHistory.length > 0 && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Lịch sử tìm kiếm</h3>
                <button 
                  onClick={clearHistory}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  Xóa lịch sử
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-1 text-sm"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto px-4">
            {searchResults?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {searchResults.map((item: SearchResult) => (
                  <Link 
                    to={`/product-detail/${item.duong_dan}`} 
                    key={item.id}
                    onClick={() => setIsModalVisible(false)}
                  >
                    <div className="border rounded-lg p-4 hover:shadow-xl transition-shadow bg-white">
                      <img 
                        src={item.anh_san_pham} 
                        alt={item.ten_san_pham}
                        className="w-full h-60 object-cover rounded-md"
                      />
                      <h3 className="font-medium mt-3 text-gray-800 line-clamp-2">
                        {item.ten_san_pham}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.ma_san_pham}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : searchValue && (
              <div className="text-center py-8 text-gray-500">
                Không tìm thấy kết quả phù hợp
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Search;
