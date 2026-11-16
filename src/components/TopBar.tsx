import {
  BookOpen,
  Download,
  FolderArchive,
  Home,
  Info,
  MessageSquareText,
} from 'lucide-react';
import { ScreenId } from '../types/archive';

interface TopBarProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onExport: () => void;
}

const NAV_ITEMS: Array<{
  id: ScreenId;
  label: string;
  mobileLabel: string;
  Icon: typeof Home;
}> = [
  { id: 'home', label: 'Trang chủ', mobileLabel: 'Trang chủ', Icon: Home },
  {
    id: 'archive',
    label: 'Tư liệu',
    mobileLabel: 'Tư liệu',
    Icon: FolderArchive,
  },
  {
    id: 'qa',
    label: 'Hỏi đáp',
    mobileLabel: 'Hỏi đáp',
    Icon: MessageSquareText,
  },
  {
    id: 'sources',
    label: 'Nguồn & Ghi nhận',
    mobileLabel: 'Nguồn',
    Icon: BookOpen,
  },
  { id: 'about', label: 'Giới thiệu', mobileLabel: 'Giới thiệu', Icon: Info },
];

export function TopBar({ activeScreen, onNavigate, onExport }: TopBarProps) {
  const isNavActive = (id: ScreenId) =>
    activeScreen === id || (id === 'archive' && activeScreen === 'detail');

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-[#E2DDD3]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 md:h-16 flex items-center justify-between gap-4 md:gap-8">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="font-serif text-base sm:text-lg md:text-xl font-bold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 min-h-[44px] flex items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
          >
            Hồ Sơ Di Sản Trường Lưu
          </button>

          <nav
            aria-label="Điều hướng chính"
            className="hidden md:flex items-center gap-6"
          >
            {NAV_ITEMS.map(({ id, label }) => {
              const active = isNavActive(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`min-h-[44px] px-1 text-[15px] font-medium whitespace-nowrap shrink-0 border-b-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19] ${
                    active
                      ? 'border-[#8C2D19] text-[#8C2D19] font-semibold'
                      : 'border-transparent text-[#57534E] hover:text-[#1C1917] hover:border-[#D6CEBE]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[40px] md:min-h-[44px] text-sm font-medium text-white bg-[#8C2D19] hover:bg-[#722212] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
            >
              <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Xuất dữ liệu</span>
            </button>
          </div>
        </div>
      </header>

      <nav
        aria-label="Điều hướng di động"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-t border-[#E2DDD3]"
      >
        <div className="grid grid-cols-5 h-[60px]">
          {NAV_ITEMS.map(({ id, mobileLabel, Icon }) => {
            const active = isNavActive(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] px-1 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#8C2D19] ${
                  active
                    ? 'text-[#8C2D19] font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span className="text-[11px] leading-tight whitespace-nowrap truncate max-w-full">
                  {mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
