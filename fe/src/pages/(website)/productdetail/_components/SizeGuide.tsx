
// import React, { useState } from 'react';
// import { Modal, Tabs, Slider, Row, Col } from 'antd';
// import { useMutation } from '@tanstack/react-query';
// import instanceClient from '@/configs/client';

// const { TabPane } = Tabs;

// interface SizeGuideModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   categoryId: number;
//   productDetailId: number;
// }

// const SizeGuideModal = ({ isOpen, onClose, categoryId, productDetailId }: SizeGuideModalProps) => {
//   console.log('Category ID:', categoryId); // Add this line

//   const [activeTab, setActiveTab] = useState('1');
//   const [height, setHeight] = useState(160);
//   const [weight, setWeight] = useState(55);

//   const sizeMutation = useMutation({
//     mutationFn: (data: { chieu_cao: number; can_nang: number; san_pham_id: number }) => 
//       instanceClient.post('/goi-y-kich-thuoc', data),
//     onSuccess: (data) => {
//       console.log('Size suggestion:', data);
//     }
//   });

//   const handleGetSizeSuggestion = () => {
//     sizeMutation.mutate({
//       chieu_cao: height,
//       can_nang: weight,
//       san_pham_id: productDetailId
//     });
//   };

//   const renderTable = (data: any) => (
//     <table className="min-w-full bg-white border border-gray-300">
//       <thead>
//         <tr>
//           {Object.keys(data[0]).map((key) => (
//             <th key={key} className="px-4 py-2 bg-gray-100 border border-gray-300">
//               {key}
//             </th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {data.map((row: Record<string, string>, index: number) => (
//           <tr key={index} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
//             {Object.values(row).map((value: React.ReactNode, cellIndex: number) => (
//               <td key={cellIndex} className="px-4 py-2 border">
//                 {value}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   const menSizeData = [
//     { SIZE: 'S', 'Chiều cao (cm)': '160-165', 'Cân nặng (kg)': '55-60', 'Rộng ngực (cm)': '88-92', 'Rộng mông (cm)': '90-95' },
//     { SIZE: 'M', 'Chiều cao (cm)': '165-170', 'Cân nặng (kg)': '60-70', 'Rộng ngực (cm)': '92-96', 'Rộng mông (cm)': '95-100' },
//     { SIZE: 'L', 'Chiều cao (cm)': '170-175', 'Cân nặng (kg)': '70-80', 'Rộng ngực (cm)': '96-100', 'Rộng mông (cm)': '100-105' },
//     { SIZE: 'XL', 'Chiều cao (cm)': '175-180', 'Cân nặng (kg)': '80-90', 'Rộng ngực (cm)': '100-105', 'Rộng mông (cm)': '105-110' },
//     { SIZE: 'XXL', 'Chiều cao (cm)': '180-185', 'Cân nặng (kg)': '90-100', 'Rộng ngực (cm)': '105-110', 'Rộng mông (cm)': '110-115' },
//   ];

//   const womenSizeData = [
//     { SIZE: 'S', 'Chiều cao (cm)': '150-155', 'Cân nặng (kg)': '45-50', 'Rộng ngực (cm)': '80-85', 'Rộng mông (cm)': '85-90' },
//     { SIZE: 'M', 'Chiều cao (cm)': '155-160', 'Cân nặng (kg)': '50-55', 'Rộng ngực (cm)': '85-90', 'Rộng mông (cm)': '90-95' },
//     { SIZE: 'L', 'Chiều cao (cm)': '160-165', 'Cân nặng (kg)': '55-60', 'Rộng ngực (cm)': '90-95', 'Rộng mông (cm)': '95-100' },
//     { SIZE: 'XL', 'Chiều cao (cm)': '165-170', 'Cân nặng (kg)': '60-65', 'Rộng ngực (cm)': '95-100', 'Rộng mông (cm)': '100-105' },
//     { SIZE: 'XXL', 'Chiều cao (cm)': '170-175', 'Cân nặng (kg)': '65-70', 'Rộng ngực (cm)': '100-105', 'Rộng mông (cm)': '105-110' },
//   ];

//   const childrenSizeData = [
//     { SIZE: '1', 'Chiều cao (cm)': '75-80', 'Cân nặng (kg)': '8-10', 'Tuổi': '1' },
//     { SIZE: '2', 'Chiều cao (cm)': '80-85', 'Cân nặng (kg)': '10-12', 'Tuổi': '2' },
//     { SIZE: '3', 'Chiều cao (cm)': '85-90', 'Cân nặng (kg)': '12-15', 'Tuổi': '3' },
//     { SIZE: '4', 'Chiều cao (cm)': '90-95', 'Cân nặng (kg)': '15-18', 'Tuổi': '4' },
//     { SIZE: '5', 'Chiều cao (cm)': '95-100', 'Cân nặng (kg)': '18-20', 'Tuổi': '5' },
//     { SIZE: '6', 'Chiều cao (cm)': '100-110', 'Cân nặng (kg)': '20-23', 'Tuổi': '6' },
//     { SIZE: '7', 'Chiều cao (cm)': '110-120', 'Cân nặng (kg)': '23-26', 'Tuổi': '7' },
//     { SIZE: '8', 'Chiều cao (cm)': '120-130', 'Cân nặng (kg)': '26-30', 'Tuổi': '8' },
//     { SIZE: '9', 'Chiều cao (cm)': '130-140', 'Cân nặng (kg)': '30-35', 'Tuổi': '9' },
//   ];

//   const renderSizeSelector = () => {
//     switch(categoryId) {
//       case 1: // Nam
//         return (
//           <div>
//             <Row>
//               <Col span={14} offset={3}>
//                 <span>Chiều cao</span>
//               </Col>
//             </Row>
//             <Row style={{ marginBottom: "10px" }}>
//               <Col span={3}></Col>
//               <Col span={14}>
//                 <Slider
//                   min={160}
//                   max={185}
//                   value={height}
//                   onChange={(value) => setHeight(value)}
//                   marks={{
//                     160: "1m60",
//                     185: "1m85",
//                   }}
//                 />
//               </Col>
//               <Col span={4}>{(height / 100).toFixed(2)}m</Col>
//             </Row>

//             <Row>
//               <Col span={14} offset={3}>
//                 <span>Cân nặng</span>
//               </Col>
//             </Row>
//             <Row style={{ marginBottom: "10px" }}>
//               <Col span={3}></Col>
//               <Col span={14}>
//                 <Slider
//                   min={55}
//                   max={100}
//                   value={weight}
//                   onChange={(value) => setWeight(value)}
//                   marks={{
//                     55: "55kg",
//                     100: "100kg",
//                   }}
//                 />
//               </Col>
//               <Col span={4}>{weight}kg</Col>
//             </Row>
//           </div>
//         );

//       case 2: // Nữ
//         return (
//           <div>
//             <Row>
//               <Col span={14} offset={3}>
//                 <span>Chiều cao</span>
//               </Col>
//             </Row>
//             <Row style={{ marginBottom: "10px" }}>
//               <Col span={3}></Col>
//               <Col span={14}>
//                 <Slider
//                   min={150}
//                   max={170}
//                   value={height}
//                   onChange={(value) => setHeight(value)}
//                   marks={{
//                     150: "1m50",
//                     170: "1m70",
//                   }}
//                 />
//               </Col>
//               <Col span={4}>{(height / 100).toFixed(2)}m</Col>
//             </Row>

//             <Row>
//               <Col span={14} offset={3}>
//                 <span>Cân nặng</span>
//               </Col>
//             </Row>
//             <Row style={{ marginBottom: "10px" }}>
//               <Col span={3}></Col>
//               <Col span={14}>
//                 <Slider
//                   min={45}
//                   max={70}
//                   value={weight}
//                   onChange={(value) => setWeight(value)}
//                   marks={{
//                     45: "45kg",
//                     70: "70kg",
//                   }}
//                 />
//               </Col>
//               <Col span={4}>{weight}kg</Col>
//             </Row>
//           </div>
//         );

//       case 3: // Trẻ em
//         return (
//           <div>
//             <Row>
//               <Col span={14} offset={3}>
//                 <span>Chiều cao</span>
//               </Col>
//             </Row>
//             <Row style={{ marginBottom: "10px" }}>
//               <Col span={3}></Col>
//               <Col span={14}>
//                 <Slider
//                   min={75}
//                   max={140}
//                   value={height}
//                   onChange={(value) => setHeight(value)}
//                   marks={{
//                     75: "75cm",
//                     140: "140cm",
//                   }}
//                 />
//               </Col>
//               <Col span={4}>{height}cm</Col>
//             </Row>

//             <Row>
//               <Col span={14} offset={3}>
//                 <span>Cân nặng</span>
//               </Col>
//             </Row>
//             <Row style={{ marginBottom: "10px" }}>
//               <Col span={3}></Col>
//               <Col span={14}>
//                 <Slider
//                   min={8}
//                   max={35}
//                   value={weight}
//                   onChange={(value) => setWeight(value)}
//                   marks={{
//                     8: "8kg",
//                     35: "35kg",
//                   }}
//                 />
//               </Col>
//               <Col span={4}>{weight}kg</Col>
//             </Row>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal
//       title="Hướng Dẫn Chọn Size"
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//       width={800}
//       style={{ top: 20 }}
//     >
//       <Tabs activeKey={activeTab} onChange={setActiveTab}>
//         <TabPane tab="Công cụ chọn size" key="1">
//           {renderSizeSelector()}
//           <div className="text-center mt-6">
//             <p className="font-bold text-sm">Glow Clothing gợi ý bạn</p>
//             <div className="flex justify-center space-x-2 mt-2">
//               <button 
//                 onClick={handleGetSizeSuggestion}
//                 className="bg-blue-900 text-white py-2 px-4 rounded-full"
//               >
//                 {sizeMutation.isPending ? 'Đang tính...' : 'Gợi ý size'}
//               </button>
//             </div>
//             {sizeMutation.data && (
//               <div>
//                {/* <div className="mt-2">
//         Size phù hợp: {sizeMutation.data.data.kich_thuoc}
//         </div> */}
//         <div className="mt-4 flex items-center justify-center">
//   <div className="text-lg">Size phù hợp: </div>
//   <div className="ml-2 flex space-x-1">
//     {Array.isArray(sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y) ? (
//       sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y.map((size :any , index :any) => (
//         <span 
//           key={index} 
//           className="bg-blue-900 text-white px-3 py-1 rounded-md font-bold"
//         >
//           {size}
//         </span>
//       ))
//     ) : (
//       <span className="bg-blue-900 text-white px-3 py-1 rounded-md font-bold">
//         {sizeMutation.data.data.goi_y.kich_thuoc_duoc_goi_y}
//       </span>
//     )}
//   </div>
// </div>

//         <div className="text-sm text-gray-600">
//         {sizeMutation.data.data.goi_y.huong_dan_cham_soc}
//       </div>
//         </div>
//             )}
//           </div>
//         </TabPane>
//         <TabPane tab="Size Nam" key="2">
//           <h3 className="text-xl font-semibold mb-2">Bảng size Nam</h3>
//           {renderTable(menSizeData)}
//         </TabPane>
//         <TabPane tab="Size Nữ" key="3">
//           <h3 className="text-xl font-semibold mb-2">Bảng size Nữ</h3>
//           {renderTable(womenSizeData)}
//         </TabPane>
//         <TabPane tab="Size Trẻ em" key="4">
//           <h3 className="text-xl font-semibold mb-2">Bảng size Trẻ em</h3>
//           {renderTable(childrenSizeData)}
//         </TabPane>
//       </Tabs>
//     </Modal>
//   );
// };

// export default SizeGuideModal;
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
console.log('Category ID:', categoryId);
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
