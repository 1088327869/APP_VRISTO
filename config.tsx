const isProduction = process.env.NODE_ENV === 'production';

const getApiUrl = () => {
    return isProduction ? 'https://servir.goldraea.com' : 'http://localhost:3000';
};

export default getApiUrl;
