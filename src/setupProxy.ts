import { RequestHandler } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';


export const setupProxy: RequestHandler = (app:any) => {
  // Proxy API requests to your API server running on port 3001
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000', // Replace with your API server's URL
      changeOrigin: true,
    })
  );
};
