const multer = require("multer");
const Tesseract = require("tesseract.js");
const express = require("express");
const path = require("path");
const app = express();
const corePath = path.join(__dirname, "public", "tesseract-core-simd.wasm");
const port = process.env.PORT || 3000;

// Configuração para uploads de arquivos em memória
const upload = multer({ storage: multer.memoryStorage() });

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Função genérica para validação
async function validateDocument(req, res, patterns) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo enviado. Por favor, envie uma imagem válida.",
      });
    }

    console.log("Processando a imagem...");

    // Extração de texto com Tesseract.js
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, "por", {
      corePath: corePath,
    });

    console.log("Texto extraído:", text);

    // Validação baseada nos padrões
    const matchedPatterns = patterns.filter((pattern) => pattern.test(text));
    const isValid = matchedPatterns.length >= 3;

    console.log(isValid ? "Documento validado com sucesso." : "Falha na validação do documento.");

    return res.status(200).json({
      success: true,
      isValid,
      patternsMatched: matchedPatterns.length,
      extractedText: text,
    });
  } catch (error) {
    console.error("Erro ao processar a imagem:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno no processamento da imagem.",
      error: error.message,
    });
  }
}

// Rota para validar CTF IBAMA
app.post("/api/validate/ctf-ibama", upload.single("file"), (req, res) => {
  const IBAMA_PATTERNS = [
    /registro n\.?/i,
    /data da consulta/i,
    /razão social/i,
    /cnpj/i,
  ];
  return validateDocument(req, res, IBAMA_PATTERNS);
});

// Rota para validar Alvará de Funcionamento
app.post("/api/validate/alvara", upload.single("file"), (req, res) => {
  const ALVARA_PATTERNS = [
    /nº alvará/i,
    /inscrição municipal/i,
    /cnpj/i,
    /válido até/i,
  ];
  return validateDocument(req, res, ALVARA_PATTERNS);
});

// Rota para validar Licença de Operação
app.post("/api/validate/licenca-operacao", upload.single("file"), (req, res) => {
  const LICENCA_PATTERNS = [
    /licença de operação/i,
    /cnpj/i,
    /atividade principal/i,
    /validade até/i,
  ];
  return validateDocument(req, res, LICENCA_PATTERNS);
});

// Rota para validar AVCB Bombeiro
app.post("/api/validate/avcb-bombeiro", upload.single("file"), (req, res) => {
  const AVCB_PATTERNS = [
    /avcb nº/i,
    /endereço/i,
    /proprietário/i,
    /área aprovada/i,
  ];
  return validateDocument(req, res, AVCB_PATTERNS);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
