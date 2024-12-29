const multer = require("multer");
const Tesseract = require("tesseract.js");
const express = require("express");
const path = require("path");
const app = express();

// Configuração para uploads de arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// Configuração do caminho estático para o arquivo WASM
const TESSERACT_WASM_PATH = path.join(__dirname, "tesseract-core-simd.wasm");

// Servir o arquivo .wasm como recurso estático
app.use("/tesseract-core-simd.wasm", express.static(TESSERACT_WASM_PATH));

// Rota de validação de imagens
app.post("/api/validate", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo enviado. Por favor, envie uma imagem válida.",
      });
    }

    console.log("Processando a imagem...");

    // Configuração personalizada para o Tesseract.js
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, "por", {
      corePath: "/tesseract-core-simd.wasm", // Caminho público para o arquivo .wasm
    });

    console.log("Texto extraído:", text);

    // Padrões universais para validar comprovantes PIX
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
