import React from 'react';

const RegistroFinalizado = () => {
    return (
        <div className="relative flex items-center border p-3.5 rounded text-success bg-success-light border-success ltr:border-l-[64px] rtl:border-r-[64px] dark:bg-success-dark-light">
            <span className="absolute ltr:-left-11 rtl:-right-11 inset-y-0 text-white w-6 h-6 m-auto">
                <svg>...</svg>
            </span>
            <span className="ltr:pr-2 rtl:pl-2">
                <strong className="ltr:mr-1 rtl:ml-1">¡Registro exitoso!</strong> En pocos minutos, tu proceso de validación estará finalizado.
            </span>
            <button type="button" className="ltr:ml-auto rtl:mr-auto hover:opacity-80">
                <svg>...</svg>
            </button>
        </div>
    );
};

export default RegistroFinalizado;
