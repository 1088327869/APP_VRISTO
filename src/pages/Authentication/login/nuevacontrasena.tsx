import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IRootState } from '../../../store';
import { setPageTitle, toggleRTL } from '../../../store/themeConfigSlice';
import Dropdown from '../../../components/Dropdown';
import i18next from 'i18next';
import getApiUrl from '../../../../config';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconLockDots from '../../../components/Icon/IconLockDots';
import IconInstagram from '../../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconGoogle from '../../../components/Icon/IconGoogle';
import IconPencil from '../../../components/Icon/IconPencil';
import Swal from 'sweetalert2';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';

const apiURL = getApiUrl();

const NuevaContrasena = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const [flag, setFlag] = useState(themeConfig.locale);
    const [formData, setFormData] = useState({
        codigo: '',
        confirmarContraseña: '',
    });

    useEffect(() => {
        dispatch(setPageTitle('Login'));
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // inicio de loading
            setLoading(true);
            // traer datos de local storeg
            const documentoGuardado = localStorage.getItem('documento');
            // consultar y validar el codigo
            const response = await axios.post(`${apiURL}/api/consultar/programar`, {
                userDocumento: documentoGuardado,
                envioCodigo: parseInt(formData.codigo, 10),
            });

            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                console.log('codigo correctos:', data);

                Swal.fire({
                    title: 'Código exitoso',
                    text: 'Nueva clave registrada',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545',
                    timer: 8000,
                });

                try {
                    // Segunda solicitud para cambiar la contraseña
                    const hablame = await axios.post(`${apiURL}/api/nueva/password`, {
                        userDocumento: documentoGuardado,
                        password: formData.confirmarContraseña,
                    });

                    // Manejar la respuesta de la segunda solicitud
                    if (hablame.status >= 200 && hablame.status < 300) {
                        // Elimina el elemento con clave 'documento' del localStorage
                        localStorage.removeItem('documento');

                        console.log('seguna solicitud', hablame);

                        setLoading(false);
                        navigate('/auth/boxed-signin');
                    } else {
                        console.error('Error al cambiar la contraseña:', hablame.data);
                        // Tratar el caso en que la respuesta no sea 200-299
                    }
                } catch (error) {
                    console.error('Error en la segunda solicitud:', error);
                    // Manejar errores de la segunda solicitud
                }
            } else {
                console.error('Error en el inicio de sesión:', response.data);
                // Tratar el caso en que la respuesta no sea 200-299
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);

            Swal.fire({
                title: 'Codigo incorrecto',
                text: 'Por favor, verifique el codigo e inténtelo de nuevo',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545',
                timer: 7000,
            });
        } finally {
            setLoading(false);
        }
    };

    const setLocale = (flag: string) => {
        setFlag(flag);
        dispatch(toggleRTL(flag.toLowerCase() === 'ae' ? 'rtl' : 'ltr'));
    };
    return (
        <div>
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
                {/* ... (Resto de tu componente) ... */}
            </div>
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
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/assets/images/clients/logo_report.png" // Reemplaza con la ruta correcta de tu logo
                                    alt="Logo"
                                    className="w-50 h-20 object-contain" // Ajusta el tamaño según tus necesidades
                                />
                            </div>

                            <div className="mb-7">
                                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Nueva contraseña</h1>
                                <p>Ingresa el código que te hemos enviado y confirma cuál es tu nueva contraseña.</p>
                            </div>

                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="codigo">codigo</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="codigo"
                                            name="codigo"
                                            type="tel"
                                            placeholder="Ingresa tu documento"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            value={formData.codigo}
                                            pattern="[0-9]*" // Solo permite dígitos
                                            minLength={6}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPencil fill={true} />
                                        </span>{' '}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="nuevaContraseña">Nueva contraseña</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="nuevaContraseña"
                                            name="nuevaContraseña"
                                            type="password"
                                            placeholder="Ingresa tu nueva contraseña"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            // pattern="[0-9]*"
                                            minLength={4}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>{' '}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="confirmarContraseña">Confirmar nueva contraseña</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="confirmarContraseña"
                                            name="confirmarContraseña"
                                            type="confirmarContraseña"
                                            placeholder="Confirma la nueva contraseña"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            value={formData.confirmarContraseña}
                                            minLength={4}
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                {/* <div>
                                    <label htmlFor="confirmarContraseña">Confirmar nueva contraseña</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="confirmarContraseña"
                                            name="confirmarContraseña"
                                            type="password"
                                            placeholder="Confirmar la nueva contraseña"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            // value={formData.confirmarContraseña}
                                            pattern="[0-9]*"
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div> */}

                                <p>Proceso de recuperacion de contraseña</p>
                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    recuperar
                                </button>
                            </form>
                            <div className="relative my-7 text-center md:mb-9">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            <div className="mb-10 md:mb-[60px]">
                                <ul className="flex justify-center gap-3.5 text-white">
                                    <li>
                                        <Link
                                            to="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{
                                                background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                color: '#FFFFFF', // Texto blanco
                                                transition: 'background 0.3s ease',
                                                ...(isHovered && {
                                                    background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                }),
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <IconInstagram />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{
                                                background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                color: '#FFFFFF', // Texto blanco
                                                transition: 'background 0.3s ease',
                                                ...(isHovered && {
                                                    background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                }),
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <IconFacebookCircle />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{
                                                background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                color: '#FFFFFF', // Texto blanco
                                                transition: 'background 0.3s ease',
                                                ...(isHovered && {
                                                    background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                }),
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <IconTwitter fill={true} />
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="#"
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full p-0 transition hover:scale-110"
                                            style={{
                                                background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                color: '#FFFFFF', // Texto blanco
                                                transition: 'background 0.3s ease',
                                                ...(isHovered && {
                                                    background: 'linear-gradient(90deg, #D62800, #D6593C)',
                                                }),
                                            }}
                                            onMouseEnter={() => setIsHovered(true)}
                                            onMouseLeave={() => setIsHovered(false)}
                                        >
                                            <IconGoogle />
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center dark:text-white">
                                ¿No tienes una cuenta?&nbsp;
                                <Link to="/auth/register" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    Registrarme
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NuevaContrasena;
