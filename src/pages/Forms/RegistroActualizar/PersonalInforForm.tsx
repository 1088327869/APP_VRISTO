import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import Select from 'react-select';
import axios from 'axios';
import getApiUrl from '../../../../config';
import { Console } from 'console';
import Swal from 'sweetalert2';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';

// tomar documento
const storedUsdDate = localStorage.getItem('userData');
const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

const apiURL = getApiUrl();

interface Option {
    value: string;
    label: string;
}

// Define un tipo para representar la estructura de formData
interface FormData {
    nombre: string;
    apellido: string;
    fechaNacimiento: string;
    genero: string;
    tipoDocumento: string;
    documento: string;
    fechaExpedicion: string;
    celular: string;
    email: string;
    estadoCivil: string;
    direccionResidencial: string;
    barrio: string;
    ciudad: string;
    tipoVivienda: string;
    telResidencia: string;
}

interface FormData {
    // Define las propiedades específicas de formData2
    tipoDocumento: string;
    fechaNacimiento: string;
    fechaExpedicion: string;
    // Agrega otras propiedades según sea necesario
}
const PersonalInfoForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
    const [loading, setLoading] = useState(false);
    const [documentTypeOptions, setDocumentTypeOptions] = useState<Option[]>([]);
    const [cityOptions, setCityOptions] = useState<Option[]>([]);
    const [apiData, setApiData] = useState<any>(null); // Puedes cambiar 'any' por el tipo adecuado para tus datos
    const [options5, setOptions5] = useState<Option[]>([
        { value: 'PROPIA', label: 'Propia' },
        { value: 'ALQUILADA', label: 'Alquilada' },
        { value: 'FAMILIAR', label: 'Familiar' },
    ]);

    // Efecto para realizar la llamada a la API al montar el componente

    // Agrega la definición de errorMessages
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Marcamos el inicio del área de loading
                setLoading(true);
                const response = await axios.post(`${apiURL}/api/infoRegistro`, {
                    userDocumento: userDocumento,
                });

                // Almacena los datos de la API en el estado
                setApiData(response.data);

                // Accede a los datos después de la respuesta exitosa
                const nombre_registro = response.data.nombre;
                const apellido_registro = response.data.apellido;
                const telefono_registro = response.data.telefono;
                const email_registro = response.data.email;

                // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        nombre: nombre_registro,
                        apellido: apellido_registro,
                        celular: telefono_registro,
                        email: email_registro,
                        // Otras propiedades no se afectan
                    };
                });
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        };

        const datosPersonal = async () => {
            try {
                const response = await axios.post(`${apiURL}/api/infoDatosPersonal`, {
                    userDocumento: userDocumento,
                });

                // Almacena los datos de la API en el estado
                setApiData(response.data);

                // Imprime los datos en la consola
                // console.log('Datos de la API personal:', response.data);

                // Accede a los datos después de la respuesta exitosa

                const tipoDocumento = response.data.tipoDocumento;
                const fechaNacimiento = response.data.fecha_nacimiento;
                const fecha_expedicion = response.data.fecha_expedicion;

                // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        tipoDocumento: tipoDocumento,
                        fechaNacimiento: fechaNacimiento,
                        fechaExpedicion: fecha_expedicion,
                        // Otras propiedades no se afectan
                    };
                });
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        };

        const datosContacto = async () => {
            try {
                const response = await axios.post(`${apiURL}/api/infoContactotraer`, {
                    userDocumento: userDocumento,
                });

                // Almacena los datos de la API en el estado
                setApiData(response.data);

                // Imprime los datos en la consola
                // console.log('Datos de la API personal:', response.data);

                // Accede a los datos después de la respuesta exitosa
                const generoD = response.data.genero;
                const estadoCivil = response.data.estado_civil;
                const direccionD = response.data.direccion;
                const barrioD = response.data.barrio;
                const ciudadD = response.data.ciudad;
                const tipo_vivienda = response.data.tipo_vivienda;
                const telefono_residencial = response.data.telefono_residencial;

                // Actualiza el estado formData con los datos de la API
                setFormData((prevData) => {
                    return {
                        ...prevData,
                        // solo actualiza las propiedades necesarias y deja el resto sin cambios
                        genero: generoD,
                        estadoCivil: estadoCivil,
                        direccionResidencial: direccionD,
                        barrio: barrioD,
                        ciudad: ciudadD,
                        tipoVivienda: tipo_vivienda,
                        telResidencia: telefono_residencial,
                    };
                });
            } catch (error) {
                console.error('Error al obtener datos de la API:', error);
            }
        };

        const fetchDocumentTypeOptions = async () => {
            try {
                const response = await axios.get(`${apiURL}/api/tipoDocumento`);
                const options: Option[] = response.data.map((result: any) => ({
                    value: result.value,
                    label: result.label,
                }));
                setDocumentTypeOptions(options);
            } catch (error) {
                console.error('Error al obtener opciones de tipo de documento:', error);
            }
        };

        const fetchCityOptions = async () => {
            try {
                const response = await axios.get(`${apiURL}/api/consultaCiudad`);
                const options: Option[] = response.data;
                setCityOptions(options);
            } catch (error) {
                // Marcamos el final del área de loading
                setLoading(false);
                console.error('Error al obtener opciones de ciudades y departamentos:', error);
            }
            // Marcamos el final del área de loading
            setLoading(false);
        };

        // Llamar a las funciones de carga de opciones al montar el componente
        fetchData();
        datosPersonal();
        datosContacto();
        fetchDocumentTypeOptions();
        fetchCityOptions();
    }, [apiURL, userDocumento]);

    const options1: Option[] = [
        { value: 'FEMENINA', label: 'Femenina' },
        { value: 'MASCULINO', label: 'Masculino' },
    ];

    const options3: Option[] = [
        { value: 'SOLTERO', label: 'Soltero' },
        { value: 'CASADO', label: 'Casado' },
        { value: 'UNION LIBRE', label: 'Unión libre' },
        { value: 'SEPARADO', label: 'Separado' },
    ];

    const [formData, setFormData] = useState<FormData>({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        genero: '',
        tipoDocumento: '',
        documento: userDocumento,
        fechaExpedicion: '',
        celular: '',
        email: '',
        estadoCivil: '',
        direccionResidencial: '',
        barrio: '',
        ciudad: '',
        tipoVivienda: '',
        telResidencia: '',
    });

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        const requiredFields: Array<keyof FormData> = [
            'nombre',
            'apellido',
            'fechaNacimiento',
            'genero',
            'tipoDocumento',
            'documento',
            'fechaExpedicion',
            'celular',
            'email',
            'estadoCivil',
            'direccionResidencial',
            'barrio',
            'ciudad',
            'tipoVivienda',
        ];

        const emptyFields = requiredFields.filter((field) => !formData[field]);

        if (emptyFields.length > 0) {
            // Mostrar mensajes de error para los campos vacíos

            setErrorMessages(emptyFields.map((field) => `El campo ${field} es obligatorio`));

            // Resaltar visualmente los campos vacíos en rojo
            emptyFields.forEach((field) => {
                const inputElement = document.getElementById(field);
                if (inputElement) {
                    // inputElement.classList.add('border-red-500'); // Agregar la clase para resaltar en rojo
                }
            });

            return;
        }
        // console.log('formData:', formData);

        try {
            // Realizar la solicitud si todos los campos están llenos
            // Marcamos el inicio del área de loading
            setLoading(true);

            Swal.fire({
                title: 'Información personal',
                text: 'Los datos se han actualizado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545', // Color rojo
                timer: 4000,
            });

            await axios.patch(`${apiURL}/api/actualizaInfoPersonal`, {
                nombre: formData.nombre,
                apellido: formData.apellido,
                tipoDocumento: formData.tipoDocumento,
                documento: formData.documento,
                fechaNacimiento: formData.fechaNacimiento,
                fechaExpedicion: formData.fechaExpedicion,
                telefono: formData.celular,
                email: formData.email,
            });

            await axios.patch(`${apiURL}/api/actualizaInfoContacto`, {
                documento: formData.documento,
                genero: formData.genero,
                celular: formData.celular,
                email: formData.email,
                estadoCivil: formData.estadoCivil,
                direccionResidencial: formData.direccionResidencial,
                barrio: formData.barrio,
                ciudad: formData.ciudad,
                tipoVivienda: formData.tipoVivienda,
                telResidencia: formData.telResidencia,
            });

            console.log('Informacion personal actualizada');
            // Marcamos el final del área de loading

            // Swal.fire({
            //     title: 'Información personal',
            //     text: 'Datos guardados con éxito',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar',
            //     confirmButtonColor: '#dc3545', // Color rojo
            //     timer: 4000,
            // });

            // await axios.post(`${apiURL}/api/infpersonal`, {
            //     nombre: formData.nombre,
            //     apellido: formData.apellido,
            //     tipoDocumento: formData.tipoDocumento,
            //     documento: formData.documento,
            //     fechaNacimiento: formData.fechaNacimiento,
            //     fechaExpedicion: formData.fechaExpedicion,
            // });

            // await axios.post(`${apiURL}/api/infoContacto`, {
            //     documento: formData.documento,
            //     genero: formData.genero,
            //     celular: formData.celular,
            //     email: formData.email,
            //     estadoCivil: formData.estadoCivil,
            //     direccionResidencial: formData.direccionResidencial,
            //     barrio: formData.barrio,
            //     ciudad: formData.ciudad,
            //     tipoVivienda: formData.tipoVivienda,
            //     telResidencia: formData.telResidencia,
            // });

            // console.log('Informacion personal guardada');

            // Marcamos el final del área de loading
            setLoading(false);

            // Luego de enviar ambos conjuntos de datos, avanzas a la siguiente pestaña
            onNext();
        } catch (error) {
            // actualizar datos

            // Swal.fire({
            //     title: 'Información personal',
            //     text: 'Los datos se han actualizado correctamente.',
            //     icon: 'success',
            //     confirmButtonText: 'Aceptar',
            //     confirmButtonColor: '#dc3545', // Color rojo
            //     timer: 4000,
            // });

            // await axios.patch(`${apiURL}/api/actualizaInfoPersonal`, {
            //     nombre: formData.nombre,
            //     apellido: formData.apellido,
            //     tipoDocumento: formData.tipoDocumento,
            //     documento: formData.documento,
            //     fechaNacimiento: formData.fechaNacimiento,
            //     fechaExpedicion: formData.fechaExpedicion,
            //     telefono: formData.celular,
            //     email: formData.email,
            // });

            // await axios.patch(`${apiURL}/api/actualizaInfoContacto`, {
            //     documento: formData.documento,
            //     genero: formData.genero,
            //     celular: formData.celular,
            //     email: formData.email,
            //     estadoCivil: formData.estadoCivil,
            //     direccionResidencial: formData.direccionResidencial,
            //     barrio: formData.barrio,
            //     ciudad: formData.ciudad,
            //     tipoVivienda: formData.tipoVivienda,
            //     telResidencia: formData.telResidencia,
            // });

            // console.log('Informacion personal actualizada');
            // Marcamos el final del área de loading
            setLoading(false);

            onNext();
            // Manejar el error según tus necesidades
            // console.error('Error al enviar datos:', error);
        }
        // Marcamos el final del área de loading
        setLoading(false);
    };

    // console.log('formData.ciudad:', formData.ciudad);
    // console.log('cityOptions:', cityOptions);

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
            <form onSubmit={handleSubmit} className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            placeholder="Nombre"
                            className={`form-input form-input-lg ${errorMessages.includes('nombre') && 'border-red-500'}`}
                            value={formData.nombre}
                            onChange={(e) => handleChange('nombre', e.target.value)}
                            readOnly // Hace que el campo sea de solo lectura
                            style={{ backgroundColor: '#f0f0f0', color: '#666' }} // Aplica estilos de color gris
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="apellido">Apellido</label>
                        <input
                            type="text"
                            id="apellido"
                            name="apellido"
                            placeholder="Apellido"
                            className="form-input form-input-lg"
                            value={formData.apellido}
                            onChange={(e) => handleChange('apellido', e.target.value)}
                            readOnly // Hace que el campo sea de solo lectura
                            style={{ backgroundColor: '#f0f0f0', color: '#666' }} // Aplica estilos de color gris
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                        <Flatpickr
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            options={{ dateFormat: 'Y-m-d', enableTime: false }}
                            className="form-input form-input-lg"
                            onChange={(date) => handleChange('fechaNacimiento', date[0] instanceof Date ? date[0].toISOString().split('T')[0] : '')}
                            // required
                            readOnly // Hace que el campo sea de solo lectura
                            style={{ backgroundColor: '#f0f0f0', color: '#666' }} // Aplica estilos de color gris
                        />
                    </div>
                    {/* <div>
                        <label>Género</label>
                        <Select
                            value={options1.find((option) => option.value === formData.genero) || null}
                            options={options1}
                            isSearchable={true}
                            onChange={(selectedOption) => handleChange('genero', selectedOption ? selectedOption.value : '')}
                        />
                    </div> */}

                    {/* <div>
                        <label>Tipo de Documento</label>
                        <Select
                            value={documentTypeOptions.find((option) => option.value === formData.tipoDocumento) || null}
                            options={documentTypeOptions}
                            isSearchable={true}
                            onChange={(selectedOption) => handleChange('tipoDocumento', selectedOption ? selectedOption.value : '')}
                            
                        />
                    </div> */}
                    <div>
                        <label htmlFor="documento">Documento</label>
                        <input
                            type="text"
                            id="documento"
                            name="documento"
                            placeholder="Documento"
                            className="form-input form-input-lg"
                            value={formData.documento}
                            onChange={(e) => handleChange('documento', e.target.value)}
                            pattern="[0-9]*" // Permite solo dígitos
                            title="Este campo solo debe contener números"
                            readOnly // Hace que el campo sea de solo lectura
                            style={{ backgroundColor: '#f0f0f0', color: '#666' }} // Aplica estilos de color gris
                        />
                    </div>

                    {/* <div>
                        <label htmlFor="expedicion">Fecha de Expedición</label>
                        <Flatpickr
                            id="expedicion"
                            name="expedicion"
                            value={formData.fechaExpedicion}
                            options={{ dateFormat: 'Y-m-d', enableTime: false }}
                            className="form-input form-input-lg"
                            onChange={(date) => handleChange('fechaExpedicion', date[0] instanceof Date ? date[0].toISOString().split('T')[0] : '')}
                            // required
                        />
                    </div> */}
                    <div>
                        <label htmlFor="celular">Celular</label>
                        <input
                            type="text"
                            id="celular"
                            name="celular"
                            placeholder="Celular"
                            className="form-input form-input-lg"
                            value={formData.celular}
                            onChange={(e) => handleChange('celular', e.target.value)}
                            pattern="[0-9]*" // Permite solo dígitos
                            title="Este campo solo debe contener números"
                            readOnly // Hace que el campo sea de solo lectura
                            style={{ backgroundColor: '#f0f0f0', color: '#666' }} // Aplica estilos de color gris
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="form-input form-input-lg"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                            title="Ingrese una dirección de correo electrónico válida"
                            // required
                        />
                    </div>
                    <div>
                        <label>Estado Civil</label>
                        <Select
                            value={options3.find((option) => option.value === formData.estadoCivil) || null}
                            options={options3}
                            isSearchable={true}
                            onChange={(selectedOption) => handleChange('estadoCivil', selectedOption ? selectedOption.value : '')}
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="direccionResidencial">Dirección Residencial</label>
                        <input
                            type="text"
                            id="direccionResidencial"
                            name="direccionResidencial"
                            placeholder="Dirección Residencial"
                            className="form-input form-input-lg"
                            value={formData.direccionResidencial}
                            onChange={(e) => handleChange('direccionResidencial', e.target.value)}
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="barrio">Barrio</label>
                        <input
                            type="text"
                            id="barrio"
                            name="barrio"
                            placeholder="Barrio"
                            className="form-input form-input-lg"
                            value={formData.barrio}
                            onChange={(e) => handleChange('barrio', e.target.value)}
                            // required
                        />
                    </div>
                    <div>
                        <label>Ciudad</label>
                        <Select
                            value={cityOptions.find((option) => formData.ciudad.includes(option.value)) || null}
                            options={cityOptions}
                            isSearchable={true}
                            onChange={(selectedOption) => handleChange('ciudad', selectedOption ? selectedOption.value : '')}
                            // required
                        />
                    </div>

                    <div>
                        <label>Tipo de Vivienda</label>

                        <Select
                            value={options5.find((option) => formData.tipoVivienda.includes(option.value)) || null}
                            options={options5}
                            isSearchable={true}
                            onChange={(selectedOption) => handleChange('tipoVivienda', selectedOption ? selectedOption.value : '')}
                            // required
                        />
                    </div>
                    <div>
                        <label htmlFor="telResidencia">Teléfono Residencial</label>
                        <input
                            type="text"
                            id="telResidencia"
                            name="telResidencia"
                            placeholder="Teléfono Residencial"
                            className="form-input form-input-lg"
                            value={formData.telResidencia}
                            onChange={(e) => handleChange('telResidencia', e.target.value)}
                            pattern="[0-9]*" // Permite solo dígitos
                            title="Este campo solo debe contener números"
                        />
                    </div>
                </div>
                <br />
                <div className="mt-4 flex justify-end">
                    <button type="submit" className="btn btn-primary mr-2">
                        Siguiente
                    </button>
                </div>
            </form>

            {errorMessages.length > 0 && (
                <ul className="text-red-500">
                    {errorMessages.map((message, index) => (
                        <li key={index}>{message}</li>
                    ))}
                </ul>
                //                 <ul className="text-red-500">
                //     {errorMessages[0].split('\n').map((message, index) => (
                //         <li key={index}>{message}</li>
                //     ))}
                // </ul>
            )}
        </div>
    );
};

export default PersonalInfoForm;
