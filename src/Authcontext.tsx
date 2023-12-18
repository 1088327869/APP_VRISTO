import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextProps {
    authenticated: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // Verificar si hay datos de usuario en localStorage al cargar la página
        const userDataString = localStorage.getItem('userData');
        const hasUserData = !!userDataString;

        if (hasUserData) {
            setAuthenticated(true);
        }
    }, []);

    const login = () => {
        // Lógica de inicio de sesión (aquí deberías realizar la autenticación real)
        // Por ahora, simplemente establecemos el estado de autenticación como verdadero
        setAuthenticated(true);

        // Guardar datos de usuario en localStorage
        localStorage.setItem('userData', 'someUserData');
    };

    const logout = () => {
        // Lógica de cierre de sesión
        // Por ahora, simplemente establecemos el estado de autenticación como falso
        setAuthenticated(false);

        // Eliminar datos de usuario de localStorage
        localStorage.removeItem('userData');
    };

    return <AuthContext.Provider value={{ authenticated, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }

    return context;
};
