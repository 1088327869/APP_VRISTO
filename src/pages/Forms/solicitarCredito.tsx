import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Nouislider from '@x1mrdonut1x/nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import getApiUrl from '../../../config';
import axios from 'axios';
import GridLoader from 'react-spinners/GridLoader'; // genera el icono del loagin
import '../../assets/css/app.css'; //  css de login
import { addDays, format } from 'date-fns';
import Swal from 'sweetalert2';
import { AxiosError } from 'axios';

interface FormData {
    TotalCupo: string;
    TotalDisponible: string;
    tasa: string;
    plazo: string;
}

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

const DateRangePicker = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const apiURL = getApiUrl();
    const storedUsdDate = localStorage.getItem('userData');
    const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};
    dispatch(setPageTitle('Crédito'));

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

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);

                const response2 = await axios.post(`${apiURL}/api/menu/enEstudio`, {
                    userDocumento: userDocumento,
                });

                const response3 = await axios.post(`${apiURL}/api/menu/cupoTotal`, {
                    userDocumento: userDocumento,
                });

                const estado = response2.data.estudio;

                // if (estado === 'EN ESTUDIO' || estado === 'RECHAZADO') {
                //     setLoading(false);
                //     navigate('/');
                // }
                // Marcamos el final del área de loading
                setLoading(false);

                const Cupo_registrado = response3.data.cupoDisponible;
                const tasa_registrado = response3.data.tasa;
                const plazo_registrado = response3.data.plazo;

                setFormData((prevData) => ({
                    ...prevData,
                    TotalDisponible: Cupo_registrado,
                    tasa: tasa_registrado,
                    plazo: plazo_registrado,
                }));
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            } finally {
                setLoading(false); // Colócalo aquí para asegurarte de que se ejecute incluso en caso de error
            }
        };

        fetchData();
    }, [dispatch]);

    // formulario  de datos
    const [formData, setFormData] = useState<FormData>({
        TotalCupo: '',
        TotalDisponible: '0',
        tasa: '0',
        plazo: '0',
    });

    // Obtén el valor numérico de TotalDisponible
    const totalDisponible = parseInt(formData.TotalDisponible, 10);
    const plazo = parseInt(formData.plazo, 10);
    const minimo = totalDisponible >= 180000 ? 180000 : 0;
    const maximo = totalDisponible;
    const minimo_plazo = 2;
    const plazo_maximo = plazo;

    //fecha de periodo
    const [periodicidad, setPeriodicidad] = useState('quincenal');
    const [fechaPago, setFechaPago] = useState(new Date());

    // Inicializa inputStart con el valor adecuado
    const [inputStart, setInputStart] = useState<number>(minimo);

    const [inputEnd, setInputEnd] = useState<number>(maximo);

    // Segundo rango
    const [inputStart2, setInputStart2] = useState<number>(minimo_plazo); // Mínimo
    const [inputEnd2, setInputEnd2] = useState<number>(plazo_maximo);

    const slider1Update = (range: number[]) => {
        setInputStart(range[0]); // Debería ser [0] para el valor de inicio
        setInputEnd(range[1]);
    };

    const slider2Update = (range: number[]) => {
        setInputStart2(range[0]); // Debería ser [0] para el valor de inicio
        setInputEnd2(range[1]);
    };

    const handleSlider1Update = (values: number[]) => {
        // Verificar si el valor de inputEnd es un número válido
        const newInputEnd = values[1];
        if (!isNaN(newInputEnd)) {
            setInputEnd(newInputEnd);
        }
    };

    // vamos a calcular el valor de la cuota   ************************************
    const tasa: string = formData.tasa;
    const tasaNumerica = parseFloat(tasa) / 100; // Dividir por 100 para obtener la tasa como fracción
    const ROUNDING_VALUE = 100; // este es el valor que se calcula para que el valor de cerrado de $ 100

    const calculateQuota = () => {
        const prestamo = inputEnd;
        const meses = inputEnd2;

        if (isNaN(tasaNumerica)) {
            console.log('La tasa no es un número válido.');
            return 0;
        }

        const valorTasaConAmortiguador = (tasaNumerica * Math.pow(1 + tasaNumerica, meses) * prestamo) / (Math.pow(1 + tasaNumerica, meses) - 1);
        const cuotaSinDecimales = Math.trunc(valorTasaConAmortiguador);

        // console.log('Cuota sin decimales:', cuotaSinDecimales);
        // const interes = cuotaSinDecimales - prestamo;
        // const capital = prestamo;

        // console.log('Interés:', interes);
        // console.log('Capital:', capital);

        return cuotaSinDecimales;
    };

    const cuota_calculada = Math.round(calculateQuota() / ROUNDING_VALUE) * ROUNDING_VALUE;
    const cuota = periodicidad === 'quincenal' ? cuota_calculada / 2 : cuota_calculada;

    // console.log(
    //     'Cuota final: $',
    //     cuota.toLocaleString('en-US', {
    //         minimumFractionDigits: 0,
    //         maximumFractionDigits: 0,
    //     })
    // );

    // calcular la fecha de pago, si es mensual o quincenal

    useEffect(() => {
        // Actualizar la fecha de pago cuando cambia la periodicidad
        setFechaPago(calcularFechaPago());
    }, [periodicidad]);

    const calcularFechaPago = () => {
        const fechaHoy = new Date();

        if (periodicidad === 'mensual') {
            return addDays(fechaHoy, 30);
        } else if (periodicidad === 'quincenal') {
            return addDays(fechaHoy, 15);
        }

        return fechaHoy;
    };

    const handlePeriodicidadChange = (event: ChangeEvent<HTMLInputElement>): void => {
        // Manejar el cambio de periodicidad aquí
        setPeriodicidad(event.target.value);
    };

    const handleAceptarClick = async () => {
        // Marcamos el inicio del área de loading
        setLoading(true);
        // llamar a la api, para validar si  tiene mas de 1 credito

        try {
            // Realiza la solicitud a la API
            const validarCreditosEn_proceso = await axios.post(`${apiURL}/api/validar/credito`, {
                userDocumento: userDocumento,
            });
            // realizar consulta de API suma total de sanciones
            const sumaSanciones = await axios.post(`${apiURL}/api/validar/credito/mora`, {
                userDocumento: userDocumento,
            });
            const { totalSanciones } = sumaSanciones.data;

            if (totalSanciones >= 1) {
                // Muestra el mensaje de intento máximo permitido para estado_aprobado
                Swal.fire({
                    title: 'Crédito en mora',
                    text: 'Tienes pagos pendientes, no puedes solicitar tu crédito si tienes saldo en mora.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545',
                    timer: 15000,
                });
                // Rompe la ejecución de la función aquí
                return;
            }

            // Verifica el estado_aprobado y estado_enproceso
            const { estado_aprobado, estado_enproceso } = validarCreditosEn_proceso.data;

            if (estado_aprobado >= 2) {
                // Muestra el mensaje de intento máximo permitido para estado_aprobado
                Swal.fire({
                    title: 'Maximo Crédito permitido',
                    text: 'No puedes tener más de 2 créditos en curso a la vez',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545', // Color rojo
                    timer: 15000,
                });
                // Rompe la ejecución de la función aquí
                return;
            }

            if (estado_enproceso >= 1) {
                // Muestra el mensaje de intento máximo permitido para estado_enproceso
                Swal.fire({
                    title: 'Máximo Crédito permitido',
                    text: 'Ya tiene un crédito en proceso',
                    icon: 'info', // Cambiado a icono de información
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545', // Color rojo
                    timer: 15000,
                });

                // Rompe la ejecución de la función aquí
                return;
            }
        } catch (error) {
            // Maneja el error si es necesario

            // Verifica si el error es una respuesta 400 (Bad Request)
            if (axios.isAxiosError(error)) {
                // Muestra el mensaje de intento máximo permitido
                Swal.fire({
                    title: 'Maximo Crédito permitido',
                    text: 'No puedes tener más de 2 créditos a la vez',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545', // Color rojo
                    timer: 15000,
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

        // Acomodar info que se guarda en el localstoreg
        const numeroDeCuotas = periodicidad === 'quincenal' ? inputEnd2 * 2 : inputEnd2;

        // acomodar el cuerpo del
        const dataToSave = {
            prestamo: inputEnd,
            plazo: inputEnd2,
            numeroCuotas: numeroDeCuotas,
            periodicidad,
            valorCuota: cuota,
            primerPago: format(fechaPago, 'yyyy-MM-dd'),
            tasa: tasa,
        };

        // Verifica si el monto del préstamo es menor que $200,000
        if (dataToSave.prestamo <= 179999) {
            // Muestra notificación de error
            Swal.fire({
                title: 'Monto insuficiente',
                text: 'El monto mínimo requerido es de $180,000.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545',
                timer: 5000,
            });

            // Marcamos el final del área de loading
            setLoading(false);

            // Puedes agregar más acciones según sea necesario
            return; // Sale de la función para evitar que continúe con el resto del código
        }

        // Realiza la validación
        if (dataToSave.prestamo > 0 && dataToSave.plazo > 0 && dataToSave.valorCuota > 0) {
            // Convierte la información a cadena JSON
            const detalle = JSON.stringify(dataToSave);

            // Guarda la información en localStorage
            localStorage.setItem('DetalleCredit', detalle);

            showAlert(15);

            // Puedes mostrar un mensaje o realizar otras acciones si es necesario
            console.log('Información guardada en localStorage:', dataToSave);
            // Marcamos el final del área de loading
            setLoading(false);

            navigate('/forms/Credit/Confirmar');
        } else {
            // Muestra notificación de error
            Swal.fire({
                title: 'Error',
                text: 'Por favor, completa todos los campos del formulario de préstamo y plazo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545',
                timer: 5000,
            });

            // Muestra un mensaje de error o realiza otras acciones si no se cumple la validación
            console.log('Error: Alguno de los campos no cumple con la condición.');
            // Marcamos el final del área de loading
            setLoading(false);
            // Rompe la ejecución de la función aquí
            return;
        }

        try {
            // Realiza la solicitud a la API
            const codigoResponse = await axios.post(`${apiURL}/api/codigo/credito`, {
                userDocumento: userDocumento,
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
                    title: 'Intento máximo permitido',
                    text: `Comunícate con nosotros a la línea de atención 📞 (604)4310350`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545', // Color rojo
                    timer: 15000,
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

        // Marcamos el final del área de loading
        setLoading(false);
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
                            {/* Seleccionar monto y plazo*/}
                            <div className="panel" id="horizontal_form">
                                <div className="flex items-center justify-between mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">Detalle de la solicitud</h5>
                                </div>
                                <div className="mb-5">
                                    <form className="space-y-5">
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Prestamo
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input w-3/4"
                                                style={{ marginLeft: '4px' }}
                                                value={`$ ${inputEnd > 0 ? inputEnd.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}`}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const inputValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                    setInputEnd(isNaN(inputValue) ? 0 : inputValue);
                                                }}
                                                onBlur={() => {
                                                    setInputEnd((prevValue: number) => Math.min(maximo, Math.max(minimo, prevValue)));
                                                }}
                                                max={maximo}
                                                inputMode="numeric"
                                            />
                                        </div>
                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="horizontalEmail" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Plazo
                                            </label>
                                            <input
                                                type="text"
                                                className="form-input w-3/4"
                                                value={` ${inputEnd2.toLocaleString('en-US', {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}`}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const inputValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                    setInputEnd2(inputValue);
                                                }}
                                                onBlur={() => {
                                                    setInputEnd2((prevValue: number) => Math.min(plazo_maximo, Math.max(minimo_plazo, prevValue))); // Limitar el rango entre 2 y 12
                                                }}
                                                inputMode="numeric"
                                            />
                                        </div>

                                        <div className="flex sm:flex-row flex-col">
                                            <label className="sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">Periocidad</label>
                                            <div className="flex-1">
                                                <div className="mb-2">
                                                    <label className="inline-flex mt-1 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="segements"
                                                            className="form-radio"
                                                            value="quincenal"
                                                            checked={periodicidad === 'quincenal'}
                                                            onChange={handlePeriodicidadChange}
                                                        />
                                                        <span className="text-white-dark">Quincenal (Cuotas:{inputEnd2 * 2})</span>
                                                    </label>
                                                </div>
                                                <div className="mb-2">
                                                    <label className="inline-flex mt-1 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="segements"
                                                            className="form-radio"
                                                            value="mensual"
                                                            checked={periodicidad === 'mensual'}
                                                            onChange={handlePeriodicidadChange}
                                                        />
                                                        <span className="text-white-dark">Mensual (Cuotas:{inputEnd2 * 1})</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="valorCuota" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Valor Cuota
                                            </label>
                                            <input
                                                id="valorCuota"
                                                type="text"
                                                value={cuota.toLocaleString('en-US', {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                                placeholder="Enter Valor Cuota"
                                                className="form-input flex-1"
                                                readOnly // Agrega el atributo readOnly para hacer el campo no editable
                                            />
                                        </div>

                                        <div className="flex sm:flex-row flex-col">
                                            <label htmlFor="primerPago" className="mb-0 sm:w-1/4 sm:ltr:mr-2 rtl:ml-2">
                                                Primer Pago
                                            </label>
                                            <input
                                                id="primerPago"
                                                value={format(fechaPago, 'dd-MM-yyyy')} // Formatea la fecha como desees
                                                type="text"
                                                placeholder="Enter Primer Pago"
                                                className="form-input flex-1"
                                                readOnly // Para que el campo no sea editable
                                            />
                                        </div>
                                        <p>El proceso de desembolso depende del ciclo de ACH para ser procesado; esto puede tardar hasta 24 horas hábiles.</p>

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

                                    {/* Prestamo */}
                                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-9">
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <h1>Prestamo </h1>
                                        <input
                                            type="text"
                                            className="form-input"
                                            style={{ marginLeft: '4px' }} // Ajusta el margen izquierdo según sea necesario
                                            value={`$ ${!isNaN(inputEnd) ? inputEnd.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}`}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const inputValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                // Verifica si inputValue es un número válido antes de actualizar el estado
                                                if (!isNaN(inputValue)) {
                                                    setInputEnd(inputValue);
                                                }
                                            }}
                                            onBlur={() => {
                                                setInputEnd((prevValue: number) => Math.min(1000000, Math.max(200000, prevValue)));
                                            }}
                                        />
                                    </div>
                                </div> */}
                                    {/* plazo */}
                                    {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-9">
                                    <div className="flex items-center justify-center lg:justify-start">
                                        <h1>Plazo </h1>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={` ${inputEnd2.toLocaleString('en-US', {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}`}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const inputValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                setInputEnd2(inputValue);
                                            }}
                                            onBlur={() => {
                                                setInputEnd2((prevValue: number) => Math.min(12, Math.max(2, prevValue))); // Limitar el rango entre 2 y 12
                                            }}
                                        />
                                    </div>
                                </div> */}
                                </div>
                            </div>

                            {/* Informacion */}
                            <div className="panel" id="horizontal_form">
                                <div className="flex items-center justify-between mb-5">
                                    <h5 className="font-semibold text-lg dark:text-white-light">Seleccionar monto a solcicitar</h5>
                                </div>

                                {/* Primer rango */}
                                <div className="mb-5 pt-10">
                                    <div style={{ textAlign: 'center', margin: '20px 0', padding: '10px' }}>
                                        {/* <p style={{ marginBottom: '10px' }}>Préstamo: ${!isNaN(inputEnd) ? inputEnd.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '0'}</p> */}
                                        <Nouislider
                                            range={{ min: 180001, max: maximo }}
                                            start={[inputStart, inputEnd]}
                                            step={1}
                                            connect={true}
                                            onSlide={handleSlider1Update}
                                            tooltips={true}
                                            format={{
                                                to: (value: number) => `$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                                                from: (value: string) => parseFloat(value.replace(/\$|,/g, '')),
                                            }}
                                            disabled={true} // Deshabilitar la barra de inputStart
                                        />
                                        <div className="container d-flex justify-content-between" style={{ margin: '5px' }}>
                                            <h1 className="text-end">Max : $ {maximo.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-9"></div>
                                </div>
                                {/* Monto */}
                                <div className="mb-5 pt-10">
                                    <Nouislider
                                        range={{ min: 2, max: plazo_maximo }}
                                        start={[2, inputEnd2]}
                                        step={1}
                                        connect={true}
                                        tooltips={true}
                                        onSlide={handleSlider1Update}
                                        format={{
                                            to: (value: number) => ` ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
                                            from: (value: string) => parseFloat(value.replace(/\$|,/g, '')),
                                        }}
                                        disabled={true}
                                    />

                                    <div className="container d-flex justify-content-between" style={{ margin: '5px' }}>
                                        <h1 className="text-end">Max : {formData.plazo}</h1>
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

export default DateRangePicker;
