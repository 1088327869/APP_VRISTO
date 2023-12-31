import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IRootState } from '../../../store';
import { setPageTitle, toggleRTL } from '../../../store/themeConfigSlice';
import IconLockDots from '../../../components/Icon/IconLockDots';
import getApiUrl from '../../../../config';
import Swal from 'sweetalert2';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';

const apiURL = getApiUrl();

interface FormData {
    nombre: string;
}

const ConfirmarMsm = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Unlock Box'));
    }, [dispatch]);

    // Recuperar el dato del localStorage
    const storedFormDataString = localStorage.getItem('formData');

    // Define el estado del formulario
    const [formData, setFormData] = useState<FormData>({
        nombre: '',
    });

    // Verificar si hay un dato almacenado en localStorage
    useEffect(() => {
        if (storedFormDataString) {
            // Si hay un dato, convertirlo de cadena JSON a objeto
            const parsedFormData = JSON.parse(storedFormDataString);

            // Puedes usar `parsedFormData` como sea necesario en tu componente
            const { nombre, apellido, tipo, documento, telefono, email, password } = parsedFormData;

            // Crear la variable nombre_completo con espacio entre nombre y apellido
            const nombre_completo = `${nombre.toUpperCase()} ${apellido.toUpperCase()}`;

            // Actualiza el estado formData con los datos de la API
            setFormData((prevData) => ({
                ...prevData,
                nombre: nombre_completo,
                // Otras propiedades no se afectan
            }));

            // Resto del código...
        }
    }, [storedFormDataString]);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);

    const setLocale = (flag: string) => {
        // Implementa tu lógica aquí si es necesario
    };
    const [codigoValue, setCodigoValue] = useState('');
    const handleCodigoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Actualiza el estado con el nuevo valor del campo de entrada
        setCodigoValue(e.target.value);
    };

    const submitForm = async (e: React.FormEvent) => {
        e.preventDefault();

        // Marcamos el inicio del área de loading
        setLoading(true);
        // Obtener los datos de localStorage
        const formDataFromLocalStorage = JSON.parse(localStorage.getItem('formData') || '{}');
        // validar codigo
        try {
            // Realiza la solicitud a la API

            const codigoResponse = await axios.post(`${apiURL}/api/consultar/programar`, {
                userDocumento: parseInt(formDataFromLocalStorage.documento),
                envioCodigo: parseInt(codigoValue),
            });
            console.log('codigo generado', codigoResponse);
            // Realiza acciones adicionales después de una respuesta exitosa si es necesario
        } catch (error) {
            // Maneja el error, muestra un mensaje o realiza acciones necesarias
            console.error('Error al obtener datos de la API:', error);

            // Verifica si el error es una respuesta 400 (Bad Request)
            if (axios.isAxiosError(error)) {
                // Muestra el mensaje de intento máximo permitido
                Swal.fire({
                    title: 'Código incorrecto',
                    text: 'Verifica tu código e intenta de nuevo',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545', // Color rojo
                    timer: 15000,
                    customClass: {
                        icon: 'fa fa-phone', // Añade el ícono de teléfono a la clase del ícono
                    },
                });

                // Rompe la ejecución de la función aquí
                return;
            } else {
                // Si el error no es una respuesta 400, maneja de alguna otra manera si es necesario
                // ...
            }
        } finally {
            // Este bloque se ejecutará independientemente de si hubo un error o no
            setLoading(false); // Actualiza el estado de carga en tu componente
        }

        const response = await fetch(`${apiURL}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: formDataFromLocalStorage.nombre,
                apellido: formDataFromLocalStorage.apellido,
                tipo: formDataFromLocalStorage.tipo.toLowerCase(),
                documento: parseInt(formDataFromLocalStorage.documento),
                telefono: parseInt(formDataFromLocalStorage.telefono),
                email: formDataFromLocalStorage.email,
                password: formDataFromLocalStorage.password,
            }),
        });

        if (response.ok) {
            Swal.fire({
                title: 'Registro exitoso',
                text: 'Estás a un paso de obtener tu crédito rotativo.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545', // Color rojo
                timer: 7000,
            });

            console.log('Datos guardados exitosamente');
            // Generar consultar para generar el login
            const response = await axios.post(`${apiURL}/api/login`, {
                cedula_envi: parseInt(formDataFromLocalStorage.documento),
                password_envi: formDataFromLocalStorage.password,
            });

            if (response.status === 200) {
                const data = response.data;
                console.log('Login exitoso:', data);

                if (data.token) {
                    localStorage.setItem('userData', JSON.stringify(formDataFromLocalStorage.documento));
                    localStorage.setItem('token', data.token);

                    // Eliminar datos de localStorage
                    localStorage.removeItem('formData');

                    // Marcamos el final del área de loading
                    setLoading(false);

                    navigate('/forms/wizards');
                }
            }

            // Eliminar datos de localStorage
            // localStorage.removeItem('formData');

            // Marcamos el final del área de loading
            setLoading(false);
            // Redirigir a la nueva URL
            // navigate('/forms/wizards');
        } else {
            console.error('Error al guardar los datos en el servidor');
            Swal.fire({
                title: 'Ya existe un registro',
                text: 'Ya estás registrado. Si olvidaste tu contraseña, puedes recuperarla.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545', // Color rojo
                timer: 8000,
            });
            // Marcamos el final del área de loading
            setLoading(false);
            navigate('/recup/new/password');
        }

        // console.error('Error en la solicitud:', error);
        // Marcamos el final del área de loading
        setLoading(false);
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
                        <div className="absolute top-6 end-6">
                            {/* <div className="dropdown">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                    btnClassName="flex items-center gap-2.5 rounded-lg border border-white-dark/30 bg-white px-2 py-1.5 text-white-dark hover:border-primary hover:text-primary dark:bg-black"
                                    button={
                                        <>
                                            <div>
                                                <img src={`/assets/images/flags/${flag.toUpperCase()}.svg`} alt="image" className="h-5 w-5 rounded-full object-cover" />
                                            </div>
                                            <div className="text-base font-bold uppercase">{flag}</div>
                                            <span className="shrink-0">
                                                <IconCaretDown />
                                            </span>
                                        </>
                                    }
                                >
                                    <ul className="!px-2 text-dark dark:text-white-dark grid grid-cols-2 gap-2 font-semibold dark:text-white-light/90 w-[280px]">
                                        {themeConfig.languageList.map((item: any) => {
                                            return (
                                                <li key={item.code}>
                                                    <button
                                                        type="button"
                                                        className={`flex w-full hover:text-primary rounded-lg ${flag === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                        onClick={() => {
                                                            i18next.changeLanguage(item.code);
                                                            // setFlag(item.code);
                                                            setLocale(item.code);
                                                        }}
                                                    >
                                                        <img src={`/assets/images/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="w-5 h-5 object-cover rounded-full" />
                                                        <span className="ltr:ml-3 rtl:mr-3">{item.name}</span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </Dropdown>
                            </div> */}
                        </div>
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-10 flex items-center">
                                <div className="flex h-16 w-16 items-end justify-center overflow-hidden rounded-full bg-[#00AB55] ltr:mr-4 rtl:ml-4">
                                    <img src="/assets/images/auth/rostro.png" className="w-full object-cover" alt="images" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl dark:text-white">{formData.nombre}</h4>

                                    <p className="text-white-dark">Ingrese su codigo para desbloquear su identificación</p>
                                </div>
                            </div>
                            <form className="space-y-5" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="Codigo" className="dark:text-white">
                                        Código
                                    </label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Codigo"
                                            type="text"
                                            placeholder="Ingresa tu código"
                                            className="form-input ps-10 placeholder:text-white-dark"
                                            pattern="[0-9]{6,}" // Al menos 6 números
                                            value={codigoValue}
                                            onChange={handleCodigoChange} // Agrega esta línea para vincular el controlador de cambio
                                            required
                                        />

                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    Confirmar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarMsm;
