import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import getApiUrl from '../../../../config';
import Swal from 'sweetalert2';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';

const storedUsdDate = localStorage.getItem('userData');
const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

// Define el tipo para el estado del formulario
interface FormData {
    documento: number;
    empresa: string;
    actividadEconomica: string;
    celular: string;
    direccion: string;
    rangoSalarial: string;
    banco: string;
    tipoCuenta: string;
    numeroCuenta: string;
}

// Define el tipo para las opciones del banco
interface BankOption {
    value: string;
    label: string;
}

const apiURL = getApiUrl();

const options1 = [
    { value: 'EMPLEADO', label: 'Empleado' },
    { value: 'INDEPENDIENTE', label: 'Independiente' },
    { value: 'ESTUDIANTE', label: 'Estudiante' },
    { value: 'AMA DE CASA', label: 'Ama de casa' },
    { value: 'PENSIONADO', label: 'Pensionado' },
];

const options3 = [
    { value: 'AHORROS', label: 'AHORROS' },
    { value: 'CORRIENTE', label: 'CORRIENTE' },
];

interface LaboralInfoFormProps {
    onNext: () => void;
}
// ... (importaciones y definiciones de tipos)

const LaboralInfoForm: React.FC<LaboralInfoFormProps> = ({ onNext }) => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<any>(null); // Puedes cambiar 'any' por el tipo adecuado para tus datos
    const [formData, setFormData] = useState<FormData>({
        documento: userDocumento,
        empresa: '',
        actividadEconomica: '',
        celular: '',
        direccion: '',
        rangoSalarial: '',
        banco: '',
        tipoCuenta: '',
        numeroCuenta: '',
    });

    const [bankOptions, setBankOptions] = useState<BankOption[]>([]);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${apiURL}/api/infoLaboralDato`, {
                    userDocumento: userDocumento,
                });

                // Almacena los datos de la API en el estado
                setApiData(response.data);

                // Imprime los datos en la consola
                // console.log('Datos de la API us: ', response.data);

                // Accede a los datos después de la respuesta exitosa
                const nombre_registro = response.data.empresa;
                const apellido_registro = response.data.actividadEconomica;
                const telefono_registro = response.data.telefono;

                // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        empresa: nombre_registro,
                        actividadEconomica: apellido_registro,
                        celular: telefono_registro,

                        // Otras propiedades no se afectan
                    };
                });
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        };

        const datosPersonal = async () => {
            try {
                const response = await axios.post(`${apiURL}/api/infoBancoDato`, {
                    userDocumento: userDocumento,
                });

                // Almacena los datos de la API en el estado
                setApiData(response.data);
                // console.log('registro banco', response.data);
                // Imprime los datos en la consola
                // console.log('Datos de la API personal:', response.data);

                // Accede a los datos después de la respuesta exitosa

                const tipoDocumento = response.data.banco;
                const fechaNacimiento = response.data.tipoCuenta;
                const fecha_expedicion = response.data.numeroCuenta;

                // // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        banco: tipoDocumento,
                        tipoCuenta: fechaNacimiento,
                        numeroCuenta: fecha_expedicion,
                        // Otras propiedades no se afectan
                    };
                });
            } catch (error) {}
        };

        // Consultar la API para obtener las opciones de banco
        const fetchBankOptions = async () => {
            try {
                const response = await axios.get(`${apiURL}/api/consultarBanco`);
                // Mapear la respuesta de la API a las opciones requeridas
                const mappedOptions = response.data.map((bank: any) => ({
                    value: bank.value,
                    label: bank.label,
                }));
                setBankOptions(mappedOptions);
            } catch (error) {
                console.error('Error al obtener opciones de banco:', error);
            }
        };
        fetchData();
        datosPersonal();
        fetchBankOptions();
    }, []); // La dependencia vacía asegura que esta solicitud se realice solo una vez al montar el componente

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Validar que todos los campos estén llenos
        const requiredFields: (keyof FormData)[] = ['empresa', 'actividadEconomica', 'celular', 'banco', 'tipoCuenta', 'numeroCuenta'];

        const emptyFields = requiredFields.filter((field) => !formData[field]);

        if (emptyFields.length > 0) {
            // Mostrar mensajes de error para los campos vacíos
            setErrorMessages(emptyFields.map((field) => `El campo ${field} es obligatorio`));
            return;
        }

        try {
            // Marcamos el inicio del área de loading
            setLoading(true);

            Swal.fire({
                title: 'Información laboral y bancaria',
                text: 'Datos guardados con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545', // Color rojo
                timer: 4000,
            });

            await axios.patch(`${apiURL}/api/actualizaInfoEmpresa/`, {
                documento: formData.documento,
                empresa: formData.empresa,
                actividadEconomica: formData.actividadEconomica,
                celular: formData.celular,
            });

            await axios.patch(`${apiURL}/api/actualizaInfoBanco/`, {
                documento: formData.documento,
                banco: formData.banco,
                tipoCuenta: formData.tipoCuenta,
                numeroCuenta: formData.numeroCuenta,
            });

            console.log('Información laboral y bancaria actualizada');

            // Swal.fire({
            //     title: 'Información laboral y bancaria',
            //     text: 'Los datos se han guardado con éxito.',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar',
            //     confirmButtonColor: '#dc3545', // Color rojo
            //     timer: 4000,
            // });

            // await axios.post(`${apiURL}/api/infoEmpresa`, {
            //     documento: formData.documento,
            //     empresa: formData.empresa,
            //     actividadEconomica: formData.actividadEconomica,
            //     celular: formData.celular,
            // });

            // await axios.post(`${apiURL}/api/infoBanco`, {
            //     documento: formData.documento,
            //     banco: formData.banco,
            //     tipoCuenta: formData.tipoCuenta,
            //     numeroCuenta: formData.numeroCuenta,
            // });

            // console.log('Información laboral y bancaria guardada');
            // Marcamos el final del área de loading
            setLoading(false);

            onNext();
        } catch (error) {
            // Swal.fire({
            //     title: 'Información laboral y bancaria',
            //     text: 'Datos guardados con éxito',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar',
            //     confirmButtonColor: '#dc3545', // Color rojo
            //     timer: 4000,
            // });

            // await axios.patch(`${apiURL}/api/actualizaInfoEmpresa/`, {
            //     documento: formData.documento,
            //     empresa: formData.empresa,
            //     actividadEconomica: formData.actividadEconomica,
            //     celular: formData.celular,
            // });

            // await axios.patch(`${apiURL}/api/actualizaInfoBanco/`, {
            //     documento: formData.documento,
            //     banco: formData.banco,
            //     tipoCuenta: formData.tipoCuenta,
            //     numeroCuenta: formData.numeroCuenta,
            // });

            // console.log('Información laboral y bancaria actualizada');

            // Marcamos el final del área de loading
            setLoading(false);

            onNext();
            // console.error('Error al enviar datos:', error);
        }
        // Marcamos el final del área de loading
        setLoading(false);
    };

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-content">
                        <GridLoader size={20} color="#C15E56" />
                        <p>Cargando...</p>
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="empresa">Empresa</label>
                        <input
                            type="text"
                            id="empresa"
                            name="empresa"
                            placeholder="Empresa"
                            className={`form-input form-input-lg ${errorMessages.includes('empresa') && 'border-red-500'}`}
                            value={formData.empresa}
                            onChange={(e) => handleChange('empresa', e.target.value)}
                            // required
                        />
                    </div>
                    <div>
                        <label>Actividad económica</label>
                        <Select
                            value={options1.find((option) => formData.actividadEconomica.includes(option.value)) || null}
                            options={options1}
                            isSearchable={true}
                            className={`select-input ${errorMessages.includes('actividadEconomica') && 'border-red-500'}`}
                            onChange={(selectedOption) => handleChange('actividadEconomica', selectedOption ? selectedOption.value : '')}
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="celular">Telefono empresa</label>
                        <input
                            type="text"
                            id="celular"
                            name="celular"
                            placeholder="Telefono empresa"
                            className={`form-input form-input-lg ${errorMessages.includes('celular') && 'border-red-500'}`}
                            value={formData.celular}
                            onChange={(e) => handleChange('celular', e.target.value)}
                            pattern="[0-9]*" // Permite solo dígitos
                            title="Este campo solo debe contener números"
                            // required
                        />
                    </div>
                    {/* Agrega más campos según tus necesidades */}
                </div>
                <br />
                <h2>
                    <strong>CUENTA BANCARIA</strong>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    <div>
                        <label>Banco</label>
                        <Select
                            value={bankOptions.find((option) => formData.banco.includes(option.value)) || null}
                            options={bankOptions}
                            isSearchable={true}
                            className={`select-input ${errorMessages.includes('banco') && 'border-red-500'}`}
                            onChange={(selectedOption) => handleChange('banco', selectedOption ? selectedOption.value : '')}
                            // required
                        />
                    </div>

                    <div>
                        <label>Tipo cuenta</label>
                        <Select
                            value={options3.find((option) => formData.tipoCuenta.includes(option.value)) || null}
                            options={options3}
                            isSearchable={true}
                            className={`select-input ${errorMessages.includes('tipoCuenta') && 'border-red-500'}`}
                            onChange={(selectedOption) => handleChange('tipoCuenta', selectedOption ? selectedOption.value : '')}
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="numeroCuenta">Número de Cuenta</label>
                        <input
                            type="text"
                            id="numeroCuenta"
                            name="numeroCuenta"
                            placeholder="Número de Cuenta"
                            className={`form-input form-input-lg ${errorMessages.includes('numeroCuenta') && 'border-red-500'}`}
                            value={formData.numeroCuenta}
                            onChange={(e) => handleChange('numeroCuenta', e.target.value)}
                            pattern="[0-9]*" // Permite solo dígitos
                            title="Este campo solo debe contener números"
                            // required
                        />
                    </div>
                    {/* Agrega más campos según tus necesidades */}
                </div>

                <div className="mt-4 flex justify-end">
                    <button type="submit" className="btn btn-primary mr-2">
                        Siguiente
                    </button>
                </div>
                {errorMessages.length > 0 && (
                    <ul className="text-red-500">
                        {errorMessages.map((message, index) => (
                            <li key={index}>{message}</li>
                        ))}
                    </ul>
                )}
            </form>
        </div>
    );
};
export default LaboralInfoForm;
