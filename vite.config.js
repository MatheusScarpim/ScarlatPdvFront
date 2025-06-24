import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // Defina a porta que você deseja
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Redirecionar para o backend (Spring Boot)
        changeOrigin: true,
        secure: false,
      },
      '/payment-service': {
        target: 'http://localhost:4000', // Redirecionar para o serviço de pagamento
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/payment-service/, ''),
      },
    },
    allowedHosts:true, // Permitir que todos os hosts acessem o servidor
  },
  build: {
    outDir: 'dist', // Pasta de saída para a build final
    sourcemap: true, // Habilita map de fonte para depuração
    chunkSizeWarningLimit: 1000, // Limite do tamanho do chunk em KB
  },
  resolve: {
    alias: {
      '@': '/src', // Alias para o diretório src
    },
  },
  optimizeDeps: {
    include: ['axios', 'vue-router'], // Inclua dependências que podem precisar ser otimizadas
  },
  define: {
    'process.env': {}, // Adiciona variáveis de ambiente
  },
});