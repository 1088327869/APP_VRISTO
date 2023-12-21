import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../pages/Authentication/login/token';
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

const FormularioG = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

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
        const storedUsdDate = localStorage.getItem('userData');
        const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

        const apiURL = getApiUrl();
        const payvalida = 'https://pago.solucredito.com.co';

        dispatch(setPageTitle('PAGOS'));

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

    // const [apiData, setApiData] = useState<any>(null); // Puedes cambiar 'any' por el tipo adecuado para tus datos
    // Define el estado del formulario

    const [selectedPaymentOption, setSelectedPaymentOption] = useState('pago_minimo');

    const handlePaymentOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedOption = event.target.value;

        // Actualizar el estado del formulario
        setFormData((prevData) => ({
            ...prevData,
            valor_seleccionado: selectedOption,
        }));

        // Guardar el valor seleccionado en localStorage
        localStorage.setItem('selectedPaymentOption', selectedOption);

        // Actualizar el estado del tipo de pago seleccionado
        setSelectedPaymentOption(selectedOption);
    };

    const handlePagarClick = async () => {
        try {
            // Realiza tu solicitud
            // Marcamos el inicio del área de loading
            setLoading(true);

            let selectedPaymentOption = '1200';

            switch (formData.valor_seleccionado) {
                case 'pago_minimo':
                    selectedPaymentOption = formData.pago_minimo;
                    break;
                case 'Pago_total':
                    selectedPaymentOption = formData.Pago_total;
                    break;
                case 'pago_mora':
                    selectedPaymentOption = formData.pago_mora;
                    break;
                default:
                    // Puedes manejar otro caso por defecto o lanzar un error si es necesario
                    break;
            }

            // Establecer el estado del tipo de pago seleccionado
            setSelectedPaymentOption(selectedPaymentOption);

            console.log('valor obtenido', selectedPaymentOption);
            const responseLink = await axios.post(`https://pago.solucredito.com.co/generarLink`, {
                //      const responseLink = await axios.post(`http://localhost:3001/generarLink`, {
                nombreCliente: formData.nombre,
                email: formData.email,
                amount: selectedPaymentOption, // pendiente porseleccionar el valor a pagar
                identification: formData.documento,
                identificationType: 'CC',
                metodoPago: selectedPhysicalPayment,
            });

            // Obtén el valor de responseLink.data
            const link = responseLink.data;

            // Construye la URL utilizando el valor de link como un fragmento de ruta
            const urlCompleta = `https://${link}`;

            // Abre una nueva pestaña del navegador con la URL completa

            window.open(urlCompleta, '_blank');
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

    const [selectedPhysicalPayment, setSelectedPhysicalPayment] = useState('pse');

    const handlePaymentChange = (event: { target: { value: React.SetStateAction<string> } }) => {
        setSelectedPhysicalPayment(event.target.value);
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
                    <ul className="flex space-x-2 rtl:space-x-reverse">
                        <li>
                            <Link to="#" className="text-primary hover:underline">
                                Pago
                            </Link>
                        </li>
                        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                            <span>Crédito</span>
                        </li>
                    </ul>
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
                                        <h5 className="font-semibold text-lg dark:text-white-light">Informacion de pago</h5>
                                    </div>
                                    <div className="mb-5">
                                        <form className="space-y-5">
                                            {/* ... (resto del código) */}
                                            <div className="flex sm:flex-row flex-col">
                                                <label className="sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Tipo de pago</label>
                                                <div className="flex-1">
                                                    {/* ... (resto del código) */}
                                                    <div className="mb-2">
                                                        <label className="inline-flex mt-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="segements"
                                                                className="form-radio"
                                                                checked={selectedPaymentOption === 'Pago_total'}
                                                                onChange={() => setSelectedPaymentOption('Pago_total')}
                                                            />
                                                            <span className="text-white-dark">Pago total {formData.Pago_total}</span>
                                                        </label>
                                                    </div>

                                                    <div className="mb-2">
                                                        <label className="inline-flex mt-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="segements"
                                                                className="form-radio"
                                                                checked={selectedPaymentOption === 'pago_minimo'}
                                                                onChange={() => setSelectedPaymentOption('pago_minimo')}
                                                            />
                                                            <span className="text-white-dark">Pago Mínimo {formData.pago_minimo}</span>
                                                        </label>
                                                    </div>
                                                    <div className="mb-2">
                                                        <label className="inline-flex mt-1 cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name="segements"
                                                                className="form-radio"
                                                                checked={selectedPaymentOption === 'pago_mora'}
                                                                onChange={() => setSelectedPaymentOption('pago_mora')}
                                                            />
                                                            <span className="text-white-dark">Pago en mora {formData.pago_mora}</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
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
                                                    Crédito
                                                </label>
                                                <select id="horizontalEmail" className="form-input flex-1" value={selectedPhysicalPayment} onChange={handlePaymentChange}>
                                                    <option value="pse">PSE</option>
                                                    <option value="bancolombia">BANCOLOMBIA</option>
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

export default FormularioG;
