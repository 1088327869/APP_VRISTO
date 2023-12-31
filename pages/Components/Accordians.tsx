import React, { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconAirplay from '../../components/Icon/IconAirplay';
import IconBox from '../../components/Icon/IconBox';
import IconLayout from '../../components/Icon/IconLayout';
import getApiUrl from '../../../config';
import axios from 'axios';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import CodeHighlight from '../../components/Highlight';
import IconCreditCard from '../../components/Icon/IconCreditCard';

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

const Accordians = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const apiURL = getApiUrl();
    const storedUsdDate = localStorage.getItem('userData');
    const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

    const [creditos, setCreditos] = useState([]);

    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('amortizador'));
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

    const amortizacionesCredito = (credito: CreditoConAmortizacion) =>
        credito.amortizacion && credito.amortizacion.length
            ? credito.amortizacion.map((item: Amortizacion, index: number) => {
                  return <div key={item.id /* o cualquier propiedad única */}>{/* Resto del contenido de amortización */}</div>;
              })
            : [];

    // Puedes ajustar el número de elementos predeterminados según tus necesidades

    const dynamicData = [{ icon: <IconAirplay />, title: 'Collapsible Group Item #1', content: 'prestamo_ID' }];

    const [isCodeVisible, setIsCodeVisible] = useState(false);

    const toggleAccordion = (index: number) => {
        setActiveAccordion((prev) => (prev === index.toString() ? null : index.toString()));
    };

    const toggleCode = () => {
        setIsCodeVisible((prev) => !prev);
    };

    return (
        <div>
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Creditos</h5>
                </div>

                <div className="mb-5">
                    <div className="space-y-2 font-semibold">
                        {creditos.map((credito: CreditoConAmortizacion, indiceCredito) => {
                            const isActiveAccordion = activeAccordion === indiceCredito.toString();

                            return (
                                <div key={credito.prestamo_ID} className={`border border-[#d3d3d3] rounded dark:border-[#1b2e4b]`}>
                                    <button
                                        type="button"
                                        className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${isActiveAccordion ? '!text-primary' : ''}`}
                                        onClick={() => toggleAccordion(indiceCredito)}
                                    >
                                        <IconCreditCard />
                                        {credito.tipoCredito}
                                        {credito.prestamo_ID !== undefined ? ' ****' + credito.prestamo_ID.toString().slice(-4).padStart(4, '0') : ''}

                                        <div className={`ltr:ml-auto rtl:mr-auto ${isActiveAccordion ? 'rotate-180' : ''}`}>
                                            <IconCaretDown />
                                        </div>
                                    </button>
                                    <div>
                                        <AnimateHeight duration={300} height={isActiveAccordion ? 'auto' : 0}>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Valor inicial:</p>
                                                <p> $ {Number(credito.valor_prestamo).toLocaleString()}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Periodicidad de Pago:</p>
                                                <p>{credito.periocidad}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Total Cuotas:</p>
                                                <p>{credito.numero_cuotas}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Valor Cuota:</p>
                                                <p> $ {Number(credito.valor_cuota).toLocaleString()}</p>
                                            </div>

                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Cuotas pendientes:</p>
                                                <p>{credito.cuotasConSaldo}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Sanciones:</p>
                                                <p>{credito.sanciones}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Dias en mora:</p>
                                                <p>{credito.diasMora}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Pago en mora:</p>
                                                <p> $ {Number(credito.pagoEnMora).toLocaleString()}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Pago minimo:</p>
                                                <p> $ {Number(credito.pagoMinimo).toLocaleString()}</p>
                                            </div>

                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Pago toal:</p>
                                                <p> $ {Number(credito.pagoTotal).toLocaleString()}</p>
                                            </div>
                                            <div className="flex justify-between space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                                <p>Fecha pago:</p>
                                                <p>{credito.FechaPago}</p>
                                            </div>

                                            {amortizacionesCredito(credito)}
                                        </AnimateHeight>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordians;
function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
