VALIDATE-PIX-IMAGE
VALIDATE-PIX-IMAGE é uma API desenvolvida para validar se imagens submetidas são comprovantes de transações via Pix, com base nos padrões visuais e textuais utilizados pelos comprovantes de instituições financeiras brasileiras, especialmente o Banco do Brasil.

🧾 Descrição
Esta API utiliza técnicas de visão computacional e processamento de imagem para analisar conteúdos visuais de arquivos de imagem (JPG, PNG etc.) e verificar se contêm elementos típicos de um comprovante de pagamento Pix, como:

QR Code Pix

Dados do destinatário (nome, CPF/CNPJ)

Valor da transação

Data e hora

Identificação do banco emissor (ex: Banco do Brasil)

Texto-chave como "Pix", "Comprovante", "Transferência", entre outros

🚀 Funcionalidades
✅ Upload de imagem e retorno de validação (true/false)

🔎 Extração de dados textuais com OCR

🧠 Validação baseada em padrões de layout e conteúdo do Banco do Brasil

📊 Log detalhado do motivo da validação positiva ou negativa
