import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  ImageOff,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { SOURCE_REFERENCES } from '../data/heritageReference';
import {
  DUBLIN_CORE_FIELDS,
  SUPPLEMENTAL_FIELDS,
  TuLieuRecord,
} from '../types/archive';
import { toSafeImageUrl } from '../utils/archive';
import { VerificationBadge } from './VerificationBadge';

interface DetailViewProps {
  record: TuLieuRecord;
  isTemplatePreview: boolean;
  onBack: () => void;
}

export function DetailView({
  record,
  isTemplatePreview,
  onBack,
}: DetailViewProps) {
  const [imageIndex, setImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const images = record.hinhAnh ?? [];
  const activeImage = images[imageIndex];

  const rawImagePath = activeImage
    ? activeImage.duongDan ||
      activeImage.duongDanToanTrang ||
      activeImage.duongDanCanCanh
    : '';

  const activeImageSrc = toSafeImageUrl(rawImagePath);

  const isPlaceholderOnlyPath =
    !activeImageSrc ||
    activeImageSrc === '/anh_tulieu/' ||
    activeImageSrc.endsWith('/');

  useEffect(() => {
    setImageLoadFailed(false);
  }, [activeImageSrc, imageIndex]);

  const emptyFieldText = 'Chưa có dữ liệu';

  return (
    <div className="space-y-10 pb-12">
      {/* Top Action & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DDD3] pb-5">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 text-base font-medium text-[#1C1917] bg-white border border-[#D6CEBE] hover:bg-[#F2EFE8] rounded-lg inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Quay lại danh sách tư liệu</span>
        </button>

        <VerificationBadge mucKiemChung={record.boSung.mucKiemChung} />
      </div>

      {isTemplatePreview && (
        <div
          role="note"
          className="bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] rounded-xl p-4 text-base leading-relaxed"
        >
          <strong>Hồ sơ mẫu:</strong> Hiển thị đầy đủ các mục ảnh tư liệu,
          phiên âm/dịch nghĩa có nhãn kiểm chứng, thông tin người lưu giữ và
          thông tin mô tả chi tiết tư liệu.
        </div>
      )}

      {/* Record Title & Unboxed Metadata Header */}
      <header className="max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#57534E] mb-2">
          <span className="font-mono font-semibold text-[#8C2D19]">
            {record.maBanGhi || 'Chưa có mã bản ghi'}
          </span>
          <span aria-hidden="true">·</span>
          <span>{record.khoiDiSan || 'Chưa phân khối di sản'}</span>
          <span aria-hidden="true">·</span>
          <span>{record.loaiTuLieu || 'Chưa phân loại tư liệu'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917] leading-tight headline-balance">
          {record.dublinCore.title || 'Chưa có nhan đề tư liệu'}
        </h1>
        {record.dublinCore.description && (
          <p className="mt-4 text-lg text-[#44403C] leading-relaxed">
            {record.dublinCore.description}
          </p>
        )}
      </header>

      {/* Main Layout: Image Viewer + Text Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Single Image Viewer */}
        <section
          aria-label="Khung xem ảnh tư liệu"
          className="lg:col-span-6 bg-white border border-[#E2DDD3] rounded-xl p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-semibold text-[#1C1917]">
              Ảnh tư liệu
            </h2>

            <button
              type="button"
              onClick={() => setIsZoomed((z) => !z)}
              disabled={isPlaceholderOnlyPath || imageLoadFailed}
              className="min-h-[40px] px-3 py-1.5 text-sm font-medium text-[#1C1917] bg-[#FAF8F4] border border-[#D6CEBE] hover:bg-[#F2EFE8] disabled:opacity-50 rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              {isZoomed ? (
                <>
                  <ZoomOut className="w-4 h-4" aria-hidden="true" />
                  <span>Thu gọn</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  <span>Phóng to</span>
                </>
              )}
            </button>
          </div>

          {/* Image Frame */}
          <div>
            <div className="w-full min-h-[280px] sm:min-h-[360px] bg-[#F2EFE8] border border-[#E2DDD3] rounded-lg overflow-auto flex items-center justify-center p-2">
              {!isPlaceholderOnlyPath && !imageLoadFailed ? (
                <img
                  src={activeImageSrc}
                  alt={
                    activeImage?.chuThich ||
                    `Ảnh tư liệu ${record.dublinCore.title || record.maBanGhi}`
                  }
                  referrerPolicy="no-referrer"
                  onError={() => setImageLoadFailed(true)}
                  className={`rounded transition-transform duration-200 ${
                    isZoomed
                      ? 'max-w-none w-[160%] cursor-zoom-out'
                      : 'max-w-full max-h-[520px] object-contain cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed((z) => !z)}
                />
              ) : (
                <div className="text-center p-6 max-w-sm space-y-2">
                  <ImageOff
                    className="w-9 h-9 text-[#78716C] mx-auto"
                    aria-hidden="true"
                  />
                  <p className="text-base font-medium text-[#1C1917]">
                    Chưa có ảnh tư liệu
                  </p>
                  <p className="text-sm text-[#57534E] leading-relaxed">
                    Hình ảnh bản chụp thu nhỏ sẽ được bổ sung khi hoàn tất số
                    hóa tư liệu gốc.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Multi-image selector if record has >1 image */}
          {images.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E2DDD3]">
              {images.map((img, idx) => (
                <button
                  key={`${img.tenTep}-${idx}`}
                  type="button"
                  onClick={() => setImageIndex(idx)}
                  className={`min-h-[40px] px-3 py-1.5 text-sm rounded-lg border ${
                    idx === imageIndex
                      ? 'bg-[#8C2D19] text-white border-[#8C2D19]'
                      : 'bg-[#FAF8F4] text-[#44403C] border-[#E2DDD3]'
                  }`}
                >
                  Trang {idx + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Right: Phiên âm, Dịch nghĩa & Người lưu giữ */}
        <div className="lg:col-span-6 space-y-6">
          {/* Phiên âm Card (Always carries verification badge) */}
          <section
            aria-labelledby="phien-am-heading"
            className="bg-white border border-[#E2DDD3] rounded-xl p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DDD3] pb-3">
              <h2
                id="phien-am-heading"
                className="font-serif text-xl font-semibold text-[#1C1917]"
              >
                Phiên âm
              </h2>
              <VerificationBadge
                mucKiemChung={record.phienAm?.mucKiemChung}
                compact
              />
            </div>

            <div className="text-base text-[#1C1917] leading-relaxed whitespace-pre-wrap">
              {record.phienAm?.noiDung?.trim()
                ? record.phienAm.noiDung
                : 'Chưa có nội dung phiên âm trong bản ghi.'}
            </div>

            {(record.phienAm?.nguoiKiem || record.phienAm?.ngayKiem) && (
              <p className="text-sm text-[#57534E] pt-2 border-t border-[#E2DDD3]">
                Người kiểm: {record.phienAm.nguoiKiem || 'Chưa ghi'} · Ngày
                kiểm: {record.phienAm.ngayKiem || 'Chưa ghi'}
              </p>
            )}
          </section>

          {/* Dịch nghĩa Card (Always carries verification badge) */}
          <section
            aria-labelledby="dich-nghia-heading"
            className="bg-white border border-[#E2DDD3] rounded-xl p-5 space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DDD3] pb-3">
              <h2
                id="dich-nghia-heading"
                className="font-serif text-xl font-semibold text-[#1C1917]"
              >
                Dịch nghĩa
              </h2>
              <VerificationBadge
                mucKiemChung={record.dichNghia?.mucKiemChung}
                compact
              />
            </div>

            <div className="text-base text-[#1C1917] leading-relaxed whitespace-pre-wrap">
              {record.dichNghia?.noiDung?.trim()
                ? record.dichNghia.noiDung
                : 'Chưa có nội dung dịch nghĩa trong bản ghi.'}
            </div>

            {(record.dichNghia?.nguoiKiem || record.dichNghia?.ngayKiem) && (
              <p className="text-sm text-[#57534E] pt-2 border-t border-[#E2DDD3]">
                Người kiểm: {record.dichNghia.nguoiKiem || 'Chưa ghi'} · Ngày
                kiểm: {record.dichNghia.ngayKiem || 'Chưa ghi'}
              </p>
            )}
          </section>

          {/* Thông tin người đang lưu giữ */}
          <section
            aria-labelledby="custodian-heading"
            className="bg-[#F2EFE8] border border-[#E2DDD3] rounded-xl p-5 space-y-3"
          >
            <h2
              id="custodian-heading"
              className="font-serif text-xl font-semibold text-[#1C1917]"
            >
              Thông tin người đang lưu giữ
            </h2>
            <dl className="divide-y divide-[#E2DDD3] text-base">
              <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                <dt className="sm:col-span-5 text-[#57534E]">Họ và tên / Chủ thể:</dt>
                <dd className="sm:col-span-7 font-medium text-[#1C1917]">
                  {record.nguoiDangLuuGiu?.hoTen || emptyFieldText}
                </dd>
              </div>
              <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                <dt className="sm:col-span-5 text-[#57534E]">Vai trò:</dt>
                <dd className="sm:col-span-7 text-[#1C1917]">
                  {record.nguoiDangLuuGiu?.vaiTro || emptyFieldText}
                </dd>
              </div>
              <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                <dt className="sm:col-span-5 text-[#57534E]">Đơn vị / Địa chỉ:</dt>
                <dd className="sm:col-span-7 text-[#1C1917]">
                  {record.nguoiDangLuuGiu?.donViHoacDiaChi || emptyFieldText}
                </dd>
              </div>
              <div className="py-2.5 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4">
                <dt className="sm:col-span-5 text-[#57534E]">Ghi chú liên hệ:</dt>
                <dd className="sm:col-span-7 text-[#1C1917]">
                  {record.nguoiDangLuuGiu?.ghiChuLienHe || emptyFieldText}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Bộ trường mô tả: 9 trường bổ sung + 15 trường Dublin Core */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section
          aria-labelledby="supplemental-fields-heading"
          className="bg-white border border-[#E2DDD3] rounded-xl p-6"
        >
          <h2
            id="supplemental-fields-heading"
            className="font-serif text-2xl font-semibold text-[#1C1917] mb-4"
          >
            Thông tin lưu giữ, tình trạng & quyền công bố
          </h2>
          <dl className="divide-y divide-[#E2DDD3]">
            {SUPPLEMENTAL_FIELDS.map((field) => {
              const value = record.boSung?.[field.key];
              return (
                <div
                  key={field.key}
                  className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 text-base"
                >
                  <dt className="sm:col-span-5 font-medium text-[#57534E]">
                    {field.labelVi}
                  </dt>
                  <dd className="sm:col-span-7 text-[#1C1917]">
                    {value?.trim() ? value : emptyFieldText}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>

        <section
          aria-labelledby="dublin-core-heading"
          className="bg-white border border-[#E2DDD3] rounded-xl p-6"
        >
          <h2
            id="dublin-core-heading"
            className="font-serif text-2xl font-semibold text-[#1C1917] mb-4"
          >
            Thông tin mô tả chi tiết tư liệu
          </h2>
          <dl className="divide-y divide-[#E2DDD3]">
            {DUBLIN_CORE_FIELDS.map((field, idx) => {
              const value = record.dublinCore?.[field.key];
              const matchingRefs =
                field.key === 'source'
                  ? SOURCE_REFERENCES.filter(
                      (ref) => ref.khoiDiSan === record.khoiDiSan
                    )
                  : [];
              return (
                <div
                  key={field.key}
                  className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 text-base"
                >
                  <dt className="sm:col-span-5 font-medium text-[#57534E]">
                    {idx + 1}. {field.labelVi}
                  </dt>
                  <dd className="sm:col-span-7 text-[#1C1917] space-y-1.5">
                    <p>{value?.trim() ? value : emptyFieldText}</p>
                    {matchingRefs.length > 0 && (
                      <ul className="space-y-1 pt-1">
                        {matchingRefs.map((ref) => (
                          <li key={ref.id} className="text-sm">
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-start gap-1 text-[#8C2D19] hover:text-[#6B2112] underline underline-offset-2"
                            >
                              <span>{ref.donVi}</span>
                              <ExternalLink
                                className="w-3.5 h-3.5 shrink-0 mt-1"
                                aria-hidden="true"
                              />
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      </div>
    </div>
  );
}
