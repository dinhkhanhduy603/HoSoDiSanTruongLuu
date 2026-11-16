import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookMarked,
  Send,
} from 'lucide-react';
import { QAResponse, TuLieuRecord } from '../types/archive';

interface QAItem {
  id: string;
  question: string;
  response: QAResponse;
}

interface QAViewProps {
  records: TuLieuRecord[];
  isUsingLocalOverride: boolean;
  onOpenRecordById: (maBanGhi: string) => void;
}

const SAMPLE_QUESTIONS = [
  'Có những tư liệu nào thuộc Mộc bản trường học Phúc Giang và đang lưu giữ ở đâu?',
  'Tư liệu Hoàng Hoa sứ trình đồ hiện đang hiển thị loại bản nào?',
  'Văn bản Hán Nôm nào đã được kiểm chứng và do ai cho phép công bố?',
];

export function QAView({
  records,
  isUsingLocalOverride,
  onOpenRecordById,
}: QAViewProps) {
  const [questionInput, setQuestionInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<QAItem[]>([]);

  const askQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed) return;

    setErrorMsg(null);
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: trimmed,
          ...(isUsingLocalOverride ? { records } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error || 'Không thể xử lý câu hỏi vào lúc này.'
        );
      }

      setHistory((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          question: trimmed,
          response: data as QAResponse,
        },
        ...prev,
      ]);
      setQuestionInput('');
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Không thể gửi câu hỏi tra cứu vào lúc này.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    askQuestion(questionInput);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <header className="border-b border-[#E2DDD3] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1C1917]">
          Hỏi đáp theo hồ sơ tư liệu
        </h1>
        <p className="mt-3 text-base text-[#44403C] leading-relaxed">
          Trợ lý hỏi đáp chỉ trả lời <strong>hoàn toàn dựa trên hồ sơ tư liệu</strong>{' '}
          hiện có của làng Trường Lưu. Nếu thông tin chưa có trong hồ sơ, hệ
          thống sẽ thông báo rõ là chưa có tư liệu thay vì tự suy đoán. Mỗi câu
          trả lời có dữ liệu luôn kèm <strong>mã bản ghi</strong>,{' '}
          <strong>nơi lưu giữ</strong> và <strong>loại bản</strong>.
        </p>
        <p className="mt-2 text-sm text-[#57534E] tabular-nums">
          Nguồn tra cứu hiện tại: <strong>{records.length}</strong> tư liệu
          trong hồ sơ.
        </p>
      </header>

      {/* Ask Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E2DDD3] rounded-xl p-5 sm:p-6 space-y-4"
      >
        <div>
          <label
            htmlFor="qa-question-input"
            className="block text-base font-medium text-[#1C1917] mb-2"
          >
            Nhập câu hỏi cần tra cứu về di sản tư liệu làng Trường Lưu
          </label>
          <textarea
            id="qa-question-input"
            rows={3}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
            placeholder="Ví dụ: Tư liệu nào có mã số đăng ký... hoặc đang được lưu giữ tại Nhà thờ dòng họ Nguyễn Huy?"
            className="w-full p-3.5 text-base bg-[#FAF8F4] border border-[#D6CEBE] rounded-lg text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#8C2D19] focus:ring-2 focus:ring-[#8C2D19]/15"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-sm text-[#57534E]">
            Câu trả lời luôn đối chiếu trực tiếp từ hồ sơ tư liệu hiện có
          </span>
          <button
            type="submit"
            disabled={isLoading || !questionInput.trim()}
            className="min-h-[44px] px-6 py-2.5 text-base font-medium text-white bg-[#8C2D19] hover:bg-[#722212] disabled:opacity-50 rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Send className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{isLoading ? 'Đang tra cứu...' : 'Gửi câu hỏi'}</span>
          </button>
        </div>
      </form>

      {/* Quick Prompts */}
      <section aria-label="Gợi ý câu hỏi mẫu">
        <p className="text-sm font-medium text-[#57534E] mb-2.5">
          Gợi ý câu hỏi tra cứu nhanh:
        </p>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setQuestionInput(sample);
                askQuestion(sample);
              }}
              disabled={isLoading}
              className="min-h-[44px] px-3.5 py-2 text-left text-sm text-[#1C1917] bg-[#F2EFE8] hover:bg-[#E7E1D5] border border-[#E2DDD3] rounded-lg transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </section>

      {errorMsg && (
        <div
          role="alert"
          className="bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-xl p-4 flex items-start gap-2.5 text-base"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Results History */}
      <section aria-label="Lịch sử hỏi đáp" className="space-y-6">
        {history.length === 0 ? (
          <div className="bg-[#F2EFE8] border border-[#E2DDD3] rounded-xl p-6 text-center text-base text-[#57534E]">
            Chưa có câu hỏi nào trong phiên này. Hãy nhập câu hỏi phía trên để
            bắt đầu tra cứu.
          </div>
        ) : (
          history.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-[#E2DDD3] rounded-xl p-6 space-y-5"
            >
              <div className="border-b border-[#E2DDD3] pb-3">
                <p className="text-xs font-medium text-[#57534E] mb-1">
                  Câu hỏi của bạn
                </p>
                <h2 className="font-serif text-xl font-semibold text-[#1C1917]">
                  {item.question}
                </h2>
              </div>

              <div
                className={`rounded-lg p-4 text-base leading-relaxed whitespace-pre-wrap ${
                  item.response.coTuLieu
                    ? 'bg-[#FAF8F4] border border-[#E2DDD3] text-[#1C1917]'
                    : 'bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E]'
                }`}
              >
                {item.response.cauTraLoi}
              </div>

              {item.response.trichDan.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-[#44403C]">
                    <BookMarked
                      className="w-4 h-4 text-[#8C2D19] shrink-0"
                      aria-hidden="true"
                    />
                    <span>Tư liệu dẫn nguồn trong hồ sơ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.response.trichDan.map((cite) => (
                      <div
                        key={cite.maBanGhi}
                        className="bg-[#F2EFE8] border border-[#E2DDD3] rounded-lg p-4 flex flex-col justify-between gap-3"
                      >
                        <dl className="space-y-1 text-sm">
                          <div>
                            <dt className="text-[#57534E] inline">
                              Mã bản ghi:{' '}
                            </dt>
                            <dd className="inline font-mono font-semibold text-[#8C2D19]">
                              {cite.maBanGhi}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[#57534E] inline">Nhan đề: </dt>
                            <dd className="inline font-medium text-[#1C1917]">
                              {cite.nhanDe}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[#57534E] inline">
                              Nơi lưu giữ:{' '}
                            </dt>
                            <dd className="inline text-[#1C1917]">
                              {cite.noiLuuGiuHienNay}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-[#57534E] inline">Loại bản: </dt>
                            <dd className="inline text-[#1C1917]">
                              {cite.loaiBanDangHienThi}
                            </dd>
                          </div>
                        </dl>
                        <button
                          type="button"
                          onClick={() => onOpenRecordById(cite.maBanGhi)}
                          className="min-h-[40px] text-sm font-medium text-[#8C2D19] hover:underline inline-flex items-center gap-1 self-start"
                        >
                          <span>Mở chi tiết bản ghi</span>
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
