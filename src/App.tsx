import { useEffect, useState } from 'react';
import { AboutView } from './components/AboutView';
import { ArchiveListView } from './components/ArchiveListView';
import { DetailView } from './components/DetailView';
import { HomeView } from './components/HomeView';
import { QAView } from './components/QAView';
import { SourcesView } from './components/SourcesView';
import { TopBar } from './components/TopBar';
import {
  ArchiveFilterState,
  ScreenId,
  TuLieuDataset,
  TuLieuRecord,
} from './types/archive';
import {
  buildExportJson,
  createEmptyRecord,
  validateDataset,
} from './utils/archive';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [diskDataset, setDiskDataset] = useState<TuLieuDataset | null>(null);
  const [localOverrideDataset, setLocalOverrideDataset] =
    useState<TuLieuDataset | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [filters, setFilters] = useState<ArchiveFilterState>({
    query: '',
    khoiDiSan: 'tat-ca',
    loaiTuLieu: 'tat-ca',
    noiLuuGiu: 'tat-ca',
  });

  const [selectedRecord, setSelectedRecord] = useState<TuLieuRecord | null>(
    null
  );
  const [isTemplatePreview, setIsTemplatePreview] = useState(false);

  useEffect(() => {
    let active = true;
    fetch('/api/tulieu')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Không thể tải dữ liệu từ /api/tulieu');
        }
        const json = await res.json();
        return validateDataset(json);
      })
      .then((parsed) => {
        if (active) {
          setDiskDataset(parsed);
        }
      })
      .catch((err) => {
        if (active) {
          setLoadError(
            err instanceof Error
              ? err.message
              : 'Không thể tải dữ liệu hồ sơ tư liệu lúc này.'
          );
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const activeDataset = localOverrideDataset ?? diskDataset;
  const records = activeDataset?.banGhi ?? [];

  const navigateTo = (screen: ScreenId) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportAll = () => {
    if (localOverrideDataset) {
      const jsonStr = buildExportJson(localOverrideDataset);
      const blob = new Blob([jsonStr], {
        type: 'application/json;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tulieu.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return;
    }

    const link = document.createElement('a');
    link.href = '/api/tulieu/export';
    link.download = 'tulieu.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleOpenRecord = (record: TuLieuRecord) => {
    setSelectedRecord(record);
    setIsTemplatePreview(false);
    navigateTo('detail');
  };

  const handleOpenTemplatePreview = () => {
    setSelectedRecord(activeDataset?.cauTrucMau ?? createEmptyRecord());
    setIsTemplatePreview(true);
    navigateTo('detail');
  };

  const handleOpenRecordById = (maBanGhi: string) => {
    const found = records.find((r) => r.maBanGhi === maBanGhi);
    if (found) {
      handleOpenRecord(found);
    } else {
      navigateTo('archive');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#1C1917] pb-20 md:pb-0">
      <TopBar
        activeScreen={activeScreen}
        onNavigate={navigateTo}
        onExport={handleExportAll}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 md:pt-10">
        {loadError && (
          <div
            role="alert"
            className="mb-6 bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] rounded-xl p-4 text-base"
          >
            {loadError}
          </div>
        )}

        {activeScreen === 'home' && (
          <HomeView
            records={records}
            onSearchSubmit={(query) => {
              setFilters({
                query,
                khoiDiSan: 'tat-ca',
                loaiTuLieu: 'tat-ca',
                noiLuuGiu: 'tat-ca',
              });
              navigateTo('archive');
            }}
            onSelectBlock={(block) => {
              setFilters({
                query: '',
                khoiDiSan: block,
                loaiTuLieu: 'tat-ca',
                noiLuuGiu: 'tat-ca',
              });
              navigateTo('archive');
            }}
            onFilterBySite={(siteKeyword) => {
              setFilters({
                query: siteKeyword,
                khoiDiSan: 'tat-ca',
                loaiTuLieu: 'tat-ca',
                noiLuuGiu: 'tat-ca',
              });
              navigateTo('archive');
            }}
            onOpenQA={() => navigateTo('qa')}
          />
        )}

        {activeScreen === 'archive' && (
          <ArchiveListView
            records={records}
            filters={filters}
            onFiltersChange={setFilters}
            onOpenRecord={handleOpenRecord}
          />
        )}

        {activeScreen === 'detail' && (
          <DetailView
            record={
              selectedRecord ?? activeDataset?.cauTrucMau ?? createEmptyRecord()
            }
            isTemplatePreview={isTemplatePreview}
            onBack={() => navigateTo('archive')}
          />
        )}

        {activeScreen === 'qa' && (
          <QAView
            records={records}
            isUsingLocalOverride={Boolean(localOverrideDataset)}
            onOpenRecordById={handleOpenRecordById}
          />
        )}

        {activeScreen === 'sources' && (
          <SourcesView records={records} onExport={handleExportAll} />
        )}

        {activeScreen === 'about' && (
          <AboutView records={records} onExport={handleExportAll} />
        )}
      </main>

      <footer className="border-t border-[#E2DDD3] bg-[#F2EFE8]/60 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-[#57534E]">
          <p>
            Hồ sơ số Cụm di sản tư liệu làng Trường Lưu · Dự án xã hội phi lợi
            nhuận
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('sources')}
              className="hover:text-[#1C1917] underline-offset-4 hover:underline min-h-[40px]"
            >
              Nguồn & Ghi nhận
            </button>
            <button
              type="button"
              onClick={() => navigateTo('about')}
              className="hover:text-[#1C1917] underline-offset-4 hover:underline min-h-[40px]"
            >
              Giới thiệu
            </button>
            <button
              type="button"
              onClick={handleExportAll}
              className="font-medium text-[#8C2D19] hover:underline min-h-[40px]"
            >
              Xuất dữ liệu tư liệu
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
