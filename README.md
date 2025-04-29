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
```

---

## 🧪 Exemplo de Resposta

```json
{
  "isValid": true,
  "detectedText": [
    "Banco do Brasil",
    "Comprovante de transferência",
    "Pix",
    "R$ 150,00",
    "CPF 123.456.789-00"
  ]
}
```

---

## 🛠️ Como Rodar o Projeto

### 1. Instale as dependências

```bash
npm install
```

### 2. Execute o servidor local

```bash
node index.js
```

### 3. Faça uma requisição POST para `/validate` com a imagem:

```bash
curl -X POST http://localhost:3000/validate \
  -F "image=@/caminho/para/imagem.png"
```

---

## 🧩 Melhorias Futuras

- [ ] Suporte a outros bancos (Itaú, Nubank, Bradesco...)
- [ ] Classificação por IA para detectar falsificações
- [ ] Interface Web com upload e visualização
- [ ] Testes automatizados

---

## 🤝 Contribuições

Contribuições são muito bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um PR. 🚀

---

## 📄 Licença

Distribuído sob licença **MIT**. Veja [LICENSE](LICENSE) para mais detalhes.

---
