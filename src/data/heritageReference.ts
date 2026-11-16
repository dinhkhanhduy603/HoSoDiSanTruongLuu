import { KhoiDiSan } from '../types/archive';

export interface UnescoMilestone {
  nam: string;
  thangNam: string;
  tenDiSan: KhoiDiSan;
  danhHieu: string;
  diaDiemKyHop: string;
  tomTat: string;
}

export interface HeritageSite {
  id: string;
  tenDiaDiem: string;
  khoiDiSanLienQuan: KhoiDiSan | 'Cả ba khối di sản';
  vaiTro: string;
  viTriMoHinh: { x: number; y: number };
  tuKhoaLuuGiu: string;
}

export const UNESCO_TIMELINE: UnescoMilestone[] = [
  {
    nam: '2016',
    thangNam: 'Tháng 5/2016',
    tenDiSan: 'Mộc bản trường học Phúc Giang',
    danhHieu: 'Di sản Tư liệu Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (MOWCAP)',
    diaDiemKyHop: 'Thành phố Huế, Việt Nam',
    tomTat:
      'Ghi danh khối mộc bản giáo dục của trường học dòng họ Nguyễn Huy tại làng Trường Lưu, phục vụ hoạt động giảng dạy và in ấn sách kinh điển.',
  },
  {
    nam: '2018',
    thangNam: 'Tháng 5/2018',
    tenDiSan: 'Hoàng Hoa sứ trình đồ',
    danhHieu: 'Di sản Tư liệu Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (MOWCAP)',
    diaDiemKyHop: 'Gwangju, Hàn Quốc',
    tomTat:
      'Ghi danh tập bản đồ, tư liệu ghi chép hành trình đi sứ của Nguyễn Huy Oánh thế kỷ XVIII, phản ánh bang giao và địa lý lịch sử.',
  },
  {
    nam: '2022',
    thangNam: 'Tháng 11/2022',
    tenDiSan: 'Văn bản Hán Nôm làng Trường Lưu',
    danhHieu: 'Di sản Tư liệu Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (MOWCAP)',
    diaDiemKyHop: 'Andong, Hàn Quốc',
    tomTat:
      'Ghi danh bộ sưu tập văn bản Hán Nôm làng Trường Lưu (niên đại 1689–1943), hoàn thiện cụm 3 di sản tư liệu UNESCO trong cùng một ngôi làng.',
  },
];

export const HERITAGE_SITES: HeritageSite[] = [
  {
    id: 'nha-tho-nguyen-huy',
    tenDiaDiem: 'Nhà thờ dòng họ Nguyễn Huy & Không gian bảo quản tư liệu',
    khoiDiSanLienQuan: 'Cả ba khối di sản',
    vaiTro: 'Trung tâm lưu giữ gia phả, sắc phong, bản thảo Hán Nôm và Hoàng Hoa sứ trình đồ qua nhiều thế hệ.',
    viTriMoHinh: { x: 26, y: 36 },
    tuKhoaLuuGiu: 'Nguyễn Huy',
  },
  {
    id: 'phuc-giang-thu-vien',
    tenDiaDiem: 'Khu vực Trường học & Thư viện Phúc Giang',
    khoiDiSanLienQuan: 'Mộc bản trường học Phúc Giang',
    vaiTro: 'Không gian học thuật gắn với thư viện Phúc Giang và hoạt động khắc ván, giảng học thế kỷ XVIII.',
    viTriMoHinh: { x: 54, y: 28 },
    tuKhoaLuuGiu: 'Phúc Giang',
  },
  {
    id: 'khong-gian-truong-luu',
    tenDiaDiem: 'Không gian văn hóa làng Trường Lưu (Kim Song Trường, Can Lộc, Hà Tĩnh)',
    khoiDiSanLienQuan: 'Văn bản Hán Nôm làng Trường Lưu',
    vaiTro: 'Bối cảnh cộng đồng làng xã nơi hình thành văn bản hành chính, hương ước, khế ước và gia tộc.',
    viTriMoHinh: { x: 72, y: 60 },
    tuKhoaLuuGiu: 'Trường Lưu',
  },
  {
    id: 'diem-trung-bay-so',
    tenDiaDiem: 'Nhà lưu niệm / Điểm giới thiệu di sản cho khách tham quan',
    khoiDiSanLienQuan: 'Hoàng Hoa sứ trình đồ',
    vaiTro: 'Điểm tiếp nhận học sinh, du khách tìm hiểu bản sao và hồ sơ số thay cho việc tiếp xúc bản gốc.',
    viTriMoHinh: { x: 38, y: 70 },
    tuKhoaLuuGiu: 'Hoàng Hoa',
  },
];

export interface SourceReference {
  id: string;
  loaiNguon: string;
  khoiDiSan: KhoiDiSan;
  tieuDe: string;
  donVi: string;
  moTa: string;
  banGhiLienQuan: string[];
  trangThai: string;
  url: string;
}

export const SOURCE_REFERENCES: SourceReference[] = [
  {
    id: 'SRC001',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Văn bản Hán Nôm làng Trường Lưu',
    tieuDe: 'Cục Di sản văn hóa — Văn bản Hán Nôm làng Trường Lưu',
    donVi: 'Bộ Văn hóa, Thể thao và Du lịch',
    moTa: 'Hồ sơ giới thiệu bộ sưu tập 48 tư liệu độc bản (1689–1943) gồm 26 sắc phong gốc, 19 văn bằng hành chính và 3 bức trướng lụa tại làng Trường Lưu, Hà Tĩnh.',
    banGhiLienQuan: ['TL-HN-001', 'TL-HN-002', 'TL-HN-003', 'TL-HN-004'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://dsvh.gov.vn/van-ban-han-nom-lang-truong-luu-ha-tinh-22112',
  },
  {
    id: 'SRC002',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Hoàng Hoa sứ trình đồ',
    tieuDe: 'Bộ Văn hóa, Thể thao và Du lịch — Hồ sơ Hoàng Hoa sứ trình đồ',
    donVi: 'Cổng thông tin điện tử Bộ Văn hóa, Thể thao và Du lịch',
    moTa: 'Tư liệu bảo vệ hồ sơ Hoàng Hoa sứ trình đồ trình Ủy ban Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (UNESCO MOWCAP) năm 2018.',
    banGhiLienQuan: ['TL-HH-001'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://bvhttdl.gov.vn/ho-so-hoang-hoa-su-trinh-do-duoc-cong-nhan-di-san-tu-lieu-the-gioi-621826.htm',
  },
  {
    id: 'SRC003',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Mộc bản trường học Phúc Giang',
    tieuDe: 'Thông tấn xã Việt Nam — Mộc bản trường học Phúc Giang',
    donVi: 'TTXVN • Chuyên trang Hồ sơ Sự kiện & Nhân vật',
    moTa: 'Hồ sơ sự kiện lễ đón bằng công nhận khối Mộc bản trường học Phúc Giang là Di sản tư liệu Ký ức Thế giới khu vực châu Á - Thái Bình Dương (2016).',
    banGhiLienQuan: ['TL-PG-001', 'TL-PG-002', 'TL-PG-003'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://nvsk.vnanet.vn/le-don-bang-cong-nhan-moc-ban-truong-hoc-phuc-giang-la-di-san-tu-lieu-thuoc-chuong-trinh-ky-uc-the-gioi-khu-vuc-chau-a-thai-binh-duong-cua-unesco-1-118199.vna',
  },
  {
    id: 'SRC004',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Mộc bản trường học Phúc Giang',
    tieuDe: 'Ủy ban Nhà nước về Người Việt Nam ở nước ngoài — Phúc Giang',
    donVi: 'Bộ Ngoại giao nước CHXHCN Việt Nam',
    moTa: 'Tài liệu giới thiệu giá trị giáo dục Nho học, nội dung kinh điển và kỹ thuật khắc chữ Hán - Nôm ngược trên gỗ thị của dòng họ Nguyễn Huy.',
    banGhiLienQuan: ['TL-PG-001', 'TL-PG-002', 'TL-PG-003'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://scov.gov.vn/ban-sac-van-hoa/moc-ban-truong-hoc-phuc-giang.html',
  },
  {
    id: 'SRC005',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Hoàng Hoa sứ trình đồ',
    tieuDe: 'Thông tấn xã Việt Nam — Hoàng Hoa sứ trình đồ (2018)',
    donVi: 'TTXVN • Chuyên trang Hồ sơ Sự kiện & Nhân vật',
    moTa: 'Hồ sơ ghi danh tập bản đồ đi sứ của Thám hoa Nguyễn Huy Oánh tại Hội nghị Toàn thể UNESCO MOWCAP lần thứ 8 ở Gwangju, Hàn Quốc (30/5/2018).',
    banGhiLienQuan: ['TL-HH-001'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://nvsk.vnanet.vn/ho-so/hoang-hoa-su-trinh-do-di-san-tu-lieu-khu-vuc-chau-a-thai-binh-duong-nam-2018-3-113510.vna',
  },
  {
    id: 'SRC006',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Văn bản Hán Nôm làng Trường Lưu',
    tieuDe: 'Bảo tàng Hà Tĩnh — Văn bản Hán Nôm làng Trường Lưu',
    donVi: 'Sở Văn hóa, Thể thao và Du lịch tỉnh Hà Tĩnh',
    moTa: 'Tư liệu chuyên môn về công tác kiểm kê, bảo quản phối hợp và đặc điểm hiện vật của các dòng họ Nguyễn Huy, Trần Văn, Hoàng tại Trường Lưu.',
    banGhiLienQuan: ['TL-HN-001', 'TL-HN-002', 'TL-HN-003', 'TL-HN-004'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://baotang.hatinh.gov.vn/van-ban-han-nom-lang-truong-luu-1689904651.html',
  },
  {
    id: 'SRC007',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Hoàng Hoa sứ trình đồ',
    tieuDe: 'Cổng thông tin điện tử tỉnh Hà Tĩnh — Hoàng Hoa sứ trình đồ',
    donVi: 'Ủy ban nhân dân tỉnh Hà Tĩnh',
    moTa: 'Thông tin chính thức của địa phương về quy trình bảo quản, giá trị lịch sử bang giao Đại Việt - Trung Hoa và danh hiệu UNESCO MOWCAP 2018.',
    banGhiLienQuan: ['TL-HH-001'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://nongthonmoi.hatinh.gov.vn/van-hoa-du-lich/Cong-nhan-Hoang-hoa-su-trinh-do-la-di-san-UNESCO-89711.html',
  },
  {
    id: 'SRC008',
    loaiNguon: 'NGUỒN CHÍNH THỐNG',
    khoiDiSan: 'Văn bản Hán Nôm làng Trường Lưu',
    tieuDe: 'Báo Nhân Dân — Đón bằng Di sản Văn bản Hán Nôm Trường Lưu',
    donVi: 'Cơ quan Trung ương của Đảng Cộng sản Việt Nam',
    moTa: 'Tường thuật lễ đón nhận bằng ghi danh UNESCO MOWCAP 2022 và dấu ấn hoàn thiện cụm 3 di sản tư liệu trong cùng một ngôi làng.',
    banGhiLienQuan: ['TL-HN-001', 'TL-HN-002', 'TL-HN-003', 'TL-HN-004'],
    trangThai: 'Đã kiểm chứng kết nối',
    url: 'https://nhandan.vn/ha-tinh-don-nhan-di-san-tu-lieu-the-gioi-van-ban-han-nom-lang-truong-luu-post759122.html',
  },
];


