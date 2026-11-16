export type KhoiDiSan =
  | 'Mộc bản trường học Phúc Giang'
  | 'Hoàng Hoa sứ trình đồ'
  | 'Văn bản Hán Nôm làng Trường Lưu';

export const KHOI_DI_SAN_LIST: KhoiDiSan[] = [
  'Mộc bản trường học Phúc Giang',
  'Hoàng Hoa sứ trình đồ',
  'Văn bản Hán Nôm làng Trường Lưu',
];

export type MucKiemChung =
  | 'Đã kiểm chứng'
  | 'Đang đối chiếu'
  | 'Chưa kiểm chứng';

export interface DublinCoreMetadata {
  title: string;
  creator: string;
  subject: string;
  description: string;
  publisher: string;
  contributor: string;
  date: string;
  type: string;
  format: string;
  identifier: string;
  source: string;
  language: string;
  relation: string;
  coverage: string;
  rights: string;
}

export interface SupplementalMetadata {
  noiLuuGiuHienNay: string;
  noiLuuGiuTaiThoiDiemTuLieu: string;
  loaiBanDangHienThi: string;
  tinhTrangBanGoc: string;
  soDangKy: string;
  nguoiChoPhepCongBo: string;
  phamViDuocPhep: string;
  phanKhongCongBo: string;
  mucKiemChung: MucKiemChung | string;
}

export interface NguoiDangLuuGiu {
  hoTen: string;
  vaiTro: string;
  donViHoacDiaChi: string;
  ghiChuLienHe: string;
}

export interface VanBanPhanTich {
  noiDung: string;
  mucKiemChung: MucKiemChung | string;
  nguoiKiem: string;
  ngayKiem: string;
}

export interface HinhAnhTuLieu {
  tenTep: string;
  duongDan?: string;
  duongDanToanTrang: string;
  duongDanCanCanh: string;
  chuThich: string;
  nguon: string;
  laBanGiamKichThuoc: boolean;
}

export interface TuLieuRecord {
  maBanGhi: string;
  khoiDiSan: KhoiDiSan | string;
  loaiTuLieu: string;
  dublinCore: DublinCoreMetadata;
  boSung: SupplementalMetadata;
  nguoiDangLuuGiu: NguoiDangLuuGiu;
  phienAm: VanBanPhanTich;
  dichNghia: VanBanPhanTich;
  hinhAnh: HinhAnhTuLieu[];
}

export interface TuLieuDataset {
  phienBan: string;
  tenDuAn: string;
  ghiChu: string;
  cauTrucMau: TuLieuRecord;
  banGhi: TuLieuRecord[];
}

export interface ArchiveFilterState {
  query: string;
  khoiDiSan: string;
  loaiTuLieu: string;
  noiLuuGiu: string;
}

export interface QACitation {
  maBanGhi: string;
  nhanDe: string;
  noiLuuGiuHienNay: string;
  loaiBanDangHienThi: string;
}

export interface QAResponse {
  coTuLieu: boolean;
  cauTraLoi: string;
  trichDan: QACitation[];
}

export type ScreenId = 'home' | 'archive' | 'detail' | 'qa' | 'sources' | 'about';

export const DUBLIN_CORE_FIELDS: Array<{
  key: keyof DublinCoreMetadata;
  labelVi: string;
  tag: string;
}> = [
  { key: 'title', labelVi: 'Nhan đề', tag: 'dc:title' },
  { key: 'creator', labelVi: 'Tác giả / Người tạo', tag: 'dc:creator' },
  { key: 'subject', labelVi: 'Chủ đề / Từ khóa', tag: 'dc:subject' },
  { key: 'description', labelVi: 'Mô tả tóm tắt', tag: 'dc:description' },
  { key: 'publisher', labelVi: 'Đơn vị ban hành / Khắc in', tag: 'dc:publisher' },
  { key: 'contributor', labelVi: 'Người đóng góp / Khắc ván / Sao chép', tag: 'dc:contributor' },
  { key: 'date', labelVi: 'Niên đại / Thời gian', tag: 'dc:date' },
  { key: 'type', labelVi: 'Loại hình tư liệu', tag: 'dc:type' },
  { key: 'format', labelVi: 'Định dạng / Chất liệu / Kích thước', tag: 'dc:format' },
  { key: 'identifier', labelVi: 'Mã định danh', tag: 'dc:identifier' },
  { key: 'source', labelVi: 'Nguồn gốc xuất xứ', tag: 'dc:source' },
  { key: 'language', labelVi: 'Ngôn ngữ', tag: 'dc:language' },
  { key: 'relation', labelVi: 'Tài liệu liên quan', tag: 'dc:relation' },
  { key: 'coverage', labelVi: 'Phạm vi không gian / thời gian', tag: 'dc:coverage' },
  { key: 'rights', labelVi: 'Quyền sử dụng / Bản quyền', tag: 'dc:rights' },
];

export const SUPPLEMENTAL_FIELDS: Array<{
  key: keyof SupplementalMetadata;
  labelVi: string;
}> = [
  { key: 'noiLuuGiuHienNay', labelVi: 'Nơi lưu giữ hiện nay' },
  { key: 'noiLuuGiuTaiThoiDiemTuLieu', labelVi: 'Nơi lưu giữ tại thời điểm tư liệu' },
  { key: 'loaiBanDangHienThi', labelVi: 'Loại bản đang hiển thị' },
  { key: 'tinhTrangBanGoc', labelVi: 'Tình trạng bản gốc' },
  { key: 'soDangKy', labelVi: 'Số đăng ký' },
  { key: 'nguoiChoPhepCongBo', labelVi: 'Người cho phép công bố' },
  { key: 'phamViDuocPhep', labelVi: 'Phạm vi được phép' },
  { key: 'phanKhongCongBo', labelVi: 'Phần không công bố' },
  { key: 'mucKiemChung', labelVi: 'Mức kiểm chứng' },
];
