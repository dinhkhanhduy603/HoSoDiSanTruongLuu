import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  selectRelevantRecordsForQA,
  validateDataset,
} from './src/utils/archive.ts';
import { QACitation, TuLieuDataset, TuLieuRecord } from './src/types/archive.ts';

dotenv.config();

const ROOT_DIR = process.cwd();
const TULIEU_PATH = path.resolve(ROOT_DIR, 'tulieu.json');
const ANH_TULIEU_DIR = path.resolve(ROOT_DIR, 'anh_tulieu');
const PORT = 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function readTulieuFromDisk(): TuLieuDataset {
  const raw = fs.readFileSync(TULIEU_PATH, 'utf-8');
  return validateDataset(JSON.parse(raw));
}

function inferMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  // Ensure archival image folder exists and serve it cleanly
  fs.mkdirSync(ANH_TULIEU_DIR, { recursive: true });
  app.use('/anh_tulieu', express.static(ANH_TULIEU_DIR));

  // API: List image files available in anh_tulieu
  app.get('/api/anh-tulieu', (_req, res) => {
    try {
      const entries = fs.readdirSync(ANH_TULIEU_DIR, { withFileTypes: true });
      const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
      const files = entries
        .filter(
          (entry) =>
            entry.isFile() &&
            imageExts.has(path.extname(entry.name).toLowerCase())
        )
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, 'vi'));
      res.json({ files });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Không đọc được danh sách ảnh tư liệu.';
      res.status(500).json({ error: msg });
    }
  });

  // API: Load tulieu.json
  app.get('/api/tulieu', (_req, res) => {
    try {
      const dataset = readTulieuFromDisk();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json(dataset);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không đọc được tệp tulieu.json';
      res.status(500).json({ error: msg });
    }
  });

  // API: Export tulieu.json as downloadable UTF-8 file
  app.get('/api/tulieu/export', (_req, res) => {
    try {
      const raw = fs.readFileSync(TULIEU_PATH, 'utf-8');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="tulieu.json"');
      res.send(raw);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Không xuất được tệp tulieu.json';
      res.status(500).json({ error: msg });
    }
  });

  // API: Upload or attach an image to a record and persist into tulieu.json
  app.post('/api/records/:maBanGhi/image', (req, res) => {
    try {
      const maBanGhi = decodeURIComponent(String(req.params.maBanGhi ?? '')).trim();
      const { fileName, imageBase64, mimeType, existingFileName } = req.body ?? {};

      const dataset = readTulieuFromDisk();
      const idx = dataset.banGhi.findIndex((r) => r.maBanGhi === maBanGhi);
      if (idx === -1) {
        res.status(404).json({ error: 'Không tìm thấy bản ghi tư liệu để gắn ảnh.' });
        return;
      }

      let storedFileName = '';
      if (typeof existingFileName === 'string' && existingFileName.trim()) {
        const cleanExisting = path.basename(existingFileName.trim());
        const resolvedExisting = path.resolve(ANH_TULIEU_DIR, cleanExisting);
        if (
          !resolvedExisting.startsWith(ANH_TULIEU_DIR + path.sep) ||
          !fs.existsSync(resolvedExisting)
        ) {
          res.status(404).json({ error: 'Không tìm thấy tệp ảnh đã chọn.' });
          return;
        }
        storedFileName = cleanExisting;
      } else if (typeof imageBase64 === 'string' && imageBase64.trim()) {
        const base64Body = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();
        const buffer = Buffer.from(base64Body, 'base64');
        if (buffer.length === 0) {
          res.status(400).json({ error: 'Tệp ảnh tải lên không hợp lệ hoặc bị rỗng.' });
          return;
        }
        const extFromMime =
          mimeType === 'image/png'
            ? '.png'
            : mimeType === 'image/webp'
              ? '.webp'
              : mimeType === 'image/gif'
                ? '.gif'
                : '.jpg';
        const rawBase = path
          .basename(String(fileName || `${maBanGhi}${extFromMime}`))
          .replace(/[\\/:*?"<>|]/g, '_')
          .trim();
        const hasValidExt = /\.(jpe?g|png|webp|gif)$/i.test(rawBase);
        storedFileName = hasValidExt ? rawBase : `${rawBase}${extFromMime}`;
        const destPath = path.resolve(ANH_TULIEU_DIR, storedFileName);
        if (!destPath.startsWith(ANH_TULIEU_DIR + path.sep)) {
          res.status(400).json({ error: 'Tên tệp ảnh không hợp lệ.' });
          return;
        }
        fs.writeFileSync(destPath, buffer);
      } else {
        res.status(400).json({ error: 'Vui lòng chọn tệp ảnh hợp lệ để gắn vào hồ sơ.' });
        return;
      }

      const publicPath = `/anh_tulieu/${storedFileName}`;
      const record = dataset.banGhi[idx];
      record.hinhAnh = [
        {
          tenTep: storedFileName,
          duongDan: publicPath,
          duongDanToanTrang: publicPath,
          duongDanCanCanh: '',
          chuThich: record.dublinCore.title || maBanGhi,
          nguon: record.boSung.noiLuuGiuHienNay || 'Tư liệu lưu trữ tại làng Trường Lưu',
          laBanGiamKichThuoc: true,
        },
      ];
      if (
        !record.boSung.loaiBanDangHienThi ||
        record.boSung.loaiBanDangHienThi.includes('chưa đính kèm ảnh') ||
        record.boSung.loaiBanDangHienThi.includes('chưa tách lẻ ảnh')
      ) {
        record.boSung.loaiBanDangHienThi =
          'Bản ảnh chụp giảm kích thước kèm hồ sơ mô tả';
      }

      fs.writeFileSync(
        TULIEU_PATH,
        JSON.stringify(dataset, null, 2) + '\n',
        'utf-8'
      );

      res.json({ ok: true, record, fileName: storedFileName, path: publicPath });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Không thể lưu ảnh vào hồ sơ.';
      res.status(500).json({ error: msg });
    }
  });

  // API: Remove image attachment from a record
  app.delete('/api/records/:maBanGhi/image', (req, res) => {
    try {
      const maBanGhi = decodeURIComponent(String(req.params.maBanGhi ?? '')).trim();
      const dataset = readTulieuFromDisk();
      const idx = dataset.banGhi.findIndex((r) => r.maBanGhi === maBanGhi);
      if (idx === -1) {
        res.status(404).json({ error: 'Không tìm thấy bản ghi tư liệu.' });
        return;
      }
      dataset.banGhi[idx].hinhAnh = [];
      fs.writeFileSync(
        TULIEU_PATH,
        JSON.stringify(dataset, null, 2) + '\n',
        'utf-8'
      );
      res.json({ ok: true, record: dataset.banGhi[idx] });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Không thể gỡ ảnh khỏi hồ sơ.';
      res.status(500).json({ error: msg });
    }
  });

  // API: Grounded Q&A strictly from tulieu.json
  app.post('/api/gemini/qa', async (req, res) => {
    try {
      const question = String(req.body?.question ?? '').trim();
      if (!question) {
        res.status(400).json({ error: 'Vui lòng nhập câu hỏi cần tra cứu.' });
        return;
      }

      let records: TuLieuRecord[] = [];
      if (Array.isArray(req.body?.records)) {
        const validated = validateDataset({ banGhi: req.body.records });
        records = validated.banGhi;
      } else {
        const dataset = readTulieuFromDisk();
        records = dataset.banGhi;
      }

      if (records.length === 0) {
        res.json({
          coTuLieu: false,
          cauTraLoi:
            'Chưa có tư liệu trong hồ sơ nên hệ thống chưa thể trả lời câu hỏi này.',
          trichDan: [],
        });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'Chức năng hỏi đáp tự động hiện chưa được kích hoạt. Vui lòng thử lại sau.',
        });
        return;
      }

      const relevant = selectRelevantRecordsForQA(records, question, 15);
      const compactContext = relevant.map((r) => ({
        maBanGhi: r.maBanGhi,
        khoiDiSan: r.khoiDiSan,
        loaiTuLieu: r.loaiTuLieu,
        dublinCore: r.dublinCore,
        boSung: r.boSung,
        nguoiDangLuuGiu: r.nguoiDangLuuGiu,
        phienAm: r.phienAm,
        dichNghia: r.dichNghia,
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: `Câu hỏi của người dùng:\n"${question}"\n\nDữ liệu hồ sơ từ tulieu.json:\n${JSON.stringify(
          compactContext,
          null,
          2
        )}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          systemInstruction:
            'Bạn là trợ lý tra cứu của Hồ sơ số Cụm di sản tư liệu làng Trường Lưu. ' +
            'QUY TẮC BẮT BUỘC: ' +
            '1) Chỉ trả lời HOÀN TOÀN dựa trên dữ liệu JSON trong tulieu.json được cung cấp. ' +
            '2) TUYỆT ĐỐI KHÔNG tự suy đoán, không bịa thông tin, không dùng kiến thức bên ngoài dữ liệu. ' +
            '3) Nếu câu hỏi không có thông tin tương ứng trong dữ liệu được cung cấp, đặt coTuLieu = false, trả lời rõ ràng "Chưa có tư liệu về nội dung này trong dữ liệu hiện tại." và để trichDan rỗng []. ' +
            '4) Nếu câu trả lời sử dụng phần phiên âm hoặc dịch nghĩa có mucKiemChung khác "Đã kiểm chứng", bắt buộc nêu rõ tình trạng chưa kiểm chứng trong câu trả lời. ' +
            '5) Luôn trả lời bằng tiếng Việt có dấu, ngắn gọn, rõ ràng, và điền chính xác maBanGhi, nhanDe, noiLuuGiuHienNay, loaiBanDangHienThi vào trichDan.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              coTuLieu: {
                type: Type.BOOLEAN,
                description: 'true nếu tìm thấy thông tin trong tulieu.json, false nếu chưa có tư liệu.',
              },
              cauTraLoi: {
                type: Type.STRING,
                description: 'Câu trả lời tiếng Việt hoàn toàn bám sát tulieu.json.',
              },
              trichDan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    maBanGhi: { type: Type.STRING },
                    nhanDe: { type: Type.STRING },
                    noiLuuGiuHienNay: { type: Type.STRING },
                    loaiBanDangHienThi: { type: Type.STRING },
                  },
                  required: ['maBanGhi', 'nhanDe', 'noiLuuGiuHienNay', 'loaiBanDangHienThi'],
                },
              },
            },
            required: ['coTuLieu', 'cauTraLoi', 'trichDan'],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? '{}').trim()) as {
        coTuLieu?: boolean;
        cauTraLoi?: string;
        trichDan?: QACitation[];
      };

      // Strictly verify cited maBanGhi against actual records to prevent hallucinated citations
      const recordMap = new Map(records.map((r) => [r.maBanGhi, r]));
      const verifiedCitations: QACitation[] = [];
      for (const cite of parsed.trichDan ?? []) {
        const actual = recordMap.get(cite.maBanGhi);
        if (actual) {
          verifiedCitations.push({
            maBanGhi: actual.maBanGhi,
            nhanDe: actual.dublinCore.title || cite.nhanDe || '(Chưa có nhan đề)',
            noiLuuGiuHienNay:
              actual.boSung.noiLuuGiuHienNay || 'Chưa cập nhật nơi lưu giữ',
            loaiBanDangHienThi:
              actual.boSung.loaiBanDangHienThi || 'Chưa cập nhật loại bản',
          });
        }
      }

      const coTuLieu = Boolean(parsed.coTuLieu) && verifiedCitations.length > 0;
      res.json({
        coTuLieu,
        cauTraLoi: coTuLieu
          ? parsed.cauTraLoi || 'Đã tìm thấy tư liệu liên quan.'
          : parsed.cauTraLoi && !parsed.coTuLieu
            ? parsed.cauTraLoi
            : 'Chưa có tư liệu phù hợp trong dữ liệu hiện tại để trả lời câu hỏi này.',
        trichDan: verifiedCitations,
      });
    } catch (error) {
      console.error('Gemini QA error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể xử lý câu hỏi với Gemini lúc này.';
      res.status(500).json({ error: message });
    }
  });

  // API: Suggest Han-Nom transcription from document image (NEVER auto-saves)
  app.post('/api/gemini/transcribe', async (req, res) => {
    try {
      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'Chức năng đề xuất phiên âm tự động hiện chưa được kích hoạt. Vui lòng thử lại sau.',
        });
        return;
      }

      const { imagePath, imageBase64, mimeType, maBanGhi, nhanDe } = req.body ?? {};
      let base64Data = '';
      let resolvedMime = String(mimeType || 'image/jpeg');

      if (typeof imageBase64 === 'string' && imageBase64.trim()) {
        base64Data = imageBase64.replace(/^data:[^;]+;base64,/, '').trim();
      } else if (typeof imagePath === 'string' && imagePath.trim()) {
        let decodedPath = imagePath.trim();
        try {
          decodedPath = decodeURIComponent(decodedPath);
        } catch {
          // keep original if not valid URI encoding
        }
        const cleaned = decodedPath.replace(/^\/+/, '');
        const resolvedPath = path.resolve(ROOT_DIR, cleaned);
        // Prevent path traversal outside workspace anh_tulieu directory
        if (!resolvedPath.startsWith(ANH_TULIEU_DIR + path.sep)) {
          res.status(400).json({
            error: 'Đường dẫn ảnh tư liệu không hợp lệ.',
          });
          return;
        }
        if (!fs.existsSync(resolvedPath)) {
          res.status(404).json({
            error: 'Không tìm thấy tệp ảnh tư liệu được yêu cầu.',
          });
          return;
        }
        const buf = fs.readFileSync(resolvedPath);
        base64Data = buf.toString('base64');
        resolvedMime = inferMimeType(resolvedPath);
      } else {
        res.status(400).json({
          error: 'Chưa có ảnh văn bản Hán Nôm để đề xuất phiên âm.',
        });
        return;
      }

      const contextHint = [
        maBanGhi ? `Mã bản ghi: ${maBanGhi}` : '',
        nhanDe ? `Nhan đề: ${nhanDe}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: resolvedMime,
                data: base64Data,
              },
            },
            {
              text:
                `Hãy quan sát ảnh tư liệu Hán Nôm này (${contextHint || 'chưa có mô tả'}) và đề xuất bản phiên âm sơ bộ.\n` +
                'Yêu cầu bắt buộc:\n' +
                '- Chỉ đọc những chữ nhìn thấy rõ trên ảnh; chỗ mờ, rách hoặc không chắc chắn phải ghi rõ [?] hoặc [mờ, không rõ], tuyệt đối không tự suy đoán bổ sung.\n' +
                '- Trình bày gồm: (1) Nguyên văn chữ Hán/Nôm nhận diện theo dòng, (2) Phiên âm Hán-Việt đề xuất, (3) Ghi chú các chữ còn nghi ngờ để người kiểm duyệt đối chiếu.',
            },
          ],
        },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.MEDIUM },
          systemInstruction:
            'Bạn là công cụ hỗ trợ đọc nhận diện chữ Hán Nôm cho nhà nghiên cứu lưu trữ. ' +
            'Mọi kết quả chỉ là đề xuất sơ bộ CHƯA KIỂM CHỨNG. Không được bịa chữ ở vùng mờ hoặc bị mất.',
        },
      });

      res.json({
        phienAmDeXuat: response.text?.trim() || 'Không nhận diện được văn bản từ ảnh.',
        mucKiemChung: 'Chưa kiểm chứng',
        tuDongLuu: false,
        luuY: 'Đây là bản đề xuất tham khảo (chưa kiểm chứng). Người nghiên cứu cần đối chiếu bản gốc và tự chỉnh sửa; kết quả này không tự động lưu vào hồ sơ.',
      });
    } catch (error) {
      console.error('Gemini transcribe error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đề xuất phiên âm từ ảnh lúc này.';
      res.status(500).json({ error: message });
    }
  });

  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(ROOT_DIR, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
