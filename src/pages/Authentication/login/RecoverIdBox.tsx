import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import { useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../../store/themeConfigSlice';

import IconUser from '../../../components/Icon/IconUser';
import IconPhone from '../../../components/Icon/IconPhone';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css'; //  css de login
import axios from 'axios';
import getApiUrl from '../../../../config';
import Swal from 'sweetalert2';

const RecuperarContrasena = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const apiURL = getApiUrl();
    useEffect(() => {
        dispatch(setPageTitle('Recuperar'));
    });

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [documento, setDocumento] = useState('');
    const [telefono, setTelefono] = useState('');

    // generar alerta exitosa
    const showAlert = async (type: number) => {
        if (type === 15) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'success',
                title: 'Desembolso en proceso',
                padding: '10px 20px',
            });
        }
    };

    // generar alerta error
    const showAlerterror = async (type: number) => {
        if (type === 15) {
            const toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
            });
            toast.fire({
                icon: 'error',
                title: 'Ingresa un codigo valido',
                padding: '10px 20px',
            });
        }
    };

    const submitForm = async () => {
        // Marcamos el inicio del área de loading
        setLoading(true);

        try {
            // Realiza la solicitud a la API
            const codigoResponse = await axios.post(`${apiURL}/api/codigo/recuperar`, {
                userDocumento: documento,
                celular: telefono,
            });

            console.log('codigo generado', codigoResponse);

            // Verifica el código de respuesta
            if (codigoResponse.status === 200) {
                // La respuesta es exitosa, puedes realizar acciones adicionales si es necesario
                console.log('Respuesta exitosa');
                navigate('/msm');
                return;
                // navigate('/'); // Descomenta esto si deseas navegar a otra página
            } else if (codigoResponse.status === 404) {
                // La respuesta es 404, maneja la configuración del estado y muestra la alerta
                console.log('Respuesta 404');
                return;
                // setCodigoError(' ');
                // showAlerterror(15);
            } else {
                // Otro código de respuesta, maneja según tus necesidades
                console.log('Código de respuesta desconocido:', codigoResponse.status);
            }
        } catch (error) {
            // Maneja el error, muestra un mensaje o realiza acciones necesarias
            console.error('Error al obtener datos de la API:', error);
        } finally {
            // Este bloque se ejecutará independientemente de si hubo un error o no
            setLoading(false); // Actualiza el estado de carga en tu componente
            console.log('Bloque finally ejecutado');
            navigate('/login/password');
            return;
        }
    };

    return (
        <div>
            {loading && (
                // Área de loading
                <div className="loading-overlay">
                    <div className="loading-content">
                        <GridLoader size={20} color="#C15E56" />
                        <p>Cargado...</p>
                    </div>
                </div>
            )}
            <div>
                <div className="absolute inset-0">
                    <img src="/assets/images/auth/bg-gradient.png" alt="image" className="h-full w-full object-cover" />
                </div>

                <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/map.png)] bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                    <img src="/assets/images/auth/coming-soon-object1.png" alt="image" className="absolute left-0 top-1/2 h-full max-h-[893px] -translate-y-1/2" />
                    <img src="/assets/images/auth/coming-soon-object2.png" alt="image" className="absolute left-24 top-0 h-40 md:left-[30%]" />
                    <img src="/assets/images/auth/coming-soon-object3.png" alt="image" className="absolute right-0 top-0 h-[300px]" />
                    <img src="/assets/images/auth/polygon-object.svg" alt="image" className="absolute bottom-0 end-[28%]" />
                    <div className="relative w-full max-w-[870px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] p-2 dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                        <div className="relative flex flex-col justify-center rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                            <div className="absolute top-6 end-6">
                                <div className="dropdown"></div>
                            </div>
                            <div className="mx-auto w-full max-w-[440px]">
                                <div className="mb-7">
                                    <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Restablecimiento de contraseña</h1>
                                    <p>Introduce tu correo electrónico para recuperar tu cuenta</p>
                                </div>
                                <form className="space-y-5" onSubmit={submitForm}>
                                    <div>
                                        <label htmlFor="Documento" className="dark:text-white">
                                            Coloque su documento
                                        </label>
                                        <div className="relative text-white-dark">
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                            <input
                                                id="Documento"
                                                value={documento}
                                                type="text"
                                                placeholder="Enter Documento"
                                                className="form-input ps-16 placeholder:text-white-dark"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                onChange={(e) => setDocumento(e.target.value)} // Agrega un controlador onChange para actualizar el estado
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="Telefono" className="dark:text-white">
                                            Coloque su teléfono
                                        </label>
                                        <div className="relative text-white-dark">
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconPhone fill={true} />
                                            </span>
                                            <input
                                                id="Telefono"
                                                type="tel"
                                                value={telefono}
                                                placeholder="Enter Teléfono"
                                                className="form-input ps-16 placeholder:text-white-dark"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                onChange={(e) => setTelefono(e.target.value)} // Agrega un controlador onChange para actualizar el estado
                                            />
                                        </div>
                                    </div>
                                    <p>Proceso de recuperacion de contraseña</p>
                                    <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                        RECUPERAR
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RecuperarContrasena;
function setCodigoError(arg0: string) {
    throw new Error('Function not implemented.');
}
