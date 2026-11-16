import {
  ArchiveFilterState,
  DUBLIN_CORE_FIELDS,
  DublinCoreMetadata,
  MucKiemChung,
  SUPPLEMENTAL_FIELDS,
  SupplementalMetadata,
  TuLieuDataset,
  TuLieuRecord,
} from '../types/archive';

export interface VerificationDisplay {
  label: string;
  isVerified: boolean;
  requiresWarning: boolean;
  tone: 'verified' | 'reviewing' | 'unverified';
}

export function normalizeVietnamese(input: string): string {
  if (!input) return '';
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

export function getVerificationDisplay(
  mucKiemChung?: string | null
): VerificationDisplay {
  const raw = (mucKiemChung ?? '').trim();
  const norm = normalizeVietnamese(raw);

  if (norm === 'da kiem chung' || norm === 'da kiem') {
    return {
      label: raw || 'Đã kiểm chứng',
      isVerified: true,
      requiresWarning: false,
      tone: 'verified',
    };
  }

  if (norm === 'dang doi chieu' || norm === 'dang kiem') {
    return {
      label: raw || 'Đang đối chiếu',
      isVerified: false,
      requiresWarning: true,
      tone: 'reviewing',
    };
  }

  return {
    label: raw || 'Chưa kiểm chứng',
    isVerified: false,
    requiresWarning: true,
    tone: 'unverified',
  };
}

export function buildRecordSearchableText(record: TuLieuRecord): string {
  const dcValues = DUBLIN_CORE_FIELDS.map(
    (f) => record.dublinCore?.[f.key] ?? ''
  );
  const supValues = SUPPLEMENTAL_FIELDS.map(
    (f) => record.boSung?.[f.key] ?? ''
  );
  const parts = [
    record.maBanGhi ?? '',
    record.khoiDiSan ?? '',
    record.loaiTuLieu ?? '',
    record.nguoiDangLuuGiu?.hoTen ?? '',
    record.nguoiDangLuuGiu?.vaiTro ?? '',
    record.nguoiDangLuuGiu?.donViHoacDiaChi ?? '',
    record.phienAm?.noiDung ?? '',
    record.dichNghia?.noiDung ?? '',
    ...dcValues,
    ...supValues,
  ];
  return normalizeVietnamese(parts.join(' '));
}

export function filterRecords(
  records: TuLieuRecord[],
  filters: ArchiveFilterState
): TuLieuRecord[] {
  const normQuery = normalizeVietnamese(filters.query);

  return records.filter((record) => {
    if (
      filters.khoiDiSan &&
      filters.khoiDiSan !== 'tat-ca' &&
      record.khoiDiSan !== filters.khoiDiSan
    ) {
      return false;
    }

    if (
      filters.loaiTuLieu &&
      filters.loaiTuLieu !== 'tat-ca' &&
      record.loaiTuLieu !== filters.loaiTuLieu
    ) {
      return false;
    }

    if (filters.noiLuuGiu && filters.noiLuuGiu !== 'tat-ca') {
      const storage = normalizeVietnamese(
        record.boSung?.noiLuuGiuHienNay ?? ''
      );
      const filterStorage = normalizeVietnamese(filters.noiLuuGiu);
      if (storage !== filterStorage && !storage.includes(filterStorage)) {
        return false;
      }
    }

    if (normQuery) {
      const haystack = buildRecordSearchableText(record);
      const tokens = normQuery.split(/\s+/).filter(Boolean);
      for (const token of tokens) {
        if (!haystack.includes(token)) {
          return false;
        }
      }
    }

    return true;
  });
}

export function extractFilterOptions(records: TuLieuRecord[]): {
  loaiTuLieuOptions: string[];
  noiLuuGiuOptions: string[];
} {
  const loaiSet = new Set<string>();
  const noiLuuGiuSet = new Set<string>();

  for (const r of records) {
    if (r.loaiTuLieu?.trim()) {
      loaiSet.add(r.loaiTuLieu.trim());
    }
    if (r.boSung?.noiLuuGiuHienNay?.trim()) {
      noiLuuGiuSet.add(r.boSung.noiLuuGiuHienNay.trim());
    }
  }

  return {
    loaiTuLieuOptions: Array.from(loaiSet).sort((a, b) =>
      a.localeCompare(b, 'vi')
    ),
    noiLuuGiuOptions: Array.from(noiLuuGiuSet).sort((a, b) =>
      a.localeCompare(b, 'vi')
    ),
  };
}

export function createEmptyRecord(): TuLieuRecord {
  const emptyDc: DublinCoreMetadata = {
    title: '',
    creator: '',
    subject: '',
    description: '',
    publisher: '',
    contributor: '',
    date: '',
    type: '',
    format: '',
    identifier: '',
    source: '',
    language: '',
    relation: '',
    coverage: '',
    rights: '',
  };

  const emptySup: SupplementalMetadata = {
    noiLuuGiuHienNay: '',
    noiLuuGiuTaiThoiDiemTuLieu: '',
    loaiBanDangHienThi: '',
    tinhTrangBanGoc: '',
    soDangKy: '',
    nguoiChoPhepCongBo: '',
    phamViDuocPhep: '',
    phanKhongCongBo: '',
    mucKiemChung: 'Chưa kiểm chứng' as MucKiemChung,
  };

  return {
    maBanGhi: '',
    khoiDiSan: '',
    loaiTuLieu: '',
    dublinCore: emptyDc,
    boSung: emptySup,
    nguoiDangLuuGiu: {
      hoTen: '',
      vaiTro: '',
      donViHoacDiaChi: '',
      ghiChuLienHe: '',
    },
    phienAm: {
      noiDung: '',
      mucKiemChung: 'Chưa kiểm chứng',
      nguoiKiem: '',
      ngayKiem: '',
    },
    dichNghia: {
      noiDung: '',
      mucKiemChung: 'Chưa kiểm chứng',
      nguoiKiem: '',
      ngayKiem: '',
    },
    hinhAnh: [],
  };
}

export function normalizeRecord(raw: Partial<TuLieuRecord>): TuLieuRecord {
  const base = createEmptyRecord();
  return {
    maBanGhi: String(raw.maBanGhi ?? ''),
    khoiDiSan: String(raw.khoiDiSan ?? ''),
    loaiTuLieu: String(raw.loaiTuLieu ?? ''),
    dublinCore: {
      ...base.dublinCore,
      ...(raw.dublinCore ?? {}),
    },
    boSung: {
      ...base.boSung,
      ...(raw.boSung ?? {}),
      mucKiemChung: raw.boSung?.mucKiemChung?.trim() || 'Chưa kiểm chứng',
    },
    nguoiDangLuuGiu: {
      ...base.nguoiDangLuuGiu,
      ...(raw.nguoiDangLuuGiu ?? {}),
    },
    phienAm: {
      ...base.phienAm,
      ...(raw.phienAm ?? {}),
      mucKiemChung: raw.phienAm?.mucKiemChung?.trim() || 'Chưa kiểm chứng',
    },
    dichNghia: {
      ...base.dichNghia,
      ...(raw.dichNghia ?? {}),
      mucKiemChung: raw.dichNghia?.mucKiemChung?.trim() || 'Chưa kiểm chứng',
    },
    hinhAnh: Array.isArray(raw.hinhAnh)
      ? raw.hinhAnh.map((img) => ({
          tenTep: String(img?.tenTep ?? ''),
          duongDan: String(
            img?.duongDan ??
              img?.duongDanToanTrang ??
              img?.duongDanCanCanh ??
              ''
          ),
          duongDanToanTrang: String(img?.duongDanToanTrang ?? ''),
          duongDanCanCanh: String(img?.duongDanCanCanh ?? ''),
          chuThich: String(img?.chuThich ?? ''),
          nguon: String(img?.nguon ?? ''),
          laBanGiamKichThuoc: img?.laBanGiamKichThuoc ?? true,
        }))
      : [],
  };
}

export function validateDataset(raw: unknown): TuLieuDataset {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Dữ liệu JSON không đúng định dạng đối tượng.');
  }
  const obj = raw as Record<string, unknown>;
  const rawRecords = Array.isArray(obj.banGhi)
    ? obj.banGhi
    : Array.isArray(raw)
      ? raw
      : null;

  if (!rawRecords) {
    throw new Error('Tệp JSON cần chứa mảng "banGhi".');
  }

  return {
    phienBan: String(obj.phienBan ?? '1.0'),
    tenDuAn: String(
      obj.tenDuAn ?? 'Hồ sơ số Cụm di sản tư liệu làng Trường Lưu'
    ),
    ghiChu: String(obj.ghiChu ?? ''),
    cauTrucMau: obj.cauTrucMau
      ? normalizeRecord(obj.cauTrucMau as Partial<TuLieuRecord>)
      : createEmptyRecord(),
    banGhi: rawRecords.map((item) =>
      normalizeRecord((item ?? {}) as Partial<TuLieuRecord>)
    ),
  };
}

export function buildExportJson(dataset: TuLieuDataset): string {
  return JSON.stringify(dataset, null, 2);
}

export function selectRelevantRecordsForQA(
  records: TuLieuRecord[],
  question: string,
  maxRecords = 12
): TuLieuRecord[] {
  if (records.length === 0) return [];
  const normQ = normalizeVietnamese(question);
  const tokens = normQ.split(/\s+/).filter((t) => t.length >= 2);

  if (tokens.length === 0) {
    return records.slice(0, maxRecords);
  }

  const scored = records.map((record) => {
    const haystack = buildRecordSearchableText(record);
    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) {
        score += 1;
      }
    }
    return { record, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matching = scored.filter((s) => s.score > 0).map((s) => s.record);
  return (matching.length > 0 ? matching : records).slice(0, maxRecords);
}

export function toSafeImageUrl(rawPath?: string | null): string {
  const trimmed = (rawPath ?? '').trim();
  if (!trimmed) return '';
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (normalized.startsWith('/anh_tulieu/')) {
    const filePart = normalized.slice('/anh_tulieu/'.length);
    if (!filePart) return '';
    let decoded = filePart;
    try {
      decoded = decodeURIComponent(filePart);
    } catch {
      decoded = filePart;
    }
    return `/anh_tulieu/${encodeURIComponent(decoded)}`;
  }
  return encodeURI(normalized);
}

