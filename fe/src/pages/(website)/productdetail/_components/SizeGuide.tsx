
import React, { useState } from 'react';
import { Modal, Tabs } from 'antd';

const { TabPane } = Tabs;

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  const [activeTab, setActiveTab] = useState('1');

  const renderTable = (data: any) => (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} className="px-4 py-2 bg-gray-100 border border-gray-300">
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row: Record<string, string>, index: number) => (
          <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
            {Object.values(row).map((value: React.ReactNode, cellIndex: number) => (
              <td key={cellIndex} className="px-4 py-2 border">
                {value}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  const menSizeData = [
    { SIZE: 'S', 'Chiều cao (cm)': '160-165', 'Cân nặng (kg)': '55-60', 'Rộng ngực (cm)': '88-92', 'Rộng mông (cm)': '90-95' },
    { SIZE: 'M', 'Chiều cao (cm)': '165-170', 'Cân nặng (kg)': '60-70', 'Rộng ngực (cm)': '92-96', 'Rộng mông (cm)': '95-100' },
    { SIZE: 'L', 'Chiều cao (cm)': '170-175', 'Cân nặng (kg)': '70-80', 'Rộng ngực (cm)': '96-100', 'Rộng mông (cm)': '100-105' },
    { SIZE: 'XL', 'Chiều cao (cm)': '175-180', 'Cân nặng (kg)': '80-90', 'Rộng ngực (cm)': '100-105', 'Rộng mông (cm)': '105-110' },
    { SIZE: 'XXL', 'Chiều cao (cm)': '180-185', 'Cân nặng (kg)': '90-100', 'Rộng ngực (cm)': '105-110', 'Rộng mông (cm)': '110-115' },
  ];

  const womenSizeData = [
    { SIZE: 'S', 'Chiều cao (cm)': '150-155', 'Cân nặng (kg)': '45-50', 'Rộng ngực (cm)': '80-85', 'Rộng mông (cm)': '85-90' },
    { SIZE: 'M', 'Chiều cao (cm)': '155-160', 'Cân nặng (kg)': '50-55', 'Rộng ngực (cm)': '85-90', 'Rộng mông (cm)': '90-95' },
    { SIZE: 'L', 'Chiều cao (cm)': '160-165', 'Cân nặng (kg)': '55-60', 'Rộng ngực (cm)': '90-95', 'Rộng mông (cm)': '95-100' },
    { SIZE: 'XL', 'Chiều cao (cm)': '165-170', 'Cân nặng (kg)': '60-65', 'Rộng ngực (cm)': '95-100', 'Rộng mông (cm)': '100-105' },
    { SIZE: 'XXL', 'Chiều cao (cm)': '170-175', 'Cân nặng (kg)': '65-70', 'Rộng ngực (cm)': '100-105', 'Rộng mông (cm)': '105-110' },
  ];

  const childrenSizeData = [
    { SIZE: '1', 'Chiều cao (cm)': '75-80', 'Cân nặng (kg)': '8-10', 'Tuổi': '1' },
    { SIZE: '2', 'Chiều cao (cm)': '80-85', 'Cân nặng (kg)': '10-12', 'Tuổi': '2' },
    { SIZE: '3', 'Chiều cao (cm)': '85-90', 'Cân nặng (kg)': '12-15', 'Tuổi': '3' },
    { SIZE: '4', 'Chiều cao (cm)': '90-95', 'Cân nặng (kg)': '15-18', 'Tuổi': '4' },
    { SIZE: '5', 'Chiều cao (cm)': '95-100', 'Cân nặng (kg)': '18-20', 'Tuổi': '5' },
    { SIZE: '6', 'Chiều cao (cm)': '100-110', 'Cân nặng (kg)': '20-23', 'Tuổi': '6' },
    { SIZE: '7', 'Chiều cao (cm)': '110-120', 'Cân nặng (kg)': '23-26', 'Tuổi': '7' },
    { SIZE: '8', 'Chiều cao (cm)': '120-130', 'Cân nặng (kg)': '26-30', 'Tuổi': '8' },
    { SIZE: '9', 'Chiều cao (cm)': '130-140', 'Cân nặng (kg)': '30-35', 'Tuổi': '9' },
  ];

  return (
    <Modal
      title="Bảng Hướng Dẫn Chọn Size"
      visible={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 260 }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Nam" key="1">
          <h3 className="text-xl font-semibold mb-2">Bảng size Nam</h3>
          {renderTable(menSizeData)}
        </TabPane>
        <TabPane tab="Nữ" key="2">
          <h3 className="text-xl font-semibold mb-2">Bảng size Nữ</h3>
          {renderTable(womenSizeData)}
        </TabPane>
        <TabPane tab="Trẻ em" key="3">
          <h3 className="text-xl font-semibold mb-2">Bảng size Trẻ em</h3>
          {renderTable(childrenSizeData)}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SizeGuideModal;
