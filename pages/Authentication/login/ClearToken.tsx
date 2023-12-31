import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useClearToken = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Si no hay un token, no hace falta redirigir o eliminar
            return;
        }

        // Agrega la lógica para eliminar el token y userData cuando el componente se desmonta
        return () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            console.log('Token y userData eliminados');
        };
    }, []);

    // Este hook no devuelve ningún valor, pero puedes agregar lógica adicional según tus necesidades
};

export default useClearToken;
