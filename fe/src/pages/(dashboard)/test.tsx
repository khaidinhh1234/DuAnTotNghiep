import { Tree } from "antd";
import { useState } from "react";

const Showvaitro: React.FC = () => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([2, 3]); // Gán các quyền đã chọn
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const quyen = [
    { id: 2, ten_quyen: "vaitro.index" },
    { id: 3, ten_quyen: "taikhoan.index" },
    { id: 4, ten_quyen: "taikhoan.store" },
  ]; // Dữ liệu có sẵn

  const treeData = quyen.map((item: any) => ({
    title: item.ten_quyen,
    key: item.id,
  }));

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: any) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: any) => {
    setSelectedKeys(selectedKeysValue);
  };

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={checkedKeys} // Gán các quyền đã chọn
      onSelect={onSelect}
      selectedKeys={selectedKeys}
      treeData={treeData}
    />
  );
};

export default Showvaitro;
