import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  buildExportJson,
  createEmptyRecord,
  extractFilterOptions,
  filterRecords,
  getVerificationDisplay,
  normalizeVietnamese,
  selectRelevantRecordsForQA,
  toSafeImageUrl,
  validateDataset,
} from './archive';
import { DUBLIN_CORE_FIELDS, SUPPLEMENTAL_FIELDS, TuLieuRecord } from '../types/archive';

function makeSampleRecord(overrides: Partial<TuLieuRecord> = {}): TuLieuRecord {
  const base = createEmptyRecord();
  return {
    ...base,
    maBanGhi: 'TL-TEST-01',
    khoiDiSan: 'Mộc bản trường học Phúc Giang',
    loaiTuLieu: 'Mộc bản',
    dublinCore: {
      ...base.dublinCore,
      title: 'Tâm kinh bản khắc Phúc Giang',
      creator: 'Nguyễn Huy Oánh',
      date: 'Thế kỷ XVIII',
      language: 'Hán',
    },
    boSung: {
      ...base.boSung,
      noiLuuGiuHienNay: 'Nhà thờ dòng họ Nguyễn Huy',
      loaiBanDangHienThi: 'Bản chụp giảm kích thước từ mộc bản gốc',
      mucKiemChung: 'Đã kiểm chứng',
    },
    ...overrides,
  };
}

test('tulieu.json on disk is valid and covers all 3 Trường Lưu heritage blocks', () => {
  const raw = fs.readFileSync(path.resolve(process.cwd(), 'tulieu.json'), 'utf-8');
  const dataset = validateDataset(JSON.parse(raw));
  assert.ok(dataset.banGhi.length >= 8);
  assert.equal(DUBLIN_CORE_FIELDS.length, 15);
  assert.equal(SUPPLEMENTAL_FIELDS.length, 9);

  const blocks = new Set(dataset.banGhi.map((r) => r.khoiDiSan));
  assert.ok(blocks.has('Mộc bản trường học Phúc Giang'));
  assert.ok(blocks.has('Hoàng Hoa sứ trình đồ'));
  assert.ok(blocks.has('Văn bản Hán Nôm làng Trường Lưu'));

  for (const r of dataset.banGhi) {
    assert.ok(r.maBanGhi.length > 0);
    for (const f of DUBLIN_CORE_FIELDS) {
      assert.ok(f.key in r.dublinCore);
    }
    for (const s of SUPPLEMENTAL_FIELDS) {
      assert.ok(s.key in r.boSung);
    }
  }
});

test('normalizeVietnamese removes accents for diacritic-insensitive search', () => {
  assert.equal(normalizeVietnamese('Làng Trường Lưu - Phúc Giang'), 'lang truong luu - phuc giang');
  assert.equal(normalizeVietnamese('Đinh Khánh Duy'), 'dinh khanh duy');
});

test('filterRecords filters by khoiDiSan, loaiTuLieu, noiLuuGiu, and query', () => {
  const r1 = makeSampleRecord();
  const r2 = makeSampleRecord({
    maBanGhi: 'TL-TEST-02',
    khoiDiSan: 'Hoàng Hoa sứ trình đồ',
    loaiTuLieu: 'Bản đồ hành trình',
    dublinCore: {
      ...createEmptyRecord().dublinCore,
      title: 'Hải trình và dịch trạm đi sứ',
    },
    boSung: {
      ...createEmptyRecord().boSung,
      noiLuuGiuHienNay: 'Phòng trưng bày di sản Trường Lưu',
      loaiBanDangHienThi: 'Bản số hóa giảm kích thước',
      mucKiemChung: 'Chưa kiểm chứng',
    },
  });

  const byBlock = filterRecords([r1, r2], {
    query: '',
    khoiDiSan: 'Hoàng Hoa sứ trình đồ',
    loaiTuLieu: 'tat-ca',
    noiLuuGiu: 'tat-ca',
  });
  assert.equal(byBlock.length, 1);
  assert.equal(byBlock[0].maBanGhi, 'TL-TEST-02');

  const byQueryNoAccent = filterRecords([r1, r2], {
    query: 'phuc giang',
    khoiDiSan: 'tat-ca',
    loaiTuLieu: 'tat-ca',
    noiLuuGiu: 'tat-ca',
  });
  assert.equal(byQueryNoAccent.length, 1);
  assert.equal(byQueryNoAccent[0].maBanGhi, 'TL-TEST-01');

  const byStorage = filterRecords([r1, r2], {
    query: '',
    khoiDiSan: 'tat-ca',
    loaiTuLieu: 'tat-ca',
    noiLuuGiu: 'Nhà thờ dòng họ Nguyễn Huy',
  });
  assert.equal(byStorage.length, 1);
  assert.equal(byStorage[0].maBanGhi, 'TL-TEST-01');
});

test('getVerificationDisplay enforces explicit warning for unverified content', () => {
  const emptyStatus = getVerificationDisplay('');
  assert.equal(emptyStatus.isVerified, false);
  assert.equal(emptyStatus.requiresWarning, true);
  assert.equal(emptyStatus.label, 'Chưa kiểm chứng');

  const unverified = getVerificationDisplay('Chưa kiểm chứng');
  assert.equal(unverified.isVerified, false);
  assert.equal(unverified.requiresWarning, true);

  const verified = getVerificationDisplay('Đã kiểm chứng');
  assert.equal(verified.isVerified, true);
  assert.equal(verified.requiresWarning, false);
});

test('extractFilterOptions returns sorted unique document types and storage locations', () => {
  const r1 = makeSampleRecord();
  const r2 = makeSampleRecord({
    maBanGhi: 'TL-TEST-02',
    loaiTuLieu: 'Sắc phong',
    boSung: {
      ...createEmptyRecord().boSung,
      noiLuuGiuHienNay: 'Bảo tàng Hà Tĩnh',
    },
  });
  const opts = extractFilterOptions([r1, r2]);
  assert.deepEqual(opts.loaiTuLieuOptions, ['Mộc bản', 'Sắc phong']);
  assert.deepEqual(opts.noiLuuGiuOptions, ['Bảo tàng Hà Tĩnh', 'Nhà thờ dòng họ Nguyễn Huy']);
});

test('selectRelevantRecordsForQA returns empty for empty dataset and matches relevant record', () => {
  assert.deepEqual(selectRelevantRecordsForQA([], 'Phúc Giang'), []);
  const r1 = makeSampleRecord();
  const r2 = makeSampleRecord({
    maBanGhi: 'TL-TEST-02',
    dublinCore: { ...createEmptyRecord().dublinCore, title: 'Khế ước ruộng đất' },
  });
  const hits = selectRelevantRecordsForQA([r1, r2], 'Khế ước');
  assert.equal(hits[0].maBanGhi, 'TL-TEST-02');
});

test('buildExportJson round-trips UTF-8 Vietnamese text cleanly', () => {
  const dataset = validateDataset({
    phienBan: '1.0',
    tenDuAn: 'Hồ sơ số Cụm di sản tư liệu làng Trường Lưu',
    banGhi: [makeSampleRecord()],
  });
  const json = buildExportJson(dataset);
  const parsed = validateDataset(JSON.parse(json));
  assert.equal(parsed.banGhi.length, 1);
  assert.equal(parsed.banGhi[0].dublinCore.title, 'Tâm kinh bản khắc Phúc Giang');
});

test('toSafeImageUrl encodes Vietnamese filenames, spaces, and ampersands safely', () => {
  assert.equal(
    toSafeImageUrl('/anh_tulieu/26 đạo sắc phong & văn tự.jpg'),
    '/anh_tulieu/26%20%C4%91%E1%BA%A1o%20s%E1%BA%AFc%20phong%20%26%20v%C4%83n%20t%E1%BB%B1.jpg'
  );
  assert.equal(
    toSafeImageUrl('/anh_tulieu/26%20%C4%91%E1%BA%A1o%20s%E1%BA%AFc%20phong%20%26%20v%C4%83n%20t%E1%BB%B1.jpg'),
    '/anh_tulieu/26%20%C4%91%E1%BA%A1o%20s%E1%BA%AFc%20phong%20%26%20v%C4%83n%20t%E1%BB%B1.jpg'
  );
  assert.equal(toSafeImageUrl('data:image/png;base64,abc'), 'data:image/png;base64,abc');
  assert.equal(toSafeImageUrl('/anh_tulieu/'), '');
});
