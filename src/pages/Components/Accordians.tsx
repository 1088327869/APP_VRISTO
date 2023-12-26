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

interface FormData {
    TotalCupo: string;
    TotalDisponible: string;
    nombre: string;
    documento: number;
    estado: string;
    ciudad: string;
    email: string;
    telefono: number;
    foto: string;
}

interface FormData2 {
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

const Accordians = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const apiURL = getApiUrl();
    const storedUsdDate = localStorage.getItem('userData');
    const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

    const [formData, setFormData] = useState<FormData>({
        TotalCupo: '0',
        TotalDisponible: '0',
        nombre: '',
        documento: 0,
        estado: '',
        ciudad: '',
        email: '',
        telefono: 0,
        foto: '',
    });

    const [formData2, setFormData2] = useState<FormData2>({
        prestamo_ID: 0,
        documento: '',
        tipoCredito: '',
        valor_prestamo: '',
        plazo: '',
        numero_cuotas: '',
        valor_cuota: '',
        periocidad: '',
        tasa: '',
        fecha_Pago: '',
        estado: '',
        cartera: '',
        fecha_registro: '',
        amortizacion: [],
    });

    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('amortizador'));
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);

                const response = await axios.post(`${apiURL}/api/menu/index`, {
                    userDocumento: userDocumento,
                });

                const response2 = await axios.post(`${apiURL}/api/menu/enEstudio`, {
                    userDocumento: userDocumento,
                });

                const response3 = await axios.post(`${apiURL}/api/menu/cupoTotal`, {
                    userDocumento: userDocumento,
                });

                const response4 = await axios.post(`${apiURL}/api/img/reg`, {
                    userDocumento: userDocumento,
                });

                const amortizador = await axios.post(`${apiURL}/api/credit/amorti`, {
                    userDocumento: userDocumento,
                });

                const amortizadorData = amortizador.data;
                console.log('amortizador', amortizadorData);
                // Actualiza formData2 con los datos de la API
                setFormData2((prevData) => {
                    return {
                        ...prevData,
                        prestamo_ID: amortizadorData.prestamo_ID,
                        documento: amortizadorData.documento,
                        tipoCredito: amortizadorData.tipoCredito,
                        valor_prestamo: amortizadorData.valor_prestamo,
                        plazo: amortizadorData.plazo,
                        numero_cuotas: amortizadorData.numero_cuotas,
                        valor_cuota: amortizadorData.valor_cuota,
                        periocidad: amortizadorData.periocidad,
                        tasa: amortizadorData.tasa,
                        fecha_Pago: amortizadorData.fecha_Pago,
                        estado: amortizadorData.estado,
                        cartera: amortizadorData.cartera,
                        fecha_registro: amortizadorData.fecha_registro,
                        amortizacion: amortizadorData.amortizacion,
                    };
                });

                // Ahora formData2 contiene los datos de la API
                console.log('formData2 actualizado', formData2);

                // Mapea cada objeto en amortizadorDataArray a la estructura deseada
                // const dynamicDataUpdated = amortizadorData.map((item: any, index: number) => {
                //     return {
                //         icon: <IconAirplay />,
                //         title: `Collapsible Group Item #${index + 1}`,
                //         content: JSON.stringify(item), // Puedes ajustar esto según la información que desees mostrar
                //     };
                // });

                // Ahora dynamicDataUpdated contiene la información mapeada y puedes usarla según tus necesidades
                // console.log('dynamicDataUpdated', dynamicDataUpdated);

                // Filtrar el tipo "foto"
                const fotoPerfilData = response4.data.find((item: any) => item.tipo === 'foto');

                // console.log('Datos de la API us: ', response4.data);

                // Accede a los datos después de la respuesta exitosa
                const nombre_registro = response.data.nombre;
                const apellido_registro = response.data.apellido;
                const documento_registrado = response.data.documento;
                const celular_egistrado = response.data.celular;
                const email_registrado = response.data.email;
                const ciudad_registro = response.data.ciudad;
                const estudio_registro = response2.data.estado;
                const Cupo_registrado = response3.data.cupo;
                const CupoDisponible_registrado = response3.data.cupoDisponible;

                // console.log('cupo', response3.data.cupoDisponible);

                // foto guardada
                const foto_registro = `${apiURL}/uploads/registro/${fotoPerfilData.documento_guardar}`;

                // console.log('foto: ', fotoPerfilData);
                // console.log('completa: ', foto_registro);

                // // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,

                        apellido: apellido_registro,
                        nombre: `${nombre_registro} ${apellido_registro}`,
                        documento: documento_registrado,
                        telefono: celular_egistrado,
                        email: email_registrado,
                        ciudad: ciudad_registro,
                        estado: estudio_registro,
                        TotalCupo: Cupo_registrado,
                        // Pendiente por cambiar el cupo disponible
                        TotalDisponible: CupoDisponible_registrado,

                        // fotos
                        foto: foto_registro,

                        // Otras propiedades no se afectan
                        // Marcamos el final del área de loading
                    };
                });
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
                // Marcamos el final del área de loading
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dynamicData =
        formData2.amortizacion && formData2.amortizacion.length
            ? formData2.amortizacion.map((item, index) => {
                  return {
                      icon: <IconAirplay />,
                      title: `Collapsible Group Item #${index + 1}`,
                      content: (
                          <>
                              <p>Documento: {item.documento}</p>
                              <p>Numero de Cuota: {item.Numero_cuota}</p>
                              <p>Capital: {item.capital}</p>
                              {/* Add more fields as needed */}
                          </>
                      ),
                  };
              })
            : [
                  {
                      icon: <IconAirplay />,
                      title: 'Collapsible Group Item #1',
                      content: (
                          <>
                              <p>Documento: </p>
                              <p>Numero de Cuota: </p>
                              <p>Capital: </p>
                              {/* Add more fields as needed */}
                          </>
                      ),
                  },
                  {
                      icon: <IconAirplay />,
                      title: 'Collapsible Group Item #2',
                      content: (
                          <>
                              <p>Documento: </p>
                              <p>Numero de Cuota: </p>
                              <p>Capital: </p>
                              {/* Add more fields as needed */}
                          </>
                      ),
                  },
              ];

    // Puedes ajustar el número de elementos predeterminados según tus necesidades

    console.log('formData2.amortizacion:', formData2.amortizacion);
    console.log('dynamicData:', dynamicData);

    // const dynamicData = [{ icon: <IconAirplay />, title: 'Collapsible Group Item #1', content: 'prestamo_ID' }];

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
                    <h5 className="font-semibold text-lg dark:text-white-light">Accordions</h5>
                    <button onClick={toggleCode} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                        <span className="flex items-center">
                            <IconCode className="me-2" />
                            Code
                        </span>
                    </button>
                </div>

                <div className="mb-5">
                    <div className="space-y-2 font-semibold">
                        {dynamicData.map((item, index) => (
                            <div key={index} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                <button
                                    type="button"
                                    className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${activeAccordion === index.toString() ? '!text-primary' : ''}`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {item.icon}
                                    {item.title}
                                    <div className={`ltr:ml-auto rtl:mr-auto ${activeAccordion === index.toString() ? 'rotate-180' : ''}`}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <div>
                                    <AnimateHeight duration={300} height={activeAccordion === index.toString() ? 'auto' : 0}>
                                        <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                            <p>{item.content}</p>
                                            {/* ... Puedes agregar más contenido según tus necesidades ... */}
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isCodeVisible && <CodeHighlight>{`// Tu código de resaltado aquí`}</CodeHighlight>}
            </div>
        </div>
    );
};

export default Accordians;
function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
