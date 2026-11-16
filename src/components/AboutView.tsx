import { Download, ShieldCheck } from 'lucide-react';
import { TuLieuRecord } from '../types/archive';

interface AboutViewProps {
  records: TuLieuRecord[];
  onExport: () => void;
}

export function AboutView({ records, onExport }: AboutViewProps) {
  return (
    <div className="space-y-10 pb-12 max-w-4xl mx-auto">
      <header className="border-b border-[#E2DDD3] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Giới thiệu dự án
        </h1>
        <p className="mt-3 text-lg text-[#44403C] leading-relaxed">
          Ứng dụng web hồ sơ số Cụm di sản tư liệu làng Trường Lưu được xây dựng
          nhằm hỗ trợ học sinh, sinh viên, nhà nghiên cứu, du khách và người dân
          địa phương tra cứu tư liệu văn hóa - lịch sử thuận tiện ngay trên
          điện thoại di động mà không tác động đến bản gốc.
        </p>
      </header>

      {/* Mandatory Exact Credit Section */}
      <section
        aria-labelledby="project-credit-heading"
        className="bg-[#F2EFE8] border border-[#D6CEBE] rounded-2xl p-6 sm:p-8 space-y-4"
      >
        <h2
          id="project-credit-heading"
          className="font-serif text-2xl font-semibold text-[#1C1917]"
        >
          Thông tin tác giả & đơn vị thực hiện
        </h2>
        <p className="text-lg font-medium text-[#1C1917] leading-relaxed">
          Sản phẩm thực tập của Đinh Khánh Duy, mã sinh viên TH05056, Nhóm 2,
          Chương trình Thực tập sinh Đợt 15 FPT Polytechnic và IMTA TECH, dự án
          xã hội phi lợi nhuận.
        </p>
        <dl className="pt-4 border-t border-[#D6CEBE] grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          <div>
            <dt className="text-sm text-[#57534E]">Sinh viên thực hiện</dt>
            <dd className="font-medium text-[#1C1917]">
              Đinh Khánh Duy (Mã SV: TH05056)
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#57534E]">Nhóm & Chương trình</dt>
            <dd className="font-medium text-[#1C1917]">
              Nhóm 2 · Thực tập sinh Đợt 15 FPT Polytechnic & IMTA TECH
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#57534E]">Tính chất dự án</dt>
            <dd className="font-medium text-[#1C1917]">
              Dự án xã hội phi lợi nhuận
            </dd>
          </div>
          <div>
            <dt className="text-sm text-[#57534E]">Số lượng tư liệu hiện có</dt>
            <dd className="font-medium text-[#1C1917] tabular-nums">
              {records.length} tư liệu trong hồ sơ
            </dd>
          </div>
        </dl>
      </section>

      {/* Technical & Ethical Principles */}
      <section className="bg-white border border-[#E2DDD3] rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-[#14532D] font-medium text-base">
          <ShieldCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
          <h2>Nguyên tắc trung thực tư liệu</h2>
        </div>
        <ul className="space-y-3 text-base text-[#44403C] leading-relaxed list-disc pl-5">
          <li>
            Không tự suy đoán hoặc bịa đặt thông tin lịch sử; khi nội dung chưa
            có trong hồ sơ tư liệu, hệ thống sẽ trả lời rõ ràng là chưa có tư
            liệu.
          </li>
          <li>
            Không hiển thị bản phiên âm, dịch nghĩa chưa kiểm mà thiếu nhãn cảnh
            báo mức kiểm chứng.
          </li>
          <li>
            Đề xuất phiên âm Hán Nôm từ ảnh chỉ phục vụ tham khảo, hiển thị kèm
            ô để người nghiên cứu kiểm sửa và không tự động lưu vào hồ sơ gốc.
          </li>
        </ul>
      </section>

      {/* Full Data Export Card */}
      <section className="bg-white border border-[#E2DDD3] rounded-xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
            Xuất toàn bộ dữ liệu hồ sơ số
          </h2>
          <p className="mt-1.5 text-base text-[#57534E]">
            Tải xuống toàn bộ dữ liệu hồ sơ tư liệu làng Trường Lưu để sao lưu,
            kiểm tra hoặc tái sử dụng trong nghiên cứu.
          </p>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="min-h-[48px] px-5 py-2.5 text-base font-medium text-white bg-[#8C2D19] hover:bg-[#722212] rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
        >
          <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Xuất toàn bộ dữ liệu ra tệp</span>
        </button>
      </section>
    </div>
  );
}
