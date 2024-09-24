import React, { useState } from "react";
import { Select, Space, Button, Divider, Input } from "antd";
import type { SelectProps } from "antd";

const options: SelectProps["options"] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Grape", value: "grape" },
];

const Test: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelectAll = () => {
    const allValues = options.map((option) => option.value);
    setSelectedValues(allValues);
    setIsAllSelected(true);
  };

  const handleDeselectAll = () => {
    setSelectedValues([]);
    setIsAllSelected(false);
  };

  const handleChange = (value: string[]) => {
    setSelectedValues(value);
    setIsAllSelected(value.length === options.length);
    console.log(`Selected: ${value}`);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    console.log("Submitted Values:", selectedValues);
  };

  return (
    <Space style={{ width: "100%" }} direction="vertical">
      <Input
        placeholder="Tìm kiếm theo label"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 8 }}
      />
      <Select
        mode="multiple"
        allowClear
        style={{ width: "100%" }}
        placeholder="Please select"
        value={selectedValues}
        onChange={handleChange}
        options={filteredOptions}
        dropdownRender={(menu) => (
          <div>
            <Button
              type="link"
              onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
            >
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Button>
            <Divider style={{ margin: "4px 0" }} />
            {menu}
          </div>
        )}
      />
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </Space>
  );
};

export default Test;
