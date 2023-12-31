import { createProxyMiddleware } from 'http-proxy-middleware';

const setupProxy = (app: { use: (arg0: string, arg1: any) => void }) => {
    app.use(
        '/formulario',
        createProxyMiddleware({
            target: 'https://servir.goldraea.com/', // Cambia la URL al servidor de tu API
            changeOrigin: true,
        })
    );
};

export default setupProxy;
