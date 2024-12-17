import { bank, logofooter } from "@/assets/img";
import instance from "@/configs/client";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [selectedMarker, setSelectedMarker] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 21.0322882,
    lng: 105.7505328,
  });

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg",
    libraries: ["places"],
  });

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["websiteInfo"],
    queryFn: async () => {
      const response = await instance.get("/thong-tin-web");
      return response.data;
    },
  });
  const mapContainerStyle = {
    width: "100%",
    height: "350px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    marginTop: "20px",
  };

  const onLoad = useCallback(() => {
    setTimeout(() => setMapLoaded(true), 500);
  }, []);

  const updateMapCenter = useCallback(() => {
    if (apiResponse?.data?.dia_chi && isLoaded) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { address: apiResponse.data.dia_chi },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            setMapCenter({
              lat: lat(),
              lng: lng(),
            });
          }
        }
      );
    }
  }, [apiResponse?.data?.dia_chi, isLoaded]);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    gestureHandling: "cooperative",
    language: "vi",
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    styles: [
      {
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        elementType: "labels.icon",
        stylers: [{ visibility: "on" }],
      },
      {
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }],
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#f5f5f5" }],
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels.text.fill",
        stylers: [{ color: "#bdbdbd" }],
      },
      {
        featureType: "poi",
        elementType: "geometry",
        stylers: [{ color: "#eeeeee" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#e5e5e5" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "road.arterial",
        elementType: "labels.text.fill",
        stylers: [{ color: "#757575" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#dadada" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#616161" }],
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
      {
        featureType: "transit.line",
        elementType: "geometry",
        stylers: [{ color: "#e5e5e5" }],
      },
      {
        featureType: "transit.station",
        elementType: "geometry",
        stylers: [{ color: "#eeeeee" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#c9c9c9" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9e9e9e" }],
      },
    ],
  };

  useEffect(() => {
    if (apiResponse && apiResponse.data) {
      localStorage.setItem("websiteInfo", JSON.stringify(apiResponse.data));
    }
  }, [apiResponse]);

  useEffect(() => {
    updateMapCenter();
  }, [apiResponse?.data?.dia_chi, updateMapCenter]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const websiteInfo = apiResponse?.data;

  return (
    <div>
      <footer className="bg-black text-white">
        <div className="container">
          <div className="grid grid-cols-12 gap-8 mx-4 py-14 border-b border-stone-700">
            <div className="lg:col-span-4 col-span-6">
              <div>
                <img
                  src={websiteInfo?.logo_website || logofooter}
                  alt=""
                  className="lg:w-[130px] w-28 h-auto"
                />
              </div>
              <div className="my-[39px] space-y-5 w-[261px]">
                <div className="*:px-1">
                  <i className="fa-regular fa-phone-volume text-lg" />
                  <span className="text-base">
                    <a href={`tel:${websiteInfo?.so_dien_thoai_dat_hang}`}>
                      {websiteInfo?.so_dien_thoai_dat_hang}
                    </a>
                  </span>
                </div>
                <div className="*:px-1">
                  <i className="fa-light fa-envelope text-lg" />
                  <span className="mx-1">
                    <a href={`mailto:${websiteInfo?.email}`}>
                      {websiteInfo?.email}
                    </a>
                  </span>
                </div>
                <div className="*:px-1 flex">
                  <i className="fa-regular fa-location-dot text-lg" />
                  <span className="mx-2 lg:w-full w-48">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(websiteInfo?.dia_chi || "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {websiteInfo?.dia_chi}
                    </a>
                  </span>
                </div>
              </div>
            </div>
            {/* 
            <div className="lg:col-span-2 col-span-6">
              <h1 className="text-xl font-semibold mb-3">Danh Mục Tin Tức</h1>
              <ul>
                {websiteInfo?.footer_blogs.slice(0, 5).map((category: any) => (
                  <li key={category.id} className="mb-3">
                    <Link to={`/tin-tuc/${category.duong_dan}`}>
                      {category.ten_danh_muc_tin_tuc}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}
            <div className="lg:col-span-2 col-span-6">
              <h1 className="text-xl font-semibold mb-3">Thông tin</h1>
              <ul>
                <li className="mb-3">
                  <Link to="/">
                    <p>Trang chủ</p>
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/ourstory">Giới thiệu</Link>
                </li>
                <li className="mb-3">
                  <Link to="/vourcher">Khuyến mãi</Link>
                </li>
                <li className="mb-3">
                  <Link to="/blog">Bài viết</Link>
                </li>
                <li className="mb-3">
                  <Link to="/contact">Liên hệ</Link>
                </li>
                <li className="mb-3">
                  <Link to="/shop/tre-em">Trẻ em</Link>
                </li>
                <li className="mb-3">
                  <Link to="/shop/nam">Nam</Link>
                </li>
                <li className="mb-3">
                  <Link to="/shop/nu">Nữ</Link>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-2 col-span-6">
              <h1 className="text-xl font-semibold mb-3">Tin Tức</h1>
              <ul>
                {websiteInfo?.footer_blogs.slice(0, 8).map((category: any) => (
                  <li key={category.id} className="mb-3">
                    <Link to={`/danhmuctintuc/${category.duong_dan}`}>
                      {category.ten_danh_muc_tin_tuc}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul>
                {websiteInfo?.footer_blogs?.map((category: any) =>
                  category.tin_tuc?.slice(0, 6).map((news: any) => (
                    <li key={news.id} className="mb-3">
                      <Link
                        to={`/danhmuctintuc/${category.duong_dan}/${news.duong_dan}`}
                      >
                        {news.tieu_de}
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="lg:col-span-4 col-span-6">
              <h1 className="text-xl font-semibold mb-4">Địa Chỉ</h1>
              <p className="lg:w-80 mb-5">{websiteInfo?.cau_noi}</p>
              <div className="relative">
                {isLoaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={15}
                      options={mapOptions}
                      onLoad={onLoad}
                    >
                      {mapLoaded && (
                        <>
                          <Marker
                            position={mapCenter}
                            animation={google.maps.Animation.DROP}
                            onClick={() => setSelectedMarker(true)}
                          />

                          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg z-10 max-w-[250px]">
                            <h3 className="font-bold text-gray-800 text-base mb-1">
                              Glow Clothing
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {websiteInfo?.dia_chi}
                            </p>
                            <button
                              className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors w-full flex items-center justify-center gap-2"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`
                                )
                              }
                            >
                              <i className="fas fa-directions"></i>
                              Chỉ đường
                            </button>
                          </div>
                        </>
                      )}
                    </GoogleMap>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-betweend py-2">
            <div>
              <img src={bank} alt="" className="h-7" />
            </div>
            <div className="text-center mx-auto py-3">
              © 2024 Glow Clothing.
            </div>
            <div className="*:text-2xl *:px-3">
              <a
                href={websiteInfo?.link_facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fa-brands fa-facebook"
                  style={{ color: "#ffffff" }}
                />
              </a>
              <a
                href={websiteInfo?.link_instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                href={websiteInfo?.link_youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fa-brands fa-youtube"
                  style={{ color: "#ffffff" }}
                />
              </a>
              <a
                href={websiteInfo?.link_youtube}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i
                  className="fa-brands fa-tiktok"
                  style={{ color: "#ffffff" }}
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
