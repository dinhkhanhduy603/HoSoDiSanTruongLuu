import { FormEvent, useState } from 'react';
import {
  ArrowRight,
  Compass,
  MapPin,
  Search,
  ScrollText,
} from 'lucide-react';
import { HERITAGE_SITES, UNESCO_TIMELINE } from '../data/heritageReference';
import { KHOI_DI_SAN_LIST, TuLieuRecord } from '../types/archive';

interface HomeViewProps {
  records: TuLieuRecord[];
  onSearchSubmit: (query: string) => void;
  onSelectBlock: (block: string) => void;
  onFilterBySite: (siteKeyword: string) => void;
  onOpenQA: () => void;
}

export function HomeView({
  records,
  onSearchSubmit,
  onSelectBlock,
  onFilterBySite,
  onOpenQA,
}: HomeViewProps) {
  const [searchInput, setSearchInput] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState(HERITAGE_SITES[0].id);

  const selectedSite =
    HERITAGE_SITES.find((s) => s.id === selectedSiteId) ?? HERITAGE_SITES[0];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchInput);
  };

  return (
    <div className="space-y-14 md:space-y-20 pb-8">
      {/* Hero & Search Section */}
      <section className="pt-4 md:pt-8 pb-10 md:pb-14 border-b border-[#E2DDD3]">
        <div className="max-w-4xl md:mx-auto md:text-center">
          <p className="text-sm font-medium text-[#8C2D19] tracking-wide mb-3">
            Xã Kim Song Trường · Huyện Can Lộc · Tỉnh Hà Tĩnh
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1C1917] leading-[1.18] headline-balance md:mx-auto">
            Hồ sơ số Cụm di sản tư liệu làng Trường Lưu
          </h1>
          <p className="mt-5 text-lg text-[#44403C] leading-relaxed max-w-2xl md:mx-auto">
            Cổng tra cứu mở phục vụ học sinh, sinh viên, nhà nghiên cứu, du khách
            và người dân địa phương tiếp cận tri thức về ba khối di sản tư liệu
            được UNESCO ghi danh mà không cần tiếp xúc trực tiếp với bản gốc.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 max-w-2xl md:mx-auto"
          role="search"
          aria-label="Tìm kiếm tư liệu làng Trường Lưu"
        >
          <label
            htmlFor="home-search-input"
            className="block text-sm font-medium text-[#44403C] mb-2 md:text-center"
          >
            Tra cứu nhanh trong hồ sơ tư liệu (tên văn bản, tác giả, nơi lưu giữ,
            mã bản ghi)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                className="w-5 h-5 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="home-search-input"
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Ví dụ: Phúc Giang, Hoàng Hoa sứ trình đồ, Nguyễn Huy..."
                className="w-full min-h-[48px] pl-11 pr-4 py-2.5 text-base bg-white border border-[#D6CEBE] rounded-lg text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] focus:ring-2 focus:ring-[#8C2D19]/15"
              />
            </div>
            <button
              type="submit"
              className="min-h-[48px] px-6 py-2.5 text-base font-medium text-white bg-[#8C2D19] hover:bg-[#722212] rounded-lg transition-colors whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-2"
            >
              <span>Tìm tư liệu</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-3 flex flex-col sm:flex-row sm:flex-wrap sm:items-center md:justify-center gap-x-4 gap-y-1 text-sm text-[#57534E]">
            <span className="tabular-nums">
              Hiện có {records.length} tư liệu trong hồ sơ lưu trữ
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenQA}
              className="text-[#8C2D19] font-medium hover:underline min-h-[44px] inline-flex items-center self-start sm:self-auto"
            >
              Đặt câu hỏi theo dữ liệu tư liệu
            </button>
          </div>
        </form>
      </section>

      {/* 3 Khối di sản */}
      <section aria-labelledby="heritage-blocks-heading">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2
              id="heritage-blocks-heading"
              className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]"
            >
              Ba khối di sản tư liệu
            </h2>
            <p className="mt-2 text-base text-[#57534E]">
              Chọn một khối di sản để mở danh mục và lọc chi tiết theo loại tư
              liệu hoặc nơi lưu giữ.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {KHOI_DI_SAN_LIST.map((blockName, index) => {
            const count = records.filter(
              (r) => r.khoiDiSan === blockName
            ).length;
            const milestone = UNESCO_TIMELINE.find(
              (m) => m.tenDiSan === blockName
            );
            return (
              <article
                key={blockName}
                className="bg-white border border-[#E2DDD3] rounded-xl p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex items-center gap-2 text-sm text-[#57534E] mb-2">
                    <span className="font-mono tabular-nums">
                      0{index + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Ghi danh {milestone?.nam ?? 'UNESCO'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{count} bản ghi</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-[#1C1917] leading-snug">
                    {blockName}
                  </h3>
                  <p className="mt-3 text-base text-[#44403C] leading-relaxed">
                    {milestone?.tomTat}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectBlock(blockName)}
                  className="min-h-[44px] w-full px-4 py-2.5 text-sm font-medium text-[#1C1917] bg-[#F2EFE8] hover:bg-[#E7E1D5] rounded-lg transition-colors inline-flex items-center justify-between"
                >
                  <span>Xem danh sách tư liệu</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* UNESCO Timeline */}
      <section
        aria-labelledby="unesco-timeline-heading"
        className="bg-[#F2EFE8] border border-[#E2DDD3] rounded-2xl p-6 sm:p-8"
      >
        <div className="max-w-2xl mb-8">
          <div className="flex items-center gap-2 text-sm font-medium text-[#8C2D19] mb-2">
            <ScrollText className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Chương trình Ký ức Thế giới (UNESCO MOWCAP)</span>
          </div>
          <h2
            id="unesco-timeline-heading"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]"
          >
            Dòng thời gian các mốc ghi danh UNESCO
          </h2>
          <p className="mt-2 text-base text-[#44403C] leading-relaxed">
            Ba lần ghi danh liên tiếp giúp Trường Lưu trở thành điểm sáng về bảo
            tồn di sản tư liệu dòng họ và làng xã Việt Nam.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {UNESCO_TIMELINE.map((item) => (
            <li
              key={item.nam}
              className="bg-white border border-[#E2DDD3] rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-baseline justify-between gap-3 border-b border-[#E2DDD3] pb-3 mb-3">
                  <span className="font-serif text-3xl font-bold text-[#8C2D19] tabular-nums">
                    {item.nam}
                  </span>
                  <span className="text-sm text-[#57534E]">
                    {item.thangNam}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1C1917]">
                  {item.tenDiSan}
                </h3>
                <p className="mt-2 text-sm text-[#57534E]">
                  Kỳ họp tại {item.diaDiemKyHop}
                </p>
                <p className="mt-3 text-base text-[#44403C] leading-relaxed">
                  {item.tomTat}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectBlock(item.tenDiSan)}
                className="min-h-[44px] text-left text-sm font-medium text-[#8C2D19] hover:underline inline-flex items-center gap-1.5"
              >
                <span>Tra cứu khối tư liệu này</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ol>
      </section>

      {/* Interactive Map of Related Sites */}
      <section aria-labelledby="heritage-map-heading">
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-sm font-medium text-[#8C2D19] mb-2">
            <Compass className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Không gian văn hóa — lịch sử</span>
          </div>
          <h2
            id="heritage-map-heading"
            className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917]"
          >
            Bản đồ các di tích và nơi lưu giữ liên quan
          </h2>
          <p className="mt-2 text-base text-[#44403C] leading-relaxed">
            Chạm vào từng điểm di tích trên sơ đồ để xem vai trò bảo tồn và lọc
            những tư liệu gắn với địa điểm lưu giữ đó.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Interactive Schematic Map Canvas */}
          <div className="lg:col-span-7 bg-[#F2EFE8] border border-[#E2DDD3] rounded-xl p-4 sm:p-6 flex flex-col justify-between">
            <div className="relative w-full aspect-[4/3] bg-[#FAF8F4] border border-[#D6CEBE] rounded-lg overflow-hidden">
              <svg
                viewBox="0 0 100 75"
                className="w-full h-full"
                role="img"
                aria-label="Sơ đồ cụm di tích làng Trường Lưu"
              >
                {/* Background grid lines */}
                <defs>
                  <pattern
                    id="archival-grid"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 10 0 L 0 0 0 10"
                      fill="none"
                      stroke="#E2DDD3"
                      strokeWidth="0.25"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="75" fill="url(#archival-grid)" />

                {/* Schematic village roads & river stream */}
                <path
                  d="M 6 58 Q 34 45, 58 46 T 94 28"
                  fill="none"
                  stroke="#D6CEBE"
                  strokeWidth="1.4"
                  strokeDasharray="2 1.5"
                />
                <path
                  d="M 18 16 Q 48 34, 78 68"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="1.2"
                />

                {/* Connecting links between heritage points */}
                <line
                  x1={HERITAGE_SITES[0].viTriMoHinh.x}
                  y1={HERITAGE_SITES[0].viTriMoHinh.y}
                  x2={HERITAGE_SITES[1].viTriMoHinh.x}
                  y2={HERITAGE_SITES[1].viTriMoHinh.y}
                  stroke="#8C2D19"
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                />
                <line
                  x1={HERITAGE_SITES[1].viTriMoHinh.x}
                  y1={HERITAGE_SITES[1].viTriMoHinh.y}
                  x2={HERITAGE_SITES[2].viTriMoHinh.x}
                  y2={HERITAGE_SITES[2].viTriMoHinh.y}
                  stroke="#8C2D19"
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                />
                <line
                  x1={HERITAGE_SITES[0].viTriMoHinh.x}
                  y1={HERITAGE_SITES[0].viTriMoHinh.y}
                  x2={HERITAGE_SITES[3].viTriMoHinh.x}
                  y2={HERITAGE_SITES[3].viTriMoHinh.y}
                  stroke="#8C2D19"
                  strokeOpacity="0.25"
                  strokeWidth="0.6"
                />

                {/* Area watermark label (readable informational label) */}
                <text
                  x="6"
                  y="10"
                  fontSize="3.2"
                  fill="#57534E"
                  fontWeight="600"
                >
                  Cụm di tích làng Trường Lưu (Kim Song Trường, Can Lộc)
                </text>
              </svg>

              {/* Accessible Interactive HTML Pin Buttons overlaid */}
              {HERITAGE_SITES.map((site, idx) => {
                const isSelected = site.id === selectedSite.id;
                return (
                  <button
                    key={site.id}
                    type="button"
                    onClick={() => setSelectedSiteId(site.id)}
                    aria-pressed={isSelected}
                    aria-label={`Chọn điểm di tích ${idx + 1}: ${site.tenDiaDiem}`}
                    style={{
                      left: `${site.viTriMoHinh.x}%`,
                      top: `${(site.viTriMoHinh.y / 75) * 100}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19] ${
                      isSelected ? 'scale-110 z-20' : 'hover:scale-105 z-10'
                    }`}
                  >
                    <span
                      className={`inline-flex items-center justify-center w-9 h-9 rounded-full border-2 font-mono text-sm font-semibold shadow-sm ${
                        isSelected
                          ? 'bg-[#8C2D19] text-white border-white'
                          : 'bg-white text-[#1C1917] border-[#8C2D19]'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-[#57534E]">
              Sơ đồ định hướng cụm di tích làng Trường Lưu (hiển thị tương quan
              không gian các điểm bảo quản và giới thiệu di sản).
            </p>
          </div>

          {/* Selected Site Details & Site Selector List */}
          <div className="lg:col-span-5 bg-white border border-[#E2DDD3] rounded-xl p-6 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-[#8C2D19] font-medium mb-2">
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{selectedSite.khoiDiSanLienQuan}</span>
              </div>
              <h3 className="font-serif text-xl font-semibold text-[#1C1917]">
                {selectedSite.tenDiaDiem}
              </h3>
              <p className="mt-3 text-base text-[#44403C] leading-relaxed">
                {selectedSite.vaiTro}
              </p>

              <div className="mt-5 pt-5 border-t border-[#E2DDD3]">
                <p className="text-sm font-medium text-[#57534E] mb-3">
                  Chọn nhanh điểm di tích:
                </p>
                <div className="space-y-2">
                  {HERITAGE_SITES.map((site, idx) => {
                    const active = site.id === selectedSite.id;
                    return (
                      <button
                        key={site.id}
                        type="button"
                        onClick={() => setSelectedSiteId(site.id)}
                        className={`w-full min-h-[44px] px-3.5 py-2 rounded-lg text-left text-sm transition-colors flex items-center gap-3 ${
                          active
                            ? 'bg-[#8C2D19]/10 text-[#8C2D19] font-semibold'
                            : 'bg-[#FAF8F4] text-[#44403C] hover:bg-[#F2EFE8]'
                        }`}
                      >
                        <span className="font-mono text-xs w-6 h-6 rounded-full border border-current inline-flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="line-clamp-1">{site.tenDiaDiem}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onFilterBySite(selectedSite.tuKhoaLuuGiu)}
              className="min-h-[44px] w-full px-4 py-2.5 text-base font-medium text-white bg-[#1C1917] hover:bg-[#44403C] rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <span>Lọc tư liệu liên quan địa điểm này</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
