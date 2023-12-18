import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import getApiUrl from '../../../../config';
import Swal from 'sweetalert2';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';
// tomar documento
const storedUsdDate = localStorage.getItem('userData');
const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

// Define el tipo para el estado del formulario
interface FormData {
    documento: number;
    nombreFamiliar: string;
    parentescoFamiliar: string;
    celularFamiliar: string;
    nombrePersonal: string;
    parentescoPersonal: string;
    celularPersonal: string;
}

const apiURL = getApiUrl();

const options1 = [
    { value: 'PADRE', label: 'PADRE' },
    { value: 'MADRE', label: 'MADRE' },
    { value: 'ESPOSO', label: 'ESPOS@' },
    { value: 'HIJO', label: 'HIJ@' },
    { value: 'HERMANO', label: 'HERMAN@' },
    { value: 'OTRO', label: 'OTRO' },
];

const options2 = [
    { value: 'AMIGO', label: 'AMIG@' },
    { value: 'COLEGA', label: 'COLEGA DE TRABAJO' },
    { value: 'OTRO', label: 'OTRO' },
];

interface ReferencesFormProps {
    onNext: () => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({ onNext }) => {
    const [loading, setLoading] = useState(false);
    const [apiData, setApiData] = useState<any>(null); // Puedes cambiar 'any' por el tipo adecuado para tus datos
    const [formData, setFormData] = useState<FormData>({
        documento: userDocumento,
        nombreFamiliar: '',
        parentescoFamiliar: '',
        celularFamiliar: '',
        nombrePersonal: '',
        parentescoPersonal: '',
        celularPersonal: '',
    });

    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        const requiredFields: (keyof FormData)[] = ['nombreFamiliar', 'parentescoFamiliar', 'celularFamiliar', 'nombrePersonal', 'parentescoPersonal', 'celularPersonal'];

        const emptyFields = requiredFields.filter((field) => !formData[field]);

        if (emptyFields.length > 0) {
            // Mostrar mensajes de error para los campos vacíos
            setErrorMessages(emptyFields.map((field) => `El campo ${field} es obligatorio`));
            return;
        }

        try {
            // Swal.fire({
            //     title: 'Información de referencia',
            //     text: 'Datos guardados con éxito',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar',
            //     confirmButtonColor: '#dc3545', // Color rojo
            //     timer: 4000,
            // });

            // Marcamos el inicio del área de loading
            setLoading(true);

            Swal.fire({
                title: 'Información de referencia',
                text: 'Los datos se han actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545', // Color rojo
                timer: 4000,
            });

            await axios.patch(`${apiURL}/api/actualizaInfoReferencias/`, {
                documento: formData.documento,
                nombreFamiliar: formData.nombreFamiliar,
                parentescoFamiliar: formData.parentescoFamiliar,
                celularFamiliar: formData.celularFamiliar,
                nombrePersonal: formData.nombrePersonal,
                parentescoPersonal: formData.parentescoPersonal,
                celularPersonal: formData.celularPersonal,
            });

            console.log('Información de referencias actualizado');

            // await axios.post(`${apiURL}/api/infoReferencias`, {
            //     documento: formData.documento,
            //     nombreFamiliar: formData.nombreFamiliar,
            //     parentescoFamiliar: formData.parentescoFamiliar,
            //     celularFamiliar: formData.celularFamiliar,
            //     nombrePersonal: formData.nombrePersonal,
            //     parentescoPersonal: formData.parentescoPersonal,
            //     celularPersonal: formData.celularPersonal,
            // });

            // console.log('Información de referencias guardada');
            // Luego de enviar los datos, avanzar a la siguiente pestaña

            // Marcamos el final del área de loading
            setLoading(false);

            onNext();
        } catch (error) {
            // Swal.fire({
            //     title: 'Información de referencia',
            //     text: 'Los datos se han actualizado correctamente.',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar',
            //     confirmButtonColor: '#dc3545', // Color rojo
            //     timer: 4000,
            // });

            // await axios.patch(`${apiURL}/api/actualizaInfoReferencias/`, {
            //     documento: formData.documento,
            //     nombreFamiliar: formData.nombreFamiliar,
            //     parentescoFamiliar: formData.parentescoFamiliar,
            //     celularFamiliar: formData.celularFamiliar,
            //     nombrePersonal: formData.nombrePersonal,
            //     parentescoPersonal: formData.parentescoPersonal,
            //     celularPersonal: formData.celularPersonal,
            // });

            // console.log('Información de referencias actualizado');
            // Luego de enviar los datos, avanzar a la siguiente pestaña
            // Marcamos el final del área de loading
            setLoading(false);

            onNext();
            // console.error('Error al enviar datos:', error);
            // Manejar el error según tus necesidades
        }
        // Marcamos el final del área de loading
        setLoading(false);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);

                const response = await axios.post(`${apiURL}/api/infoReferenicasDato`, {
                    userDocumento: userDocumento,
                });

                // Almacena los datos de la API en el estado
                setApiData(response.data);

                // Imprime los datos en la consola
                // console.log('Datos de la API us: ', response.data);

                // Accede a los datos después de la respuesta exitosa
                const nombreFamiliar_datos = response.data.nombreFamiliar;
                const parentescoFamiliar_datos = response.data.parentescoFamiliar;
                const telefonoFamiliar_datos = response.data.telefonoFamiliar;
                // informacion  personal
                const nombrePersonal_datos = response.data.nombrePersonal;
                const parentescoPersonal_datos = response.data.parentescoPersonal;
                const telefonoPersonal_datos = response.data.telefonoPersonal;
                // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        nombreFamiliar: nombreFamiliar_datos,
                        parentescoFamiliar: parentescoFamiliar_datos,
                        celularFamiliar: telefonoFamiliar_datos,

                        nombrePersonal: nombrePersonal_datos,
                        parentescoPersonal: parentescoPersonal_datos,
                        celularPersonal: telefonoPersonal_datos,

                        // Otras propiedades no se afectan
                    };
                });
                // Marcamos el final del área de loading
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
                // Marcamos el final del área de loading
                setLoading(false);
            }
        };

        // Verificar si el formulario está completo
        const isFormComplete = Object.values(formData).every((value) => value !== '');
        if (isFormComplete) {
            console.log('El formulario está completo');
        } else {
            // console.log('El formulario no está completo');
        }

        // Llamada a fetchData solo cuando cambia userDocumento
        fetchData();
    }, [userDocumento]);

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
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="nombreFamiliar">Nombre Familiar</label>
                        <input
                            type="text"
                            id="nombreFamiliar"
                            name="nombreFamiliar"
                            placeholder="Nombre Familiar"
                            className="form-input form-input-lg"
                            value={formData.nombreFamiliar}
                            onChange={(e) => handleChange('nombreFamiliar', e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Parentesco Familiar</label>
                        <Select
                            value={options1.find((option) => formData.parentescoFamiliar.includes(option.value)) || null}
                            options={options1}
                            isSearchable={false}
                            onChange={(selectedOption) => handleChange('parentescoFamiliar', selectedOption ? selectedOption.value : '')}
                        />
                    </div>

                    <div>
                        <label htmlFor="celularFamiliar">Celular Familiar</label>
                        <input
                            type="text"
                            id="celularFamiliar"
                            name="celularFamiliar"
                            placeholder="Celular Familiar"
                            className="form-input form-input-lg"
                            value={formData.celularFamiliar}
                            onChange={(e) => handleChange('celularFamiliar', e.target.value)}
                            minLength={6}
                        />
                    </div>

                    {/* Agrega más campos según tus necesidades */}
                </div>
                <br />
                <h2>Referencia personal</h2>
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="nombrePersonal">Nombre Personal</label>
                        <input
                            type="text"
                            id="nombrePersonal"
                            name="nombrePersonal"
                            placeholder="Nombre Personal"
                            className="form-input form-input-lg"
                            value={formData.nombrePersonal}
                            onChange={(e) => handleChange('nombrePersonal', e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Parentesco Personal</label>
                        <Select
                            value={options2.find((option) => formData.parentescoPersonal.includes(option.value)) || null}
                            options={options2}
                            isSearchable={true}
                            onChange={(selectedOption) => handleChange('parentescoPersonal', selectedOption ? selectedOption.value : '')}
                        />
                    </div>

                    <div>
                        <label htmlFor="celularPersonal">Celular Personal</label>
                        <input
                            type="text"
                            id="celularPersonal"
                            name="celularPersonal"
                            placeholder="Celular Personal"
                            className="form-input form-input-lg"
                            value={formData.celularPersonal}
                            onChange={(e) => handleChange('celularPersonal', e.target.value)}
                            minLength={6}
                        />
                    </div>
                    {/* Agrega más campos según tus necesidades */}
                </div>

                <br />
                <div className="mt-4 flex justify-end">
                    {/* <button type="button" className="btn btn-primary mr-2" onClick={onNext}>
                    Atras
                </button> */}
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

export default ReferencesForm;
