import React, { useState } from "react";
import { Tabs, Input, List } from "antd";

const { TabPane } = Tabs;

// Define the data structure
const locationsData = {
  "Thành phố Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3", "Quận 4"],
  "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ", "Quận Cầu Giấy"],
  "Đà Nẵng": ["Quận Hải Châu", "Quận Cẩm Lệ", "Quận Thanh Khê"],
};

const wardsData = {
  "Quận Ba Đình": ["Phường 1", "Phường 2", "Phường 3"],
  "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Buồm"],
  "Quận Tây Hồ": ["Phường Phú Thượng", "Phường Nhật Tân"],
  // Add more wards for other districts if needed
};

const Test: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("1");
  const [selectedProvince, setSelectedProvince] = useState("");
  console.log(selectedProvince);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  console.log(selectedDistrict);

  const handleProvinceSelect = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict("");
    setActiveTab("2"); // Switch to "Quận/Huyện" tab
    setSearchTerm("");
  };

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    setActiveTab("3"); // Switch to "Phường/Xã" tab
    setSearchTerm("");
  };

  const getFilteredData = () => {
    if (activeTab === "1") {
      // Filter provinces
      return Object.keys(locationsData).filter((province) =>
        province.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "2" && selectedProvince) {
      // Filter districts of selected province
      return locationsData[selectedProvince].filter((district) =>
        district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (activeTab === "3" && selectedDistrict) {
      // Filter wards of selected district
      return (
        wardsData[selectedDistrict]?.filter((ward) =>
          ward.toLowerCase().includes(searchTerm.toLowerCase())
        ) || []
      );
    }
    return [];
  };

  return (
    <div className="w-full p-4 mt-20">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setSearchTerm("");
        }}
        className="custom-tabs"
      >
        <TabPane tab="Tỉnh/Thành phố" key="1">
          <Input
            placeholder="Tìm kiếm Tỉnh/Thành phố"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <List
            bordered
            dataSource={getFilteredData()}
            renderItem={(item) => (
              <List.Item onClick={() => handleProvinceSelect(item)}>
                {item}
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane tab="Quận/Huyện" key="2" disabled={!selectedProvince}>
          <Input
            placeholder={`Tìm kiếm Quận/Huyện trong ${selectedProvince}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <List
            bordered
            dataSource={getFilteredData()}
            renderItem={(item) => (
              <List.Item onClick={() => handleDistrictSelect(item)}>
                {item}
              </List.Item>
            )}
          />
        </TabPane>

        <TabPane tab="Phường/Xã" key="3" disabled={!selectedDistrict}>
          <Input
            placeholder={`Tìm kiếm Phường/Xã trong ${selectedDistrict}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          <List
            bordered
            dataSource={getFilteredData()}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Test;
