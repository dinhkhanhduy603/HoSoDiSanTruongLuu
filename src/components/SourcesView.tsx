import { ArrowUpRight, BookMarked, Building2, Download, ShieldCheck } from 'lucide-react';
import { SOURCE_REFERENCES } from '../data/heritageReference';
import { KHOI_DI_SAN_LIST, TuLieuRecord } from '../types/archive';
import { extractFilterOptions } from '../utils/archive';

interface SourcesViewProps {
  records: TuLieuRecord[];
  onExport: () => void;
}

const BLOCK_META: Record<
  string,
  { year: string; code: string; location: string; summary: string }
> = {
  'Mộc bản trường học Phúc Giang': {
    year: '2016',
    code: 'khoi-phuc-giang',
    location: 'Huế, Việt Nam · Tháng 5/2016',
    summary:
      'Di sản Tư liệu Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (UNESCO MOWCAP).',
  },
  'Hoàng Hoa sứ trình đồ': {
    year: '2018',
    code: 'khoi-hoang-hoa',
    location: 'Gwangju, Hàn Quốc · Tháng 5/2018',
    summary:
      'Di sản Tư liệu Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (UNESCO MOWCAP).',
  },
  'Văn bản Hán Nôm làng Trường Lưu': {
    year: '2022',
    code: 'khoi-han-nom',
    location: 'Andong, Hàn Quốc · Tháng 11/2022',
    summary:
      'Di sản Tư liệu Chương trình Ký ức Thế giới khu vực châu Á - Thái Bình Dương (UNESCO MOWCAP).',
  },
};

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function SourcesView({ records, onExport }: SourcesViewProps) {
  const { noiLuuGiuOptions } = extractFilterOptions(records);
  const permissionsList = Array.from(
    new Set(
      records
        .map((r) => r.boSung.nguoiChoPhepCongBo?.trim())
        .filter((v): v is string => Boolean(v))
    )
  );

  const jumpToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Editorial Header + Quick Overview Strip */}
      <header className="space-y-6 border-b border-[#E2DDD3] pb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-[#8C2D19] mb-2">
              Thư mục dẫn nguồn & Bảo quản di sản
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917] leading-tight">
              Nguồn tư liệu và Ghi nhận
            </h1>
            <p className="mt-3 text-base text-[#44403C] leading-relaxed">
              Tổng hợp hệ thống đường dẫn gốc từ cơ quan quản lý di sản, cổng
              thông tin địa phương và báo chí chính thống, cùng danh sách chủ
              thể đang gìn giữ tư liệu tại làng Trường Lưu.
            </p>
          </div>

          <button
            type="button"
            onClick={onExport}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-white bg-[#8C2D19] hover:bg-[#722212] rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 self-start lg:self-auto"
          >
            <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Xuất toàn bộ dữ liệu</span>
          </button>
        </div>

        {/* 3-Column Unified Metric Strip */}
        <div className="bg-[#F2EFE8] border border-[#E2DDD3] rounded-xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E2DDD3]">
          <div className="p-4 flex items-center gap-3">
            <BookMarked
              className="w-5 h-5 text-[#8C2D19] shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917] tabular-nums leading-none">
                {SOURCE_REFERENCES.length}
              </p>
              <p className="text-sm text-[#57534E] mt-1">
                Đường dẫn nguồn chính thức
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <Building2
              className="w-5 h-5 text-[#8C2D19] shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917] tabular-nums leading-none">
                {noiLuuGiuOptions.length}
              </p>
              <p className="text-sm text-[#57534E] mt-1">
                Địa điểm lưu giữ trong hồ sơ
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3">
            <ShieldCheck
              className="w-5 h-5 text-[#8C2D19] shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1C1917] tabular-nums leading-none">
                {permissionsList.length}
              </p>
              <p className="text-sm text-[#57534E] mt-1">
                Chủ thể công bố được ghi nhận
              </p>
            </div>
          </div>
        </div>

        {/* Quick Section Anchor Links */}
        <nav
          aria-label="Chuyển nhanh theo khối di sản"
          className="flex flex-wrap items-center gap-2 pt-1"
        >
          <span className="text-sm text-[#57534E] mr-1">Chuyển nhanh:</span>
          {KHOI_DI_SAN_LIST.map((khoi) => {
            const meta = BLOCK_META[khoi];
            return (
              <button
                key={khoi}
                type="button"
                onClick={() => jumpToSection(meta.code)}
                className="min-h-[40px] px-3.5 py-1.5 text-sm font-medium text-[#1C1917] bg-white border border-[#D6CEBE] hover:bg-[#F2EFE8] rounded-lg transition-colors"
              >
                {meta.year} · {khoi}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => jumpToSection('luu-giu-tri-an')}
            className="min-h-[40px] px-3.5 py-1.5 text-sm font-medium text-[#8C2D19] bg-white border border-[#D6CEBE] hover:bg-[#F2EFE8] rounded-lg transition-colors"
          >
            Nơi lưu giữ & Tri ân
          </button>
        </nav>
      </header>

      {/* Editorial Grouped Bibliography by Heritage Block */}
      <section aria-label="Danh mục đường dẫn nguồn theo khối di sản" className="space-y-10">
        {KHOI_DI_SAN_LIST.map((khoi, blockIdx) => {
          const meta = BLOCK_META[khoi];
          const refs = SOURCE_REFERENCES.filter((r) => r.khoiDiSan === khoi);

          return (
            <div
              key={khoi}
              id={meta.code}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24"
            >
              {/* Left Sticky-style Heritage Summary Column */}
              <div className="lg:col-span-4 border-l-2 border-[#8C2D19] pl-4 sm:pl-5 space-y-2">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#8C2D19]">
                    0{blockIdx + 1}
                  </span>
                  <span className="font-serif text-3xl font-semibold text-[#1C1917] tabular-nums">
                    {meta.year}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#1C1917] leading-snug">
                  {khoi}
                </h2>
                <p className="text-sm font-medium text-[#57534E]">
                  {meta.location}
                </p>
                <p className="text-sm text-[#44403C] leading-relaxed">
                  {meta.summary}
                </p>
                <p className="text-xs font-medium text-[#78716C] pt-1 tabular-nums">
                  {refs.length} liên kết tham khảo chính thức
                </p>
              </div>

              {/* Right Numbered Ledger List of Direct Source Links */}
              <div className="lg:col-span-8 bg-white border border-[#E2DDD3] rounded-xl overflow-hidden">
                <ul className="divide-y divide-[#E2DDD3]">
                  {refs.map((ref, idx) => (
                    <li key={ref.id}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F4] transition-colors"
                      >
                        <div className="flex items-start gap-3.5 min-w-0">
                          <span className="font-mono text-sm font-semibold text-[#8C2D19] pt-0.5 shrink-0 tabular-nums">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 space-y-1">
                            <h3 className="text-base font-semibold text-[#1C1917] group-hover:text-[#8C2D19] leading-snug transition-colors">
                              {ref.tieuDe}
                            </h3>
                            <p className="text-sm text-[#57534E] leading-relaxed">
                              <span>{ref.donVi}</span>
                              <span className="mx-1.5" aria-hidden="true">
                                ·
                              </span>
                              <span className="font-mono text-xs text-[#78716C]">
                                {getHostname(ref.url)}
                              </span>
                            </p>
                            {ref.moTa && (
                              <p className="text-sm text-[#44403C] leading-relaxed pt-0.5">
                                {ref.moTa}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="min-h-[40px] px-3 py-1.5 text-sm font-medium text-[#8C2D19] bg-[#FAF8F4] group-hover:bg-[#8C2D19] group-hover:text-white border border-[#E2DDD3] group-hover:border-[#8C2D19] rounded-lg inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start sm:self-center transition-colors">
                          <span>Truy cập</span>
                          <ArrowUpRight
                            className="w-4 h-4 shrink-0"
                            aria-hidden="true"
                          />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </section>

      {/* Custody & Permissions Hairline Table */}
      <section
        id="luu-giu-tri-an"
        aria-labelledby="custody-summary-heading"
        className="border-t border-[#E2DDD3] pt-10 space-y-6 scroll-mt-24"
      >
        <div>
          <h2
            id="custody-summary-heading"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]"
          >
            Thống kê nơi lưu giữ & chủ thể cho phép công bố
          </h2>
          <p className="mt-2 text-base text-[#57534E]">
            Tổng hợp trực tiếp từ các hồ sơ tư liệu hiện có trong hệ thống.
          </p>
        </div>

        <div className="bg-white border border-[#E2DDD3] rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E2DDD3]">
          <div className="p-6">
            <h3 className="font-serif text-lg font-semibold text-[#1C1917] pb-3 border-b border-[#E2DDD3]">
              Nơi lưu giữ hiện nay
            </h3>
            {noiLuuGiuOptions.length === 0 ? (
              <p className="pt-3 text-sm text-[#57534E]">
                Chưa có tư liệu được cập nhật.
              </p>
            ) : (
              <ul className="divide-y divide-[#E2DDD3]">
                {noiLuuGiuOptions.map((loc) => (
                  <li
                    key={loc}
                    className="py-3 text-base text-[#1C1917] leading-relaxed"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-6">
            <h3 className="font-serif text-lg font-semibold text-[#1C1917] pb-3 border-b border-[#E2DDD3]">
              Chủ thể cho phép công bố
            </h3>
            {permissionsList.length === 0 ? (
              <p className="pt-3 text-sm text-[#57534E]">
                Chưa có tư liệu được cập nhật.
              </p>
            ) : (
              <ul className="divide-y divide-[#E2DDD3]">
                {permissionsList.map((p) => (
                  <li
                    key={p}
                    className="py-3 text-base text-[#1C1917] leading-relaxed"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* Editorial Acknowledgements Callout */}
      <section
        aria-labelledby="acknowledgements-heading"
        className="bg-[#F2EFE8] border-l-4 border-[#8C2D19] rounded-r-xl p-6 sm:p-7 space-y-2.5"
      >
        <h2
          id="acknowledgements-heading"
          className="font-serif text-2xl font-semibold text-[#1C1917]"
        >
          Lời ghi nhận và tri ân
        </h2>
        <p className="text-base text-[#44403C] leading-relaxed max-w-4xl">
          Dự án trân trọng ghi nhận công lao gìn giữ qua nhiều thế hệ của các
          dòng họ, người trông coi nhà thờ họ và cộng đồng dân cư làng Trường
          Lưu (xã Kim Song Trường, huyện Can Lộc, tỉnh Hà Tĩnh), cùng các nhà
          nghiên cứu, cơ quan văn hóa đã lập hồ sơ bảo tồn Cụm di sản tư liệu
          quý giá này.
        </p>
      </section>
    </div>
  );
}
