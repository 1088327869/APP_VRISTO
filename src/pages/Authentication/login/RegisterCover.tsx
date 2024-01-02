import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../../store/themeConfigSlice';
import Dropdown from '../../../components/Dropdown';
import { IRootState } from '../../../store';
import i18next from 'i18next';
import IconCaretDown from '../../../components/Icon/IconCaretDown';
import IconUser from '../../../components/Icon/IconUser';
import IconMail from '../../../components/Icon/IconMail';
import IconLockDots from '../../../components/Icon/IconLockDots';
import IconInstagram from '../../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../../components/Icon/IconTwitter';
import IconPhoneCall from '../../../components/Icon/IconPhoneCall';
import IconGoogle from '../../../components/Icon/IconGoogle';
import IconPencil from '../../../components/Icon/IconPencil';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';
import axios from 'axios';
import getApiUrl from '../../../../config';
import Swal from 'sweetalert2';

const RegisterCover = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const [isHovered, setIsHovered] = useState(false);
    const apiURL = getApiUrl();

    const setLocale = (flag: string) => {
        setFlag(flag);

        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        tipo: '', // Aquí está la propiedad 'tipo'
        documento: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Estado del loading
    const [loading, setLoading] = useState(false);

    // subir formulario
    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();

            // Marcamos el inicio del área de loading
            setLoading(true);

            const response = await axios.post(`${apiURL}/api/codigo/msm`, {
                documento: formData.documento,
                telefono: formData.telefono,
            });

            // Guardar en localStorage
            localStorage.setItem('formData', JSON.stringify(formData));

            // Redirigir a la URL /msm
            navigate('/msm');
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            // Manejar el error según tus necesidades, por ejemplo, mostrar un mensaje al usuario
        } finally {
            // Desactivamos el área de loading independientemente de si la solicitud tuvo éxito o falló
            setLoading(false);
        }
    };

    useEffect(() => {
        // Marcamos el final del área de loading después de que se renderiza el componente
        setLoading(false);
        dispatch(setPageTitle('SOLUCREDITO'));
    }, [dispatch]);

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
                <div className="relative flex w-full max-w-[1502px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative hidden w-full items-center justify-center bg-[linear-gradient(225deg,rgba(239,18,98,1)_0%,rgba(67,97,238,1)_100%)] p-5 lg:inline-flex lg:max-w-[835px] xl:-ms-28 ltr:xl:skew-x-[14deg] rtl:xl:skew-x-[-14deg]">
                        <div className="absolute inset-y-0 w-8 from-primary/10 via-transparent to-transparent ltr:-right-10 ltr:bg-gradient-to-r rtl:-left-10 rtl:bg-gradient-to-l xl:w-16 ltr:xl:-right-20 rtl:xl:-left-20"></div>
                        <div className="ltr:xl:-skew-x-[14deg] rtl:xl:skew-x-[14deg]">
                            <Link to="/" className="w-48 block lg:w-72 ms-10">
                                {/* <img src="/assets/images/auth/logo_report.png" alt="Logo" className="w-full" /> */}
                            </Link>
                            <div className="mt-24 hidden w-full max-w-[430px] lg:block">
                                <img src="/assets/images/auth/register.svg" alt="Cover Image" className="w-full" />
                            </div>
                        </div>
                    </div>
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className="flex w-full max-w-[440px] items-center gap-2 lg:absolute lg:end-6 lg:top-6 lg:max-w-full">
                            <Link to="/" className="w-8 block lg:hidden">
                                <img src="/assets/images/clients/logo.png" alt="Logo" className="mx-auto w-10" />
                            </Link>
                            <div className="dropdown ms-auto w-max"></div>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-16">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-primary md:text-4xl">Inscribirse</h1>
                                <p className="text-base font-bold leading-normal text-white-dark">Ingresa tus datos para obtener tu crédito.</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="FirstName">Nombre</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="FirstName"
                                            name="nombre"
                                            type="text"
                                            placeholder="Ingresa tu nombre"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            required
                                            // title="Por favor, ingrese su nombre"
                                        />

                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="LastName">Apellido</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="LastName"
                                            name="apellido"
                                            type="text"
                                            placeholder="Ingresa tus apellidos"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconUser fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="PhoneNumber">Teléfono</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="PhoneNumber"
                                            name="telefono"
                                            type="tel"
                                            placeholder="Ingresa tu teléfono"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            pattern="[0-9]*" // Solo permite dígitos.
                                            minLength={10}
                                            maxLength={10}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconPhoneCall fill={true} />
                                        </span>{' '}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Email">Correo Electrónico</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            name="email"
                                            type="email"
                                            placeholder="Ingresa tu correo electrónico"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                </div>
                                <select
                                    id="tipo"
                                    name="tipo"
                                    className="form-select text-white-dark"
                                    onChange={handleChange}
                                    required
                                    value={formData.tipo} // Corregir aquí
                                >
                                    <option value="" disabled>
                                        Selecciona un tipo de documento
                                    </option>
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="PT">Pasaporte</option>
                                    <option value="NIT">NIT</option>
                                </select>

                                <div>
                                    <label htmlFor="documento">Documento</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="documento"
                                            name="documento"
                                            type="tel"
                                            placeholder="Ingresa tu documento"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
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
                                    <label htmlFor="Password">Contraseña</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            name="password"
                                            type="password"
                                            placeholder="Ingresa tu contraseña"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            onChange={handleChange}
                                            // minLength="4" // Mínimo 4 caracteres
                                            pattern=".{4,}" // Al menos 4 caracteres
                                            required
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {formData.password.length < 4 && <p className="text-red-500 text-xs mt-1">La contraseña debe tener al menos 4 caracteres.</p>}
                                </div>

                                <div>
                                    <label className="flex cursor-pointer items-center">
                                        <input type="checkbox" className="form-checkbox bg-white dark:bg-black" name="aceptaTerminos" onChange={handleChange} />
                                        <span className="text-white-dark">Acepto los términos y condiciones</span>
                                    </label>
                                    {/* <p className="text-red-500 text-xs mt-1">Debe aceptar los términos y condiciones para continuar.</p> */}
                                </div>

                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Inscribirse
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
                                Ya tienes una cuenta ?&nbsp;
                                <Link to="/auth/boxed-signin" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                    INICIAR SESIÓN
                                </Link>
                            </div>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}. SOLUCREDITO</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCover;
