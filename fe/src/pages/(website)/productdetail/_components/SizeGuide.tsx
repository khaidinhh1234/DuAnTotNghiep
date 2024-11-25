
import React, { useState } from 'react';
import { Modal, Tabs, Slider, Row, Col } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import instanceClient from '@/configs/client';

const { TabPane } = Tabs;

interface SizeData {
  id: number;
  kich_thuoc: string;
  loai_kich_thuoc: string;
  chieu_cao_toi_thieu: number;
  chieu_cao_toi_da: number;
  can_nang_toi_thieu: number;
  can_nang_toi_da: number;
}

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: number;
  productDetailId: number;
}

const SizeGuideModal = ({ isOpen, onClose, categoryId, productDetailId }: SizeGuideModalProps) => {
  const [activeTab, setActiveTab] = useState('1');
  const [height, setHeight] = useState(160);
  const [weight, setWeight] = useState(55);
// console.log('Category ID:', categoryId);
  const { data: sizeData, isSuccess } = useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      const response = await instanceClient.get('/load-kick-thuoc');
      return response.data;
    }
  });

  const sizeMutation = useMutation({
    mutationFn: (data: { chieu_cao: number; can_nang: number; san_pham_id: number }) => 
      instanceClient.post('/goi-y-kich-thuoc', data),
  });

  const handleGetSizeSuggestion = () => {
    sizeMutation.mutate({
      chieu_cao: height,
      can_nang: weight,
      san_pham_id: productDetailId
    });
  };

  const renderTable = (data: SizeData[]) => (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-4 py-2 bg-gray-100 border border-gray-300">Size</th>
          <th className="px-4 py-2 bg-gray-100 border border-gray-300">Chiều cao thiểu(cm)</th>
          <th className="px-4 py-2 bg-gray-100 border border-gray-300">Chiều cao đa(cm)</th>
          <th className="px-4 py-2 bg-gray-100 border border-gray-300">Cân nặng tối thiểu(kg)</th>
          <th className="px-4 py-2 bg-gray-100 border border-gray-300">Cân nặng tối đa(kg)</th>

        </tr>
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <tr key={row.id} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
            <td className="px-4 py-2 border">{row.kich_thuoc}</td>
            <td className="px-4 py-2 border">{row.chieu_cao_toi_thieu}</td>
            <td className="px-4 py-2 border">{row.chieu_cao_toi_da}</td>
            <td className="px-4 py-2 border">{row.can_nang_toi_thieu}</td>
            <td className="px-4 py-2 border">{row.can_nang_toi_da}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const sizeConfigs = {
    1: {
      height: { min: 160, max: 185, minLabel: "1m60", maxLabel: "1m85" },
      weight: { min: 55, max: 100, minLabel: "55kg", maxLabel: "100kg" }
    },
    2: {
      height: { min: 150, max: 170, minLabel: "1m50", maxLabel: "1m70" },
      weight: { min: 45, max: 70, minLabel: "45kg", maxLabel: "70kg" }
    },
    3: {
      height: { min: 75, max: 140, minLabel: "75cm", maxLabel: "140cm" },
      weight: { min: 8, max: 35, minLabel: "8kg", maxLabel: "35kg" }
    }
  };

  const renderSizeSelector = () => {
    const config = sizeConfigs[categoryId as keyof typeof sizeConfigs];
    if (!config) return null;

    return (
      <div>
        <Row>
          <Col span={14} offset={3}>
            <span>Chiều cao</span>
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col span={3}></Col>
          <Col span={14}>
            <Slider
              min={config.height.min}
              max={config.height.max}
              value={height}
              onChange={(value) => setHeight(value)}
              marks={{
                [config.height.min]: config.height.minLabel,
                [config.height.max]: config.height.maxLabel,
              }}
            />
          </Col>
          <Col span={4}>
            {categoryId === 3 ? `${height}cm` : `${(height / 100).toFixed(2)}m`}
          </Col>
        </Row>

        <Row>
          <Col span={14} offset={3}>
            <span>Cân nặng</span>
          </Col>
        </Row>
        <Row style={{ marginBottom: "10px" }}>
          <Col span={3}></Col>
          <Col span={14}>
            <Slider
              min={config.weight.min}
              max={config.weight.max}
              value={weight}
              onChange={(value) => setWeight(value)}
              marks={{
                [config.weight.min]: config.weight.minLabel,
                [config.weight.max]: config.weight.maxLabel,
              }}
            />
          </Col>
          <Col span={4}>{weight}kg</Col>
        </Row>
      </div>
    );
  };

  return (
    <Modal
      title="Hướng Dẫn Chọn Size"
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Công cụ chọn size" key="1">
          {renderSizeSelector()}
          <div className="text-center mt-6">
            <p className="font-bold text-sm">Glow Clothing gợi ý bạn</p>
            <div className="flex justify-center space-x-2 mt-2">
              <button 
                onClick={handleGetSizeSuggestion}
                className="bg-blue-900 text-white py-2 px-4 rounded-full"
              >
                {sizeMutation.isPending ? 'Đang tính...' : 'Gợi ý size'}
              </button>
            </div>
            {sizeMutation.data ? (
  <div className="mt-4">
    <div className="flex items-center justify-center">
      <div className="text-lg">Size phù hợp: </div>
      <div className="ml-2 flex space-x-1">
        {sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y ? (
          Array.isArray(sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y) ? (
            sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y.map((size: string, index: number) => (
              <span 
                key={index} 
                className="bg-blue-900 text-white px-3 py-1 rounded-md font-bold"
              >
                {size}
              </span>
            ))
          ) : (
            <span className="bg-blue-900 text-white px-3 py-1 rounded-md font-bold">
              {sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y}
            </span>
          )
        ) : (
          <span className="text-red-500 font-medium">
            Không tìm thấy size phù hợp với bạn
          </span>
        )}
      </div>
    </div>
    {sizeMutation.data.data.goi_y.huong_dan_cham_soc && (
      <div className="text-sm text-gray-600 mt-2">
        {sizeMutation.data.data.goi_y.huong_dan_cham_soc}
      </div>
    )}
  </div>
) : sizeMutation.isError ? (
  <div className="mt-4">
    <span className="text-red-500 font-medium">
      Không tìm thấy size phù hợp với bạn
    </span>
  </div>
) : null}

          </div>
        </TabPane>
        <TabPane tab="Size Nam" key="2">
          <h3 className="text-xl font-semibold mb-2">Bảng size Nam</h3>
          {isSuccess && renderTable(sizeData.data.nam)}
        </TabPane>
        <TabPane tab="Size Nữ" key="3">
          <h3 className="text-xl font-semibold mb-2">Bảng size Nữ</h3>
          {isSuccess && renderTable(sizeData.data.nu)}
        </TabPane>
        <TabPane tab="Size Trẻ em" key="4">
          <h3 className="text-xl font-semibold mb-2">Bảng size Trẻ em</h3>
          {isSuccess && renderTable(sizeData.data.tre_em)}
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default SizeGuideModal;
