export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  longDescription: string;
  users: number;
  usage: string;
  image: string;
  gallery: string[];
  tags: string[];
  rating: number;
  stock: number;
};

export type CartItem = Product & { quantity: number };

export const PRODUCTS: Product[] = [
  { id: 1, name: "Băng dính hàn gắn tình bạn", category: "Đồ gia dụng tâm linh", price: 50, description: "Dán một đường, hết giận một đời. Không áp dụng cho hội bạn quên trả tiền.", longDescription: "Cuộn băng pha lê san hô được luyện bằng lời xin lỗi chân thành và một chút bụi sao. Dùng để hàn gắn đồ vật, thư tay và những cuộc trò chuyện đang dở.", users: 12300, usage: "người đã dùng", image: "/products/magic-1-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-1-${v}.webp`), tags: ["Bán chạy", "Kintsugi", "Tặng bạn thân"], rating: 4.9, stock: 88 },
  { id: 2, name: "Chong chóng tre bay", category: "Phương tiện giao thông", price: 250, description: "Lên trời trong ba vòng quay. Tóc rối là một phần của trải nghiệm.", longDescription: "Chong chóng tre phủ men ngọc lục bảo, tự bắt gió kể cả trong phòng kín. Tay cầm cân bằng bằng hạt sương giúp chuyến bay nhẹ và êm hơn.", users: 8100, usage: "người đang bay", image: "/products/magic-2-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-2-${v}.webp`), tags: ["Bay thử", "Ngọc lục bảo", "Không cần pin"], rating: 4.8, stock: 24 },
  { id: 3, name: "Cánh cửa thần kỳ", category: "Bất động sản dịch chuyển", price: 9999, description: "Mở ra bất cứ đâu, trừ nơi bạn thật sự cần đến đúng giờ.", longDescription: "Cánh cửa đồng xanh có lõi ánh sáng vàng, ghi nhớ tối đa bảy điểm đến yêu thích. Mỗi lần mở cửa là một lần căn phòng thoảng mùi hoa sau mưa.", users: 150, usage: "người sở hữu", image: "/products/magic-3-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-3-${v}.webp`), tags: ["Cực hiếm", "Dịch chuyển", "Bảo hành 99 năm"], rating: 5, stock: 3 },
  { id: 4, name: "Kính lúp nhìn thấu lòng người", category: "Thiết bị y tế tình cảm", price: 500, description: "Phóng đại tín hiệu thả tim và soi rõ những lần xem mà không trả lời.", longDescription: "Mặt kính emerald nhiều lớp hiển thị các chòm sao cảm xúc. Tay cầm mạ vàng cân bằng tốt, phù hợp cả người thuận tay trái và tay phải.", users: 3400, usage: "người đã soi", image: "/products/magic-4-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-4-${v}.webp`), tags: ["Đọc cảm xúc", "Pha lê", "Quà hẹn hò"], rating: 4.7, stock: 46 },
  { id: 5, name: "Thuốc xịt tàng hình gặp người yêu cũ", category: "Mỹ phẩm phòng thân", price: 120, description: "Một lần xịt, biến mất vừa đủ lâu để rẽ sang lối khác.", longDescription: "Tinh chất sương băng và hoa anh đào cho hiệu lực trong tám mươi tám giây. Chai thủy tinh tự làm lạnh và phát sáng nhẹ khi phát hiện tình huống khó xử.", users: 25000, usage: "người đã thoát", image: "/products/magic-5-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-5-${v}.webp`), tags: ["Thiết yếu", "Bỏ túi", "Hương hoa lạnh"], rating: 4.9, stock: 120 },
  { id: 6, name: "Gối ôm kể chuyện nói xấu sếp", category: "Nội thất văn phòng", price: 180, description: "Thì thầm đúng chuyện bạn muốn nghe. Có chế độ im lặng khi sếp đi qua.", longDescription: "Gối nhung xanh đêm thêu chòm sao san hô, có ba mức âm lượng và chế độ ngụy trang thành một chiếc gối rất ngoan.", users: 14200, usage: "người đang nghe", image: "/products/magic-6-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-6-${v}.webp`), tags: ["Văn phòng", "Nhung sao", "Riêng tư"], rating: 4.8, stock: 61 },
  { id: 7, name: "Đôi dép vấp ngã vào định mệnh", category: "Thời trang xu hướng", price: 90, description: "Mỗi cú vấp là một cơ hội gặp đúng người, sai thời điểm.", longDescription: "Đôi dép mint thêu bướm san hô, đế mềm tự điều hướng đến những cuộc gặp đáng nhớ. Có thể tắt chế độ định mệnh trong ngày mưa.", users: 19800, usage: "người đã vấp", image: "/products/magic-7-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-7-${v}.webp`), tags: ["Định mệnh", "Thêu tay", "Đế mây"], rating: 4.6, stock: 73 },
  { id: 8, name: "Trà sữa không bao giờ béo", category: "Ẩm thực thần kỳ", price: 35, description: "Trân châu gấp đôi, cảm giác tội lỗi bằng không. Khoa học xin phép đứng ngoài.", longDescription: "Ly pha lê ruby giữ lạnh vĩnh viễn, trân châu tự nhân đôi khi bạn chia sẻ. Vị ngọt cân bằng theo tâm trạng và không cần khuấy.", users: 85000, usage: "người đã uống", image: "/products/magic-8-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-8-${v}.webp`), tags: ["Phổ biến nhất", "Zero guilt", "Trân châu bay"], rating: 4.9, stock: 999 },
  { id: 9, name: "Vé xe buýt đi thẳng đến tương lai", category: "Du lịch tâm linh", price: 1500, description: "Một chiều tới ngày mai. Không hoàn vé nếu tương lai hơi thất vọng.", longDescription: "Tấm vé hologram cobalt mở cổng đến thành phố ngày mai trong một chuyến. Điểm đến tự chọn theo điều bạn đang tò mò nhất.", users: 600, usage: "người đã đi", image: "/products/magic-9-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-9-${v}.webp`), tags: ["Một chiều", "Hologram", "Tương lai"], rating: 4.7, stock: 12 },
  { id: 10, name: "Cây bút tự động làm bài tập", category: "Văn phòng phẩm cứu sinh", price: 300, description: "Viết nhanh, chữ đẹp, đôi lúc tự thêm lời nhắn xin cô thông cảm.", longDescription: "Bút máy ngà đen mạ vàng đọc được đề bài, tự chọn mực và giữ đúng nét chữ của chủ nhân. Chế độ trung thực sẽ báo khi bài quá khó.", users: 45000, usage: "học sinh tin dùng", image: "/products/magic-10-1.webp", gallery: [1,2,3,4].map(v => `/products/magic-10-${v}.webp`), tags: ["Cứu deadline", "Mực vô tận", "Chữ đẹp"], rating: 4.8, stock: 54 },
];

export const money = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
