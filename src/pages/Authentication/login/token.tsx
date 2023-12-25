// token.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useToken = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        const allowedUrls = ['/auth/boxed-signin', '/auth/register', '/msm', '/login/password', '/new/password'];

        // Check if the current URL is in the allowed list
        const isAllowedUrl = allowedUrls.some((allowedUrl) => window.location.pathname === allowedUrl);

        // If there is no token and the current URL is not allowed, redirect to the login page
        if (!token && !isAllowedUrl) {
            console.error('Usuario no autenticado.');
            navigate('/auth/boxed-signin');
        }
    }, [token, navigate]);

    return token;
};

export default useToken;
