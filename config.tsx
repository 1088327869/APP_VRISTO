const isProduction = process.env.NODE_ENV === 'production';

const getApiUrl = () => {
    return isProduction ? 'https://server.solucredito.com.co' : 'http://localhost:3000';
};

export default getApiUrl;

// Nueva constante para la API específica de payvalida
export const PAYVALIDA_API = isProduction ? 'https://pago.solucredito.com.co' : 'http://localhost:3050';
