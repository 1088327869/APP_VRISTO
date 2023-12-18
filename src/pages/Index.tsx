import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../store';
import ReactApexChart from 'react-apexcharts';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Dropdown from '../components/Dropdown';
import { setPageTitle } from '../store/themeConfigSlice';
import IconTag from '../components/Icon/IconTag';
import IconCreditCard from '../components/Icon/IconCreditCard';
import IconPencilPaper from '../components/Icon/IconPencilPaper';
import IconCoffee from '../components/Icon/IconCoffee';
import IconCalendar from '../components/Icon/IconCalendar';
import IconMapPin from '../components/Icon/IconMapPin';
import IconMail from '../components/Icon/IconMail';
import IconPhone from '../components/Icon/IconPhone';
import IconTwitter from '../components/Icon/IconTwitter';
import IconDribbble from '../components/Icon/IconDribbble';
import IconGithub from '../components/Icon/IconGithub';
import getApiUrl from '../../config';
import IconShoppingBag from '../components/Icon/IconShoppingBag';
import axios from 'axios';
import GridLoader from 'react-spinners/GridLoader';
import '../assets/css/app.css';

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

const Index = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUsdDate = localStorage.getItem('userData');
        const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

        // console.log('Documento', userDocumento);

        const apiURL = getApiUrl();

        dispatch(setPageTitle('SOLUCREDITO'));

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

                // foto guardada
                const foto_registro = `${apiURL}/uploads/registro/${fotoPerfilData.documento_guardar}`;

                console.log('foto: ', fotoPerfilData);
                console.log('completa: ', foto_registro);

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
                        TotalDisponible: Cupo_registrado,

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

    const isDark = useSelector((state: IRootState) => state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode);

    // const [apiData, setApiData] = useState<any>(null); // Puedes cambiar 'any' por el tipo adecuado para tus datos
    // Define el estado del formulario
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

    //Mi cupo
    const salesByCategory: any = {
        series: [
            parseInt(formData.TotalCupo) || parseInt(formData.TotalCupo) === 0 ? parseInt(formData.TotalCupo) : 0,
            parseInt(formData.TotalDisponible) || parseInt(formData.TotalDisponible) === 0 ? parseInt(formData.TotalDisponible) : 0,
        ],
        options: {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#D421E6'] : ['#e2a03f', '#127112', '#e7515a'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        // ... (otras configuraciones)
                        labels: {
                            show: true,
                            name: {
                                // ... (otras configuraciones)
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    // Aquí aplicamos el formato de número
                                    return new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(val);
                                },
                            },
                            total: {
                                show: true,
                                label: 'Total Cupo',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    const totalCupo = w.globals.seriesTotals.reduce((a: any, b: any) => a + 0);
                                    const formattedTotalCupo = new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(totalCupo || 0);

                                    return formattedTotalCupo;
                                },
                            },
                        },
                    },
                },
            },

            labels: ['Cupo', 'Disponible'],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
        },
    };

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
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
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/" className="text-primary hover:underline">
                        Usuario
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Perfil</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 gap-5 mb-5" style={{ gridTemplateRows: 'auto auto auto' }}>
                    {/* Mi cupo */}
                    <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Mi cupo</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                            </div>
                        </div>
                    </div>
                    {/* Perfil */}
                    <div className="panel h-full">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Perfil</h5>
                            <Link to="/forms/wizards/actualizar" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                                <IconPencilPaper />
                            </Link>
                        </div>
                        <div className="mb-5">
                            <div className="flex flex-col justify-center items-center">
                                <img src={formData.foto ? formData.foto : '/assets/images/clients/user.png'} alt="img" className="w-24 h-24 rounded-full object-cover mb-5" />
                                <p className="font-semibold text-primary text-xl">{formData.nombre || ''} </p>
                            </div>
                            <ul className="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark">
                                <li className="flex items-center gap-2">
                                    <IconCoffee className="shrink-0" />
                                    {formData.documento || ''}
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconCalendar className="shrink-0" />

                                    {/* Mostrar según el estado */}
                                    {formData.estado === 'EN ESTUDIO' && <span className="font-semibold text-xl text-gray-500">{formData.estado}</span>}

                                    {formData.estado === 'APROBADO' && <span className="font-semibold text-xl text-green-500">{formData.estado}</span>}

                                    {formData.estado === 'RECHAZADO' && <span className="font-semibold text-xl text-red-500">{formData.estado}</span>}
                                </li>

                                <li className="flex items-center gap-2">
                                    <IconMapPin className="shrink-0" />
                                    {formData.ciudad || ''}
                                </li>
                                <li>
                                    <button className="flex items-center gap-2">
                                        <IconMail className="w-5 h-5 shrink-0" />
                                        <span className="text-primary truncate"> {formData.email || ''}</span>
                                    </button>
                                </li>
                                <li className="flex items-center gap-2">
                                    <IconPhone />
                                    <span className="whitespace-nowrap" dir="ltr">
                                        {formData.telefono || ''}
                                    </span>
                                </li>
                            </ul>
                            <ul className="mt-7 flex items-center justify-center gap-2">
                                <li>
                                    <button className="btn btn-info flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconTwitter className="w-5 h-5" />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-danger flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconDribbble />
                                    </button>
                                </li>
                                <li>
                                    <button className="btn btn-dark flex items-center justify-center rounded-full w-10 h-10 p-0">
                                        <IconGithub />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Mis Creditos */}
                    <div className="panel h-full lg:h-auto">
                        <div className="mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Mis Créditos</h5>
                        </div>
                        <div className="space-y-4">
                            {/* <div className="border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid place-content-center w-9 h-9 rounded-md bg-secondary-light dark:bg-secondary text-secondary dark:text-secondary-light">
                                        <IconShoppingBag />
                                    </div>
                                    <div className="ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold">
                                        <h6 className="text-white-dark text-[13px] dark:text-white-dark">
                                            Income
                                            <span className="block text-base text-[#515365] dark:text-white-light">$92,600</span>
                                        </h6>
                                        <p className="ltr:ml-auto rtl:mr-auto text-secondary">90%</p>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid place-content-center w-9 h-9 rounded-md bg-info-light dark:bg-info text-info dark:text-info-light">
                                        <IconTag />
                                    </div>
                                    <div className="ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold">
                                        <h6 className="text-white-dark text-[13px] dark:text-white-dark">
                                            Profit
                                            <span className="block text-base text-[#515365] dark:text-white-light">$37,515</span>
                                        </h6>
                                        <p className="ltr:ml-auto rtl:mr-auto text-info">65%</p>
                                    </div>
                                </div>
                            </div> */}
                            <div className="border border-[#ebedf2] rounded dark:bg-[#1b2e4b] dark:border-0">
                                <div className="flex items-center justify-between p-4 py-2">
                                    <div className="grid place-content-center w-9 h-9 rounded-md bg-warning-light dark:bg-warning text-warning dark:text-warning-light">
                                        <IconCreditCard />
                                    </div>
                                    <div className="ltr:ml-4 rtl:mr-4 flex items-start justify-between flex-auto font-semibold">
                                        <h6 className="text-white-dark text-[13px] dark:text-white-dark">
                                            Credito express
                                            <span className="block text-base text-[#515365] dark:text-white-light">$0</span>
                                        </h6>
                                        <p className="ltr:ml-auto rtl:mr-auto text-warning">100%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid xl:grid-cols-3 gap-6 mb-6">
                    {/* <div className="panel h-full">
                        <div className="flex items-center mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Sales By Category</h5>
                        </div>
                        <div>
                            <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                                {loading ? (
                                    <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                        <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                    </div>
                                ) : (
                                    <ReactApexChart series={salesByCategory.series} options={salesByCategory.options} type="donut" height={460} />
                                )}
                            </div>

                            
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};
export default Index;
