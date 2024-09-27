const TestAbc = () => {
  const banner =
    '[{"noi_dung": {"mau_nut": "#ff9800", "tieu_de_nut": "Mua ngay", "tieu_de_phu": "Tất cả phải đi", "tieu_de_chinh": "Giảm giá thanh lý", "mau_tieu_de_phu": "#4d2e2e", "mau_tieu_de_chinh": "#9c27b0", "van_ban_quang_cao": "Giảm giá lớn cho tất cả các mặt hàng. Mua ngay trước khi hết hàng!", "mau_van_ban_quang_cao": "#df0e0e"}, "duong_dan_anh": "[\\"https:\\\\/\\\\/res.cloudinary.com\\\\/dpundwxg1\\\\/image\\\\/upload\\\\/v1727379398\\\\/sg-11134201-7rdwe-lyvntmy2ws1y41_fgsroa.webp\\",\\"https:\\\\/\\\\/res.cloudinary.com\\\\/dpundwxg1\\\\/image\\\\/upload\\\\/v1727379401\\\\/vn-11134207-7r98o-lz75rnbaok9t5d_cpbeqs.webp\\",\\"https:\\\\/\\\\/res.cloudinary.com\\\\/dpundwxg1\\\\/image\\\\/upload\\\\/v1727379414\\\\/f348423053687486bb654b7b0f56ee4c_udvvz6.webp\\",\\"https:\\\\/\\\\/res.cloudinary.com\\\\/dpundwxg1\\\\/image\\\\/upload\\\\/v1727379439\\\\/sg-11134201-7rdwe-lyvntmy2ws1y41_pjvrmf.webp\\"]"}]';
  const banners = JSON.parse(banner);

  // Bước 2: Chuyển đổi chuỗi đường dẫn ảnh thành mảng
  const imageUrls = JSON.parse(banners[0].duong_dan_anh);

  // Kiểm tra kết quả
  console.log(banners[0].noi_dung.tieu_de_chinh); // "Giảm giá thanh lý"
  console.log(imageUrls); // Mảng các đường dẫn ảnh
  return;
  <></>;
};

export default TestAbc;
