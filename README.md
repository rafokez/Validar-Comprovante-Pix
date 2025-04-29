# 🔍 VALIDATE-PIX-IMAGE — API de Validação de Comprovantes Pix

**VALIDATE-PIX-IMAGE** é uma API desenvolvida em Node.js que identifica se uma **imagem enviada é um comprovante Pix legítimo**, com foco inicial nos comprovantes emitidos pelo **Banco do Brasil**.

Ela utiliza OCR com **Tesseract.js** e análise textual para detectar elementos típicos como banco emissor, nome, valor, CPF/CNPJ, QR Code e expressões-chave.

---

## ⚙️ Tecnologias Utilizadas

- 🟨 Node.js
- 🧠 Tesseract.js (OCR via JavaScript)
- 🧾 Arquivos `.traineddata` locais (Português e Inglês)
- 🖼️ Processamento de imagem
- 📡 Express (ou servidor HTTP equivalente)

---

## 🚀 Funcionalidades Disponíveis

- ✅ Validação automática de comprovantes Pix por imagem
- 🔎 Extração de texto com OCR (suporte a `por.traineddata` e `eng.traineddata`)
- 🧠 Análise de padrões visuais e textuais
- 🛡️ Resposta com veredicto (`true/false`) e justificativas

---

## 📂 Estrutura do Projeto

```bash
/
├── index.js                  # Ponto de entrada da API
├── package.json              # Configurações e scripts NPM
├── eng.traineddata           # Dados OCR para inglês
├── por.traineddata           # Dados OCR para português
├── public/                   # (opcional) assets públicos
└── README.md                 # Você está aqui!
