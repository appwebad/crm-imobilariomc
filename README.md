# CRM Imobiliário com IA - Agnaldo Imóveis

Sistema web responsivo para imobiliária, com dashboard, cadastro de imóveis, clientes, leads, CRM, agenda, relatórios, IA simulada e Google Maps local de Maceió/Farol.

## Rodar local
```bash
npm install
npm run dev
```

## Subir no GitHub Pages
```bash
npm run build
```
Depois publique a pasta `dist`.

## Android
Este projeto é PWA/responsivo. Pode ser aberto no navegador do Android e instalado como app. Para APK, use Capacitor depois:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npm run build
npx cap add android
npx cap sync android
```

## Integração real com IA
Substitua as funções simuladas em `src/App.jsx` por chamadas para seu backend usando OpenAI/Gemini. Nunca exponha chave de API no frontend.
