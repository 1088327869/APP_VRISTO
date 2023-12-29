import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../Authentication/login/token';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import GridLoader from 'react-spinners/GridLoader';
import CodeHighlight from '../../components/Highlight';
import IconCode from '../../components/Icon/IconCode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import getApiUrl from '../../../config';
import axios from 'axios';
import { setPageTitle } from '../../store/themeConfigSlice';
import '../../assets/css/app.css'; //  css de login
import AnimateHeight from 'react-animate-height';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import Swal from 'sweetalert2';

interface CreditoConAmortizacion {
    prestamo_ID: number;
    documento: string;
    tipoCredito: string;
    valor_prestamo: string;
    plazo: string;
    numero_cuotas: string;
    valor_cuota: string;
    periocidad: string;
    tasa: string;
    fecha_Pago: string;
    estado: string;
    cartera: string;
    fecha_registro: string;
    cuotasConSaldo: number;
    cuotasSinSaldo: number;
    FechaPago: string;
    diasMora: number;
    pagoMinimo: number;
    pagoEnMora: number;
    sanciones: number;
    saldo_ultimaFecha: number;
    saldoUltimaCuota: number;
    pagoTotal: number;

    amortizacion: {
        id: number;
        prestamoID: number;
        documento: string;
        Numero_cuota: string;
        capital: string;
        interes: string;
        aval: string;
        sancion: number;
        total_cuota: string;
        saldo: string;
        fecha_pago: string;
    }[];
}

interface Amortizacion {
    id: number;
    prestamoID: number;
    documento: string;
    Numero_cuota: string;
    capital: string;
    interes: string;
    aval: string;
    sancion: number;
    total_cuota: string;
    saldo: string;
    fecha_pago: string;
}

// TODO borrarlo  pero validar que no rompa
interface FormData {
    TotalCupo: string;
    TotalDisponible: string;
    nombre: string;
    documento: number;
    ciudad: string;
    email: string;
    telefono: number;
    Pago_total: string;
    pago_minimo: string;
    pago_mora: string;
    valor_seleccionado: string;
}

const MediosDePago = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const storedUsdDate = localStorage.getItem('userData');
    const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};
    const [creditos, setCreditos] = useState([] as CreditoConAmortizacion[]);
    dispatch(setPageTitle('PAGOS'));

    const apiURL = getApiUrl();

    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        TotalCupo: '0',
        TotalDisponible: '0',
        nombre: '',
        documento: 0,
        ciudad: '',
        email: '',
        telefono: 0,
        Pago_total: '1000',
        pago_minimo: '2000',
        pago_mora: '3000',
        valor_seleccionado: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);

                const response = await axios.post(`${apiURL}/api/menu/index`, {
                    userDocumento: userDocumento,
                });

                const response3 = await axios.post(`${apiURL}/api/menu/cupoTotal`, {
                    userDocumento: userDocumento,
                });

                // Accede a los datos después de la respuesta exitosa
                const nombre_registro = response.data.nombre;
                const apellido_registro = response.data.apellido;
                const documento_registrado = response.data.documento;
                const celular_egistrado = response.data.celular;
                const email_registrado = response.data.email;
                const ciudad_registro = response.data.ciudad;

                const Cupo_registrado = response3.data.cupo;

                // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => ({
                    ...prevData,
                    apellido: apellido_registro,
                    nombre: `${nombre_registro} ${apellido_registro}`,
                    documento: documento_registrado,
                    telefono: celular_egistrado,
                    email: email_registrado,
                    ciudad: ciudad_registro,
                    TotalCupo: Cupo_registrado,
                    TotalDisponible: Cupo_registrado,
                }));
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            } finally {
                // Marcamos el final del área de loading
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);

                const respuestaAPICreditos = await axios.post(`${apiURL}/api/credit/cuotasPendiente`, {
                    userDocumento: userDocumento,
                });

                const dataRespuestaAPICreditos = respuestaAPICreditos.data;
                console.log('respuesta API', dataRespuestaAPICreditos);
                // Actualiza formData2 con los datos de la API
                setCreditos(dataRespuestaAPICreditos);

                setLoading(false);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
                // Marcamos el final del área de loading
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // const [apiData, setApiData] = useState<any>(null); // Puedes cambiar 'any' por el tipo adecuado para tus datos
    // Define el estado del formulario

    const [selectedCreditOption, setSelectedCreditOption] = useState(0);
    const [opcionPago, setOpcionPago] = useState('pago_minimo');

    const handleCreditOptionChange = (selectedValue: number) => {
        // Actualizar el estado del tipo de pago seleccionado
        setSelectedCreditOption(selectedValue);
    };

    const handlePagarClick = async () => {
        try {
            // Realiza tu solicitud
            // Marcamos el inicio del área de loading
            setLoading(true);

            let valorAPagar = 0;
            const creditoActual = creditos[selectedCreditOption];

            switch (opcionPago) {
                case 'pago_minimo':
                    valorAPagar = creditoActual.pagoMinimo;
                    break;
                case 'Pago_total':
                    valorAPagar = creditoActual.pagoTotal;
                    break;
                case 'pago_mora':
                    valorAPagar = creditoActual.pagoEnMora;
                    break;
                default:
                    // Puedes manejar otro caso por defecto o lanzar un error si es necesario
                    break;
            }

            if (valorAPagar < 1000) {
                Swal.fire({
                    title: 'Monto insuficiente',
                    text: 'El monto mínimo requerido es de $1,000.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545',
                    timer: 5000,
                });
                // rompe la navegacion
                // Marcamos el final del área de loading
                setLoading(false);
                return;
            }

            console.log('valor obtenido', valorAPagar);
            const hoy = new Date();
            const responseLink = await axios.post(`https://pago.solucredito.com.co/generarLink`, {
                // const responseLink = await axios.post(`http://localhost:3001/generarLink`, {
                nombreCliente: formData.nombre,
                email: formData.email,
                amount: valorAPagar, // pendiente porseleccionar el valor a pagar
                identification: formData.documento,
                identificationType: 'CC',
                metodoPago: selectedPhysicalPayment,
                ordenId: `${creditoActual.prestamo_ID}T${hoy.getMonth() + 1}${hoy.getDate()}${Math.floor(Math.random() * 1000)}`,
            });

            // Obtén el valor de responseLink.data
            const link = responseLink.data;

            // Construye la URL utilizando el valor de link como un fragmento de ruta
            const urlCompleta = `https://${link}`;

            // Abre una nueva pestaña del navegador con la URL completa

            // window.open(urlCompleta, '_blank');
            window.location.href = urlCompleta;
            // Marcamos el final del área de loading
            setLoading(false);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            // Marcamos el final del área de loading
            setLoading(false);
        }
        // Marcamos el final del área de loading
        setLoading(false);
    };

    const amortizacionesCredito = (credito: CreditoConAmortizacion) =>
        credito.amortizacion && credito.amortizacion.length
            ? credito.amortizacion.map((item: Amortizacion, index: number) => {
                  return <div key={item.id /* o cualquier propiedad única */}>{/* Resto del contenido de amortización */}</div>;
              })
            : [];

    const [selectedPhysicalPayment, setSelectedPhysicalPayment] = useState('pse');

    const handlePaymentChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setSelectedPhysicalPayment(event.target.value);
    };

    const toggleAccordion = (index: number) => {
        setActiveAccordion((prev) => (prev === index.toString() ? null : index.toString()));
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
                <div>
                    {/* <ul className="flex space-x-2 rtl:space-x-reverse">
                        <li>
                            <Link to="#" className="text-primary hover:underline">
                                Pago
                            </Link>
                        </li>
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>Crédito</span>
                        </li>
                    </ul> */}
                    <div className="panel h-full lg:h-auto">
                        <div className="pt-5">
                            <h6 className=" mt-0 mb-0 text-lg">
                                <FontAwesomeIcon icon={faCreditCard} className="mr-2" style={{ color: 'darkgreen' }} /> <span>Definición del pago</span>
                            </h6>

                            {/* inicio de col */}
                            <div className="pt-5 grid lg:grid-cols-2 grid-cols-1 gap-6">
                                {/* Informacion de pago */}
                                <div className="panel" id="horizontal_form">
                                    <div className="flex items-center justify-between mb-5">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Información de pago</h5>
                                    </div>
                                    <div className="mb-5">
                                        <form className="space-y-5">
                                            <div className="flex sm:flex-row flex-col">
                                                <label className="sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Seleccione crédito</label>
                                                <div className="flex-1">
                                                    <div className="space-y-2 font-semibold">
                                                        <select
                                                            id="horizontalEmail"
                                                            className="form-select flex-1"
                                                            onChange={(e) => {
                                                                const selectedIndex = parseInt(e.target.value, 10);
                                                                toggleAccordion(selectedIndex);
                                                                setFormData((prevData) => ({
                                                                    ...prevData,
                                                                    valor_seleccionado: '', // Reiniciar el valor seleccionado al cambiar el crédito
                                                                }));
                                                                handleCreditOptionChange(selectedIndex);
                                                            }}
                                                        >
                                                            <option value="">Seleccione un crédito</option>
                                                            {creditos.map((credito: CreditoConAmortizacion, index: number) => (
                                                                <option key={index} value={index}>
                                                                    {credito.tipoCredito}
                                                                    {credito.prestamo_ID !== undefined ? ' ****' + credito.prestamo_ID.toString().slice(-4).padStart(4, '0') : ''}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-row flex-col">
                                                <label className="sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Tipo de pago</label>
                                                <div className="flex-1">
                                                    <div className="mb-2">
                                                        <label className="inline-flex mt-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="segements"
                                                                className="form-radio"
                                                                checked={opcionPago === 'Pago_total'}
                                                                onChange={() => setOpcionPago('Pago_total')}
                                                            />
                                                            <span className="text-white-dark">
                                                                Pago total {creditos.length > 0 ? `$ ${Number(creditos[selectedCreditOption].pagoTotal).toLocaleString()}` : ''}
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="inline-flex mt-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="segements"
                                                                className="form-radio"
                                                                checked={opcionPago === 'pago_minimo'}
                                                                onChange={() => setOpcionPago('pago_minimo')}
                                                            />
                                                            <span className="text-white-dark">
                                                                Pago Mínimo {creditos.length > 0 ? `$ ${Number(creditos[selectedCreditOption].pagoMinimo).toLocaleString()}` : ''}
                                                            </span>
                                                        </label>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="inline-flex mt-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="segements"
                                                                className="form-radio"
                                                                checked={opcionPago === 'pago_mora'}
                                                                onChange={() => setOpcionPago('pago_mora')}
                                                            />
                                                            <span className="text-white-dark">
                                                                Pago en mora {creditos.length > 0 ? `$ ${Number(creditos[selectedCreditOption].pagoEnMora).toLocaleString()}` : ''}
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                        ;
                                    </div>
                                </div>

                                {/* Medios de pago */}
                                <div className="panel" id="horizontal_form">
                                    <div className="flex items-center justify-between mb-5">
                                        <h5 className="font-semibold text-lg dark:text-white-light">Medios de pago</h5>
                                    </div>
                                    <div className="mb-5">
                                        <form className="space-y-5">
                                            <div className="flex sm:flex-row flex-col">
                                                <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                    Tipo
                                                </label>
                                                <select id="horizontalEmail" className="form-input flex-1" value={selectedPhysicalPayment} onChange={handlePaymentChange}>
                                                    <option value="pse">PSE</option>
                                                    <option value="nequi">Nequi</option>
                                                    <option value="bancolombia">Bancolombia</option>
                                                    <option value="puntored">puntored</option>
                                                    <option value="sured">Su Red</option>
                                                    <option value="gana">Gana</option>
                                                    <option value="susuerte">Su suerte</option>
                                                    <option value="apostar">Apostar</option>
                                                    <option value="redservi">Red Servi</option>
                                                    <option value="efecty">Efecty</option>
                                                </select>
                                            </div>

                                            {selectedPhysicalPayment === 'pse' || selectedPhysicalPayment === '' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/pse.png" alt="PSE" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            {selectedPhysicalPayment === 'nequi' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/nequi.jpg" alt="nequi" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            {selectedPhysicalPayment === 'bancolombia' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/bancolombia.png" alt="Bancolombia" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            {selectedPhysicalPayment === 'puntored' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/puntored.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            {selectedPhysicalPayment === 'sured' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/sured.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            {selectedPhysicalPayment === 'gana' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/gana.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}
                                            {selectedPhysicalPayment === 'susuerte' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/susuerte.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}
                                            {selectedPhysicalPayment === 'apostar' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/apostar.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}
                                            {selectedPhysicalPayment === 'redservi' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/servi.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            {selectedPhysicalPayment === 'efecty' ? (
                                                <div className="payment-image-container">
                                                    <img src="../../assets/images/clients/efecty.png" alt="Puntored" className="payment-image img-fluid" />
                                                </div>
                                            ) : null}

                                            <button
                                                type="button"
                                                className="btn !mt-6 w-40 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] bg-green-500 text-white mx-auto"
                                                onClick={handlePagarClick}
                                            >
                                                Pagar
                                            </button>
                                        </form>
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

export default MediosDePago;
