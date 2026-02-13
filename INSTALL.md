# Install / Merge (Sesión 1 - JS)

## 1) Crear proyecto
```bash
npm create vite@latest agendaflow-pro -- --template react
cd agendaflow-pro
npm install
```

## 2) Instalar deps
```bash
npm install tailwindcss @tailwindcss/vite
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install react-router-dom
npm install @supabase/supabase-js
npm install zod
```

## 3) Copiar overlay
Copia el contenido de esta carpeta **encima** del proyecto (sobrescribe si te pide).

## 4) Crear .env.local
```env
VITE_SUPABASE_URL=https://demo.supabase.co
VITE_SUPABASE_ANON_KEY=abc123
```

## 5) Correr
```bash
npm run dev
```
