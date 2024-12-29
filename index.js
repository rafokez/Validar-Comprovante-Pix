const multer = require("multer");
const Tesseract = require("tesseract.js");
const express = require("express");
const path = require("path");
const app = express();

// Configuração para uploads de arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do caminho estático para o arquivo WASM
const wasmPath = "/tesseract-core-simd.wasm";

// Servir o arquivo .wasm como recurso estático
app.use("/tesseract-core-simd.wasm", express.static(path.join(__dirname, "tesseract-core-simd.wasm")));

// Rota de validação de imagens
app.post("/api/validate", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Nenhum arquivo enviado." });
    }

    console.log("Processando a imagem...");

    // Configurando o worker do Tesseract.js
    const worker = Tesseract.createWorker({
      corePath: wasmPath, // Caminho para o arquivo WASM
    });

    // Inicializando o worker
    await worker.load();
    await worker.loadLanguage("por");
    await worker.initialize("por");

    // Reconhecendo o texto da imagem
    const { data: { text } } = await worker.recognize(req.file.buffer);

    console.log("Texto detectado pela OCR:", text);

    // Padrões universais para validar comprovantes PIX
    const universalPatterns = [
      /pix enviado|transferência pix|comprovante pix/i, // Palavra-chave principal
      /\bdata\b.*\bpagamento\b/i, // Data do pagamento
      /\bhorário\b/i, // Horário
      /id.*\btransação\b/i, // ID da transação
      /r\$\s*\d+[.,]?\d*/, // Valor monetário (ex.: R$ 100,00)
    ];

    // Verifica se pelo menos 3 padrões estão presentes
    const matchCount = universalPatterns.filter((pattern) => pattern.test(text)).length;

    const isValid = matchCount >= 3;

    if (isValid) {
      console.log("Imagem validada como comprovante PIX.");
    } else {
      console.log("Imagem inválida. Não possui características de um comprovante PIX.");
    }

    // Finalizando o worker
    await worker.terminate();

    return res.status(200).json({ success: true, isValid });
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    return res.status(500).json({ success: false, message: "Erro interno do servidor." });
  }
});

// Exporta a aplicação para o Vercel
module.exports = app;
