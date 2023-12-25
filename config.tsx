const isProduction = process.env.NODE_ENV === 'production';

const getApiUrl = () => {
    return isProduction ? 'https://server.solucredito.com.co' : 'http://localhost:3000';
};

export default getApiUrl;
