import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import getApiUrl from '../../../../config';
import Swal from 'sweetalert2';
import GridLoader from 'react-spinners/GridLoader';
import '../../../assets/css/app.css';

const storedUsdDate = localStorage.getItem('userData');
const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

const apiURL = getApiUrl();

interface ImageFormProps {
    onNext: () => void;
}

const ImageForm: React.FC<ImageFormProps> = ({ onNext }) => {
    const [loading, setLoading] = useState(false);
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [file3, setFile3] = useState<File | null>(null);
    const [apiData, setApiData] = useState<any>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [selectedImageUrls, setSelectedImageUrls] = useState<Array<string | null>>([null, null, null]);

    const navigate = useNavigate();

    const handleFileSelectionClick = (index: number) => {
        const fileInput = document.getElementById(`file${index}`) as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleFileChange = (index: number, file: File | null) => {
        switch (index) {
            case 1:
                setFile1(file);
                break;
            case 2:
                setFile2(file);
                break;
            case 3:
                setFile3(file);
                break;
            default:
                break;
        }

        if (!file) {
            const updatedImageUrls = [...selectedImageUrls];
            updatedImageUrls[index - 1] = null;
            setSelectedImageUrls(updatedImageUrls);
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const updatedImageUrls = [...selectedImageUrls];
            updatedImageUrls[index - 1] = reader.result as string;
            setSelectedImageUrls(updatedImageUrls);
        };
        reader.readAsDataURL(file);

        // Validar el tamaño y tipo de archivo aquí si es necesario
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const selectedFiles: (File | null)[] = [file1, file2, file3];

        const missingFiles: string[] = [];
        selectedFiles.forEach((file, index) => {
            if (!file) {
                missingFiles.push(`Debe seleccionar ${getFileName(index + 1)}`);
            }
        });

        if (missingFiles.length > 0) {
            setErrorMessages(missingFiles);
            return;
        }

        try {
            // Marcamos el inicio del área de loading
            setLoading(true);

            const responseConsulta = await axios.post(`${apiURL}/api/consultaDocumento`, {
                documento: userDocumento,
            });

            if (responseConsulta.data.error) {
                setErrorMessages(['Documento ya existe.']);
            } else {
                Swal.fire({
                    title: 'Felicitaciones',
                    text: 'Tu registro fue exitoso. Estamos validando tus información. Pronto nos pondremos en contacto contigo.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#dc3545', // Color rojo
                    timer: 8000,
                });

                const formData = new FormData();
                formData.append('fotoRostro', file1!);
                formData.append('documento_delantero', file2!);
                formData.append('documento_posterior', file3!);
                formData.append('tipo', 'foto');
                formData.append('documento', userDocumento);

                await axios.post(`${apiURL}/api/fotoRegistro`, formData);
                console.log('Imágenes guardadas correctamente');
                await axios.post(`${apiURL}/api/EstudioRegistro`, { documento: userDocumento });

                // Marcamos el final del área de loading
                setLoading(false);

                navigate('/');
            }
        } catch (error) {
            console.error('Error:', error);

            await axios.post(`${apiURL}/api/EstudioRegistro`, { documento: userDocumento });

            Swal.fire({
                title: 'Felicitaciones',
                text: 'Tu registro fue exitoso. Estamos validando tus información. Pronto nos pondremos en contacto contigo.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545', // Color rojo
                timer: 8000,
            });

            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error('Respuesta de datos:', error.response.data);
                    console.error('Estado de respuesta:', error.response.status);
                    console.error('Encabezados de respuesta:', error.response.headers);
                } else if (error.request) {
                    console.error('Solicitud hecha pero no recibida');
                } else {
                    console.error('Error en la configuración de la solicitud', error.message);
                }
            }

            setErrorMessages(['Ocurrió un error durante el registro.']);

            // Marcamos el final del área de loading
            setLoading(false);

            navigate('/');
        }
    };

    const getFileName = (index: number): string => {
        switch (index) {
            case 1:
                return 'Foto del rostro';
            case 2:
                return 'Foto del documento delantero';
            case 3:
                return 'Foto del documento posterior';
            default:
                return 'Archivo';
        }
    };

    useEffect(() => {
        const handleImageClick = (index: number) => {
            const fileInput = document.getElementById(`file${index}`) as HTMLInputElement;
            if (fileInput) {
                // fileInput.click();
            }
        };

        const addEventListeners = () => {
            const imageElements = document.querySelectorAll('.selected-image');
            imageElements.forEach((imageElement, index) => {
                imageElement.addEventListener('click', () => handleImageClick(index + 1));
            });
        };

        const removeEventListeners = () => {
            const imageElements = document.querySelectorAll('.selected-image');
            imageElements.forEach((imageElement, index) => {
                imageElement.removeEventListener('click', () => handleImageClick(index + 1));
            });
        };

        addEventListeners();

        return removeEventListeners;
    }, []);

    const getDefaultImageSrc = (index: number): string => {
        switch (index) {
            case 1:
                return '../assets/images/clients/user.png';
            case 2:
                return '../assets/images/clients/cedula_frontal.png';
            case 3:
                return '../assets/images/clients/cedula_atras.png';
            default:
                return '/ruta-por-defecto-generico.jpg';
        }
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                        <div key={index}>
                            <label htmlFor={`file${index}`} className="block text-center" onClick={() => handleFileSelectionClick(index)}>
                                <strong>{` ${getFileName(index)}`}</strong>
                            </label>

                            <input
                                type="file"
                                id={`file${index}`}
                                name={`file${index}`}
                                className="form-input form-input-lg"
                                onChange={(e) => handleFileChange(index, e.target.files ? e.target.files[0] : null)}
                                accept="image/*,application/pdf"
                                capture="environment"
                            />
                            {selectedImageUrls[index - 1] ? (
                                <div className="selected-image-container" onClick={() => handleFileSelectionClick(index)}>
                                    <p>Imagen seleccionada:</p>
                                    <img src={selectedImageUrls[index - 1] || ''} alt={`Foto ${getFileName(index)}`} className="selected-image" />
                                </div>
                            ) : (
                                <div className="selected-image-container" onClick={() => handleFileSelectionClick(index)}>
                                    <p></p>
                                    <img src={getDefaultImageSrc(index)} alt={`Imagen por defecto de ${getFileName(index)}`} className="selected-image" />
                                </div>
                            )}
                        </div>
                    ))}
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

export default ImageForm;
