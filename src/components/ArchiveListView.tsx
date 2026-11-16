import { ArrowRight, FilterX, FolderOpen, Search } from 'lucide-react';
import {
  ArchiveFilterState,
  KHOI_DI_SAN_LIST,
  TuLieuRecord,
} from '../types/archive';
import { extractFilterOptions, filterRecords } from '../utils/archive';
import { VerificationBadge } from './VerificationBadge';

interface ArchiveListViewProps {
  records: TuLieuRecord[];
  filters: ArchiveFilterState;
  onFiltersChange: (next: ArchiveFilterState) => void;
  onOpenRecord: (record: TuLieuRecord) => void;
}

export function ArchiveListView({
  records,
  filters,
  onFiltersChange,
  onOpenRecord,
}: ArchiveListViewProps) {
  const { loaiTuLieuOptions, noiLuuGiuOptions } = extractFilterOptions(records);
  const filtered = filterRecords(records, filters);

  const hasActiveFilter =
    Boolean(filters.query.trim()) ||
    filters.khoiDiSan !== 'tat-ca' ||
    filters.loaiTuLieu !== 'tat-ca' ||
    filters.noiLuuGiu !== 'tat-ca';

  const handleResetFilters = () => {
    onFiltersChange({
      query: '',
      khoiDiSan: 'tat-ca',
      loaiTuLieu: 'tat-ca',
      noiLuuGiu: 'tat-ca',
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="border-b border-[#E2DDD3] pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
            Danh mục tư liệu di sản
          </h1>
          <p className="mt-2 text-base text-[#44403C] max-w-2xl leading-relaxed">
            Tra cứu các tư liệu thuộc 3 khối di sản làng Trường Lưu. Sử dụng bộ
            lọc theo khối di sản, loại tư liệu và nơi lưu giữ hiện nay.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <section
        aria-label="Bộ lọc tư liệu"
        className="bg-white border border-[#E2DDD3] rounded-xl p-5 space-y-5"
      >
        {/* Heritage Block Segmented Buttons */}
        <div>
          <p className="text-sm font-medium text-[#44403C] mb-2.5">
            Khối di sản
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                onFiltersChange({ ...filters, khoiDiSan: 'tat-ca' })
              }
              aria-pressed={filters.khoiDiSan === 'tat-ca'}
              className={`min-h-[44px] px-4 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
                filters.khoiDiSan === 'tat-ca'
                  ? 'bg-[#8C2D19] text-white border-[#8C2D19]'
                  : 'bg-[#FAF8F4] text-[#44403C] border-[#E2DDD3] hover:bg-[#F2EFE8]'
              }`}
            >
              Tất cả 3 khối
            </button>
            {KHOI_DI_SAN_LIST.map((block) => {
              const active = filters.khoiDiSan === block;
              return (
                <button
                  key={block}
                  type="button"
                  onClick={() =>
                    onFiltersChange({ ...filters, khoiDiSan: block })
                  }
                  aria-pressed={active}
                  className={`min-h-[44px] px-4 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#8C2D19] text-white border-[#8C2D19]'
                      : 'bg-[#FAF8F4] text-[#44403C] border-[#E2DDD3] hover:bg-[#F2EFE8]'
                  }`}
                >
                  {block}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search + Dropdown Filters */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label
              htmlFor="archive-search"
              className="block text-sm font-medium text-[#44403C] mb-1.5"
            >
              Từ khóa tìm kiếm
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="archive-search"
                type="search"
                value={filters.query}
                onChange={(e) =>
                  onFiltersChange({ ...filters, query: e.target.value })
                }
                placeholder="Nhan đề, mã bản ghi, tác giả, phiên âm..."
                className="w-full min-h-[44px] pl-10 pr-3 py-2 text-base bg-[#FAF8F4] border border-[#D6CEBE] rounded-lg text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19]"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="filter-loai"
              className="block text-sm font-medium text-[#44403C] mb-1.5"
            >
              Loại tư liệu
            </label>
            <select
              id="filter-loai"
              value={filters.loaiTuLieu}
              onChange={(e) =>
                onFiltersChange({ ...filters, loaiTuLieu: e.target.value })
              }
              className="w-full min-h-[44px] px-3 py-2 text-base bg-[#FAF8F4] border border-[#D6CEBE] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#8C2D19]"
            >
              <option value="tat-ca">Tất cả loại tư liệu</option>
              {loaiTuLieuOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="filter-noiluugiu"
              className="block text-sm font-medium text-[#44403C] mb-1.5"
            >
              Nơi lưu giữ hiện nay
            </label>
            <select
              id="filter-noiluugiu"
              value={filters.noiLuuGiu}
              onChange={(e) =>
                onFiltersChange({ ...filters, noiLuuGiu: e.target.value })
              }
              className="w-full min-h-[44px] px-3 py-2 text-base bg-[#FAF8F4] border border-[#D6CEBE] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#8C2D19]"
            >
              <option value="tat-ca">Tất cả nơi lưu giữ</option>
              {noiLuuGiuOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E2DDD3] text-sm text-[#57534E]">
          <span className="tabular-nums">
            Hiển thị <strong className="text-[#1C1917]">{filtered.length}</strong>{' '}
            / {records.length} bản ghi
          </span>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="min-h-[40px] px-3 py-1.5 text-sm font-medium text-[#8C2D19] hover:bg-[#8C2D19]/10 rounded-lg inline-flex items-center gap-1.5"
            >
              <FilterX className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </section>

      {/* Results or Empty State */}
      {records.length === 0 ? (
        <section
          aria-label="Trạng thái chưa có tư liệu"
          className="bg-white border border-[#E2DDD3] rounded-xl p-8 sm:p-10 text-center max-w-3xl mx-auto"
        >
          <FolderOpen
            className="w-10 h-10 text-[#8C2D19] mx-auto mb-4"
            aria-hidden="true"
          />
          <h2 className="font-serif text-2xl font-semibold text-[#1C1917]">
            Chưa có tư liệu trong hồ sơ
          </h2>
          <p className="mt-3 text-base text-[#44403C] leading-relaxed">
            Hồ sơ hiện chưa có tư liệu được cập nhật. Các tư liệu đã xác minh sẽ
            được bổ sung và hiển thị tại đây.
          </p>
        </section>
      ) : filtered.length === 0 ? (
        <section
          aria-label="Không tìm thấy kết quả"
          className="bg-white border border-[#E2DDD3] rounded-xl p-8 text-center"
        >
          <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
            Chưa có tư liệu phù hợp với bộ lọc hiện tại
          </h2>
          <p className="mt-2 text-base text-[#57534E]">
            Hãy thử thay đổi từ khóa, chọn lại loại tư liệu hoặc nơi lưu giữ.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-5 min-h-[44px] px-5 py-2.5 text-sm font-medium text-white bg-[#1C1917] hover:bg-[#44403C] rounded-lg"
          >
            Hiển thị tất cả tư liệu
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((record) => {
            const title =
              record.dublinCore.title || record.maBanGhi || '(Chưa có nhan đề)';
            return (
              <article
                key={record.maBanGhi || title}
                className="bg-white border border-[#E2DDD3] rounded-xl p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#57534E]">
                      <span className="font-mono font-medium text-[#1C1917]">
                        {record.maBanGhi || 'Chưa có mã'}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{record.khoiDiSan || 'Chưa phân khối'}</span>
                    </div>
                    <VerificationBadge
                      mucKiemChung={record.boSung.mucKiemChung}
                      compact
                    />
                  </div>

                  <h2 className="font-serif text-xl font-semibold text-[#1C1917] leading-snug">
                    {title}
                  </h2>

                  {record.dublinCore.description && (
                    <p className="mt-2.5 text-base text-[#44403C] leading-relaxed line-clamp-3">
                      {record.dublinCore.description}
                    </p>
                  )}

                  <dl className="mt-4 pt-4 border-t border-[#E2DDD3] space-y-1.5 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-[#57534E] shrink-0">Loại tư liệu:</dt>
                      <dd className="text-[#1C1917] font-medium">
                        {record.loaiTuLieu || 'Chưa cập nhật'}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[#57534E] shrink-0">Niên đại:</dt>
                      <dd className="text-[#1C1917]">
                        {record.dublinCore.date || 'Chưa cập nhật'}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[#57534E] shrink-0">Nơi lưu giữ:</dt>
                      <dd className="text-[#1C1917]">
                        {record.boSung.noiLuuGiuHienNay || 'Chưa cập nhật'}
                      </dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-[#57534E] shrink-0">Ảnh đính kèm:</dt>
                      <dd className="text-[#1C1917] tabular-nums">
                        {record.hinhAnh.length} tệp
                      </dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenRecord(record)}
                  className="min-h-[44px] w-full px-4 py-2.5 text-base font-medium text-[#1C1917] bg-[#F2EFE8] hover:bg-[#E7E1D5] rounded-lg transition-colors inline-flex items-center justify-between"
                >
                  <span>Xem hồ sơ chi tiết</span>
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
