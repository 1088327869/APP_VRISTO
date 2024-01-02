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
import IconCaretDown from '../components/Icon/IconCaretDown';
import AnimateHeight from 'react-animate-height';
import IconAirplay from '../components/Icon/IconAirplay';

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

const Index = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [creditos, setCreditos] = useState([]);

  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const storedUsdDate = localStorage.getItem('userData');
  const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

  dispatch(setPageTitle('SOLUCREDITO'));

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
      <div>
        <h1>pagina de inicio de solucredito</h1>
      </div>
    </div>
  );
};
export default Index;
