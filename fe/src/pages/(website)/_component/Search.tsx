import { SearchOutlined } from "@ant-design/icons";
import { Input, Modal } from "antd";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import instanceClient from "@/configs/client";
import { logo } from "@/assets/img";
import debounce from "lodash/debounce";

interface SearchResponse {
  status: boolean;
  status_code: number;
  message: string;
  san_pham: {
    original: {
      data: {
        data: SearchResult[];
      };
    };
  };
}

interface SearchResult {
  id: number;
  ten_san_pham: string;
  duong_dan: string;
  anh_san_pham: string;
  hang_moi: number;
  gia_thap_nhat: number;
  gia_cao_nhat: number;
  mau_sac_va_anh: {
    ma_mau_sac: string;
    ten_mau_sac: string;
    hinh_anh: string;
  }[];
  trang_thai_yeu_thich: boolean;
}

interface SearchHistory {
  tim_kiem: string;
  id: number;
}

const Search = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const [hoveredVariantIndex, setHoveredVariantIndex] = useState<number | null>(
    null
  );
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const response = await instanceClient.get("/lich-su-tim-kiem");
      return response.data;
    },
    enabled: isModalVisible,
  });

  const { data: searchResponse, refetch } = useQuery<SearchResponse>({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      if (!searchValue.trim()) return null;
      const response = await instanceClient.post(
        `/tim-kiem-goi-y?query=${encodeURIComponent(searchValue.trim())}`
      );
      return response.data;
    },
    enabled: false,
  });

  const removeSearchTerm = async (id: number) => {
    try {
      await instanceClient.delete(`/tim-kiem-goi-y/xoa/${id}`);
      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error removing search term:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await instanceClient.delete("/tim-kiem-goi-y/xoa-toan-bo");
      setSearchHistory([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        refetch();
      }
    }, 500),
    []
  );

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      debouncedSearch(value);
    }
  };

  const handleHistoryItemClick = (searchTerm: string) => {
    setSearchValue(searchTerm);
    debouncedSearch(searchTerm);
  };

  useEffect(() => {
    if (historyData?.data) {
      setSearchHistory(historyData.data);
    }
  }, [historyData]);

  const handleMouseEnter = (productId: number, variantIndex: number) => {
    setHoveredProductId(productId);
    setHoveredVariantIndex(variantIndex);
  };

  const renderProductCard = (product: SearchResult) => (
    <div className="container" key={product.id}>
      <div className="xl:col-span-3 lg:col-span-4 col-span-12 md:col-span-6 mb-2 w-[250px] mx-auto lg:mx-0">
        <div className="product-card hover:bg-zinc-100 rounded-md shadow-lg shadow-black/10">
          <div className="relative w-full h-[300px]">
            <Link
              to={`/product-detail/${product.duong_dan}`}
              onClick={() => setIsModalVisible(false)}
            >
              <div className="relative">
                <img
                  src={
                    hoveredProductId === product.id &&
                    hoveredVariantIndex !== null
                      ? product.mau_sac_va_anh[hoveredVariantIndex].hinh_anh
                      : product.anh_san_pham
                  }
                  alt={product.ten_san_pham}
                  className="w-full h-[300px] object-cover rounded-t-md"
                />
                {product.hang_moi === 1 && (
                  <span className="absolute top-3 left-4 bg-red-500 text-white px-2 py-[2px] rounded-md text-sm font-bold">
                    Mới
                  </span>
                )}
              </div>
            </Link>
          </div>

          <div className="bg-slate-50 pt-3 px-3 rounded-md pb-5">
            <Link
              to={`/product-detail/${product.duong_dan}`}
              onClick={() => setIsModalVisible(false)}
            >
              <h5 className="text-lg truncate w-full font-medium hover:text-red-500 text-black">
                {product.ten_san_pham}
              </h5>
            </Link>

            <p className="font-semibold text-base">
              {product.gia_thap_nhat === product.gia_cao_nhat ? (
                `${product.gia_cao_nhat.toLocaleString("vi-VN")} đ`
              ) : (
                <>
                  {`${product.gia_thap_nhat.toLocaleString("vi-VN")} đ`}
                  <i className="fa-solid fa-minus text-xs mx-1 text-slate-500"></i>
                  {`${product.gia_cao_nhat.toLocaleString("vi-VN")} đ`}
                </>
              )}
            </p>

            <div className="font-bold text-base flex items-center">
              {product.mau_sac_va_anh?.map((item, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full border mr-1 ${
                    hoveredProductId === product.id &&
                    hoveredVariantIndex === index
                      ? "border-black"
                      : "border-gray-300 hover:border-black"
                  }`}
                  style={{ backgroundColor: item.ma_mau_sac }}
                  onMouseEnter={() => handleMouseEnter(product.id, index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSearchHistory = () => {
    if (!searchValue && searchHistory.length > 0) {
      return (
        <div className="p-4 flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className="text-gray-600 font-medium mr-96">
              Tìm kiếm gần đây
            </h3>
            <button
              onClick={clearHistory}
              className="text-gray-400 hover:text-gray-600"
            >
              <i className="far fa-trash-alt text-lg"></i>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 w-[500px]">
            {searchHistory.map((item) => (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => handleHistoryItemClick(item.tim_kiem)}
                  className="border border-gray-300 text-gray-600 rounded-full px-4 py-1 text-sm hover:bg-gray-200 transition"
                >
                  {item.tim_kiem}
                </button>
                <button
                  onClick={() => removeSearchTerm(item.id)}
                  className="absolute top-0 right-0 -mt-1 -mr-1 text-gray-500 hover:text-gray-700 text-xs p-1 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderSearchResults = () => {
    const products = searchResponse?.san_pham?.original?.data?.data || [];

    return (
      <>
        {searchValue && (
          <div className="mb-4 px-24">
            <h2 className="text-xl font-medium">
              {products.length > 0
                ? `Kết quả tìm kiếm cho "${searchValue}"`
                : `Không tìm thấy kết quả cho "${searchValue}"`}
            </h2>
          </div>
        )}

        {products.length === 0 && searchValue ? (
          <div className="text-center py-8 text-gray-500">
            {`Không tìm thấy sản phẩm phù hợp "${searchValue}"`}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 justify-center gap-4">
              {products.slice(0, 6).map((item, index) => (
                <div key={index} className="px-20">
                  {renderProductCard(item)}
                </div>
              ))}
            </div>

            {products.length > 0 && (
              <div className="text-center mt-6">
                <Link
                  to={`/search-results?query=${encodeURIComponent(searchValue)}`}
                  className="inline-block px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                  onClick={() => setIsModalVisible(false)}
                >
                  Xem tất cả ({products.length} sản phẩm)
                </Link>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="relative">
      <div
        className="flex items-center px-5 py-2 rounded-full bg-gray-100 border border-gray-300 cursor-pointer hover:bg-gray-200"
        onClick={() => setIsModalVisible(true)}
      >
        <SearchOutlined className="text-2xl mr-3" />
        <span className="text-gray-500 text-lg">Tìm kiếm</span>
      </div>

      <Modal
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSearchValue("");
        }}
        footer={null}
        width="100vw"
        className="search-modal"
        modalRender={(modal) => (
          <div style={{ marginTop: "-90px", padding: "0" }}>{modal}</div>
        )}
        closeIcon={
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <span className="text-gray-600">&times;</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="relative w-full flex justify-center">
            <img
              src={logo}
              alt="Logo"
              style={{
                position: "absolute",
                left: "100px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "120px",
                height: "35px",
              }}
            />

            <Input
              placeholder="Tìm kiếm"
              size="large"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                flex: 1,
                borderRadius: "9999px",
                padding: "15px 20px",
                border: "2px solid #cfe8ea",
                outline: "none",
                maxWidth: "600px",
              }}
            />
          </div>

          {renderSearchHistory()}
          {searchValue && renderSearchResults()}
        </div>
      </Modal>
    </div>
  );
};

export default Search;
