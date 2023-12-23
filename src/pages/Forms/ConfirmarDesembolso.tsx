import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import GridLoader from 'react-spinners/GridLoader';
import { useEffect } from 'react';
import axios from 'axios';
import getApiUrl from '../../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import '../../assets/css/app.css'; //  css de login

const storedUsdDate = localStorage.getItem('userData');
const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

const apiURL = getApiUrl();

const ConfirmarDesembolso = () => {
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState(1);
    const navigate = useNavigate();

    const [banco_registrado, setBancoRegistrado] = useState('');

    const [numeroCuenta_registro, setNumeroCuentaRegistrado] = useState('');
    const [tipo_cuenta, setTipoCuentaRegistrada] = useState('');
    const [Cupo_registrado, setCupoRegistrado] = useState(0);
    const [codigoError, setCodigoError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);

                const response2 = await axios.post(`${apiURL}/api/infoBancoDato`, {
                    userDocumento: userDocumento,
                });

                const response3 = await axios.post(`${apiURL}/api/menu/cupoTotal`, {
                    userDocumento: userDocumento,
                });

                const infoBanco = response2.data.estudio;

                setLoading(false);

                setBancoRegistrado(response2.data.banco);
                setNumeroCuentaRegistrado(response2.data.numeroCuenta);
                setTipoCuentaRegistrada(response2.data.tipoCuenta);

                setCupoRegistrado(response3.data.cupoDisponible);

                //    setFormData((prevData) => ({
                //        ...prevData,
                //        TotalDisponible: Cupo_registrado,
                //        tasa: tasa_registrado,
                //        plazo: plazo_registrado,
                //    }));
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            } finally {
                setLoading(false); // Colócalo aquí para asegurarte de que se ejecute incluso en caso de error
            }
        };

        fetchData();
    }, []);

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
    const [inputCodigo, setInputCodigo] = useState<number | undefined>(undefined);

    const handleAceptarClick = async () => {
        // Agrega async aquí
        // Marcamos el inicio del área de loading
        setLoading(true);

        // Validación del código
        if (inputCodigo === undefined || inputCodigo.toString().length < 4) {
            setCodigoError(' ');
            setLoading(false); // Marcamos el final del área de loading

            showAlerterror(15);

            return;
        }

        // Obtén los datos almacenados en localStorage
        const storedData = localStorage.getItem('DetalleCredit');

        console.log('datos para crédito', storedData);

        if (storedData) {
            const dataToSave = JSON.parse(storedData);

            // Obtén el valor de "prestamo" del objeto
            const prestamo = dataToSave.prestamo;

            // Resto del código...

            try {
                // Realiza la solicitud POST al servidor
                const response4 = await axios.post(`${apiURL}/api/proceso/desembolso`, {
                    documento: userDocumento,
                    prestamo: dataToSave.prestamo,
                    banco: banco_registrado,
                    numeroCuenta: numeroCuenta_registro,
                    tipoCuenta: tipo_cuenta,
                });

                // Muestra la alerta
                showAlert(15);

                // eliminar datos de localsotreg
                localStorage.removeItem('DetalleCredit');

                navigate('/');
                // Marcamos el final del área de loading
                setLoading(false);
            } catch (error: any) {
                // Verifica si 'response' y 'status' existen antes de usarlos
                if (error.response && error.response.status) {
                    const status = error.response.status;

                    // Verifica si 'status' es 400
                    if (status === 400) {
                        // Si la respuesta del servidor es un error 400, muestra la alerta y quiebra la navegación
                        Swal.fire({
                            title: 'Monto excede el cupo',
                            text: 'El monto del préstamo excede el cupo disponible.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#dc3545', // Color rojo
                            timer: 8000, // Ajustado el tiempo a 5000 milisegundos (8 segundos)
                        });

                        // eliminar datos de localsotreg
                        localStorage.removeItem('DetalleCredit');

                        // Quiebra la navegación
                        navigate('/');
                    } else {
                        // Si el 'status' no es 400 u otro valor esperado, puedes manejarlo según tus necesidades
                        console.error('Error al procesar desembolso. Status:', status);

                        // Puedes mostrar una alerta o realizar otras acciones según tus necesidades
                    }
                } else {
                    // Si 'response' o 'status' no existen, puedes manejarlo según tus necesidades
                    console.error('Error al procesar desembolso. Response o Status no existen.');

                    // Puedes mostrar una alerta o realizar otras acciones según tus necesidades
                }

                // Marcamos el final del área de loading
                setLoading(false);
            }

            // Resto del código...
        } else {
            console.log('Datos de crédito no encontrados');
            // Aquí puedes realizar acciones si los datos no están disponibles

            // Marcamos el final del área de loading
            setLoading(false);
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
                <ul className="flex space-x-2 rtl:space-x-reverse">
                    {/* <li>
                    <Link to="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Date and Range Picker</span>
                </li> */}
                </ul>

                <div className="panel h-full lg:h-auto">
                    <div className="pt-5">
                        <h6 className=" mt-0 mb-0 text-lg">
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" style={{ color: 'darkgreen' }} /> <span>Solicitar crédito</span>
                        </h6>

                        {/* inicio de col */}
                        <div className="pt-5 grid lg:grid-cols-2 grid-cols-1 gap-6">
                            {/* confirmar codigo de desembolso*/}
                            <div className="panel" id="horizontal_form">
                                <div className="flex items-center justify-between mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">Confirmación de Desembolso 🌟</h5>
                                </div>
                                <div className="mb-5">
                                    <form className="space-y-5">
                                        <div className="flex sm:flex-row flex-col">
                                            <p style={{ display: 'flex', alignItems: 'center' }}>
                                                <span style={{ marginRight: '5px' }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        width="24"
                                                        height="24"
                                                        style={{ color: '#f8d7da', marginRight: '5px' }}
                                                    >
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                Confirma el código que hemos enviado a tu celular para aplicar al crédito
                                            </p>
                                        </div>

                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="primerPago" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Codigo
                                            </label>
                                            <input
                                                id="valorCuota"
                                                type="text"
                                                value={inputCodigo !== undefined ? inputCodigo : ''}
                                                placeholder="Ingrese el código"
                                                className={`form-input flex-1 ${codigoError ? 'border-red-500' : ''}`}
                                                required
                                                onChange={(e) => {
                                                    const inputValue = parseInt(e.target.value, 10);
                                                    setInputCodigo(isNaN(inputValue) ? undefined : inputValue);
                                                }}
                                            />
                                            {codigoError && <p className="text-red-500 text-xs italic">{codigoError}</p>}
                                        </div>
                                        <p>
                                            Te enviaremos el dinero a tu cuenta 🏦 <strong>{banco_registrado}</strong> terminada en 💳<strong>{numeroCuenta_registro}</strong> 📃 cuenta de{' '}
                                            <strong>{tipo_cuenta}</strong>; esto puede tardar hasta 24 horas ⏳.
                                        </p>

                                        {/* Antiguo botón de Aceptar */}
                                        <button
                                            type="button"
                                            className="btn !mt-6 w-40 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] bg-green-500 text-white mx-auto"
                                            onClick={() => {
                                                handleAceptarClick();
                                            }}
                                        >
                                            Aceptar
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Informacion de agradecimiento */}
                            <div className="panel" id="horizontal_form">
                                <div className="flex items-center justify-between mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">Proceso de Desembolso ⏰</h5>
                                </div>
                                <div className="mb-5">
                                    <div className="proceso-desembolso">
                                        <div className="proceso-desembolso">
                                            {/* <h2>Proceso de Desembolso ⏰</h2> */}
                                            <br />
                                            <p>
                                                Si tienes alguna pregunta adicional o necesitas más información sobre el estado de tu solicitud, no dudes en contactarnos. Estamos disponibles para
                                                ayudarte en todo momento. Agradecemos tu confianza en nuestra institución y esperamos poder brindarte el apoyo financiero que necesitas. ¡Pronto estarás
                                                disfrutando de los beneficios de tu préstamo!
                                            </p>
                                            <br />
                                            <p>Agradecemos tu paciencia durante el proceso. Si tu cuenta es de Bancolombia, el dinero llegará en las próximas 2 horas hábiles. 😊</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmarDesembolso;
