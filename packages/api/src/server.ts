import { formatDate } from '@monorepo/utils';

const server = Bun.serve({
  port: 3001,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === '/api/date') {
      return new Response(JSON.stringify({
        date: formatDate(new Date()),
        timestamp: Date.now()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('API Server');
  }
});

console.log(`APIサーバーが起動しました: http://localhost:${server.port}`);