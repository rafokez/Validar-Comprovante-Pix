const multer = require("multer");
const { createWorker } = require("tesseract.js"); // API correta
const express = require("express");
const path = require("path");
const app = express();

// Configuração para uploads de arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// Configuração para o caminho estático do arquivo WASM
const TESSERACT_WASM_PATH = path.join(__dirname, "tesseract-core-simd.wasm");

// Servir o arquivo .wasm como recurso estático
app.use("/tesseract-core-simd.wasm", express.static(TESSERACT_WASM_PATH));

// Rota para validar a imagem
app.post("/api/validate", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo enviado. Envie uma imagem válida.",
      });
    }

    console.log("Processando a imagem...");

    // Configurando o worker do Tesseract.js
    const worker = createWorker({
      corePath: "/tesseract-core-simd.wasm", // Caminho público para o arquivo .wasm
    });

    // Inicializando o worker
    console.log("Inicializando o Tesseract.js...");
    await worker.load(); // Carregar o worker
    await worker.loadLanguage("por"); // Carregar o idioma português
    await worker.initialize("por"); // Inicializar com o idioma português

    // Reconhecendo o texto da imagem
    console.log("Executando OCR na imagem...");
    const { data: { text } } = await worker.recognize(req.file.buffer); // OCR no buffer da imagem

    console.log("Texto extraído:", text);

    // Padrões comuns de comprovantes PIX
    const PIX_PATTERNS = [
      /pix enviado|transferência pix|comprovante pix/i, // Palavra-chave PIX
      /\bdata\b.*\bpagamento\b/i, // Data do pagamento
      /\bhorário\b/i, // Horário
      /id.*\btransação\b/i, // ID da transação
      /r\$\s*\d+[.,]?\d*/, // Valores monetários (ex.: R$ 100,00)
    ];

    // Verificar se pelo menos 3 padrões são encontrados
    const matchedPatterns = PIX_PATTERNS.filter((pattern) => pattern.test(text));
    const isValid = matchedPatterns.length >= 3;

    console.log(
      isValid
        ? "A imagem foi validada como um comprovante PIX."
        : "A imagem não contém características de um comprovante PIX."
    );

    // Finalizando o worker
    await worker.terminate();

    // Resposta da API
    return res.status(200).json({
      success: true,
      isValid,
      patternsMatched: matchedPatterns.length,
      extractedText: text, // Opcional: Retornar o texto para debug
    });
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno no processamento da imagem.",
      error: error.message, // Opcional: Enviar detalhes do erro para debug
    });
  }
});

// Exporta a aplicação para ser usada no Vercel
module.exports = app;
