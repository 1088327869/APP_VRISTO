import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import useToken from '../pages/Authentication/login/token';
import GridLoader from 'react-spinners/GridLoader';

const FormularioG = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        observacion: '',
    });
    const [downloadLinks, setDownloadLinks] = useState({
        fotoRostro: '',
        documentoPosterior: '',
        documentoDelantero: '',
    });
    const token = useToken();
    const baseUrl = 'http://localhost:3000'; // Asegúrate de que esta ruta sea correcta

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            // Marcamos el inicio del área de loading
            setLoading(true);

            // Obtener el token almacenado en localStorage
            const token = localStorage.getItem('tuClaveToken'); // Reemplaza 'tuClaveToken' con la clave real que estás usando

            if (!token) {
                console.error('Token no encontrado en localStorage');
                return; // O manejar el caso de falta de token según tus necesidades
            }

            const { nombre, telefono, observacion } = formData;
            const response = await fetch('http://localhost:3000/formulario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nombre, telefono, observacion }),
            });

            if (response.ok) {
                console.log('Datos guardados exitosamente');

                // Realizar una nueva solicitud para obtener los nombres de los documentos
                const documentosResponse = await fetch('http://localhost:3000/api/img/reg', {
                    method: 'post', // Asegúrate de que esta ruta y método sean correctos
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('imagen :', documentosResponse);

                if (documentosResponse.ok) {
                    const documentosData = await documentosResponse.json();
                    setDownloadLinks({
                        fotoRostro: documentosData.fotoRostro,
                        documentoPosterior: documentosData.documento_posterior,
                        documentoDelantero: documentosData.documento_delantero,
                    });
                } else {
                    console.error('Error al obtener los nombres de los documentos');
                }
            } else {
                console.error('Error al guardar los datos en el servidor');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        } finally {
            // Marcamos el final del área de loading
            setLoading(false);
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
            <form onSubmit={submitForm}>
                <div className="mb-4">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
                </div>

                <div className="mb-4">
                    <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                        Teléfono
                    </label>
                    <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
                </div>

                <div className="mb-4">
                    <label htmlFor="observacion" className="block text-sm font-medium text-gray-700">
                        Observación
                    </label>
                    <textarea id="observacion" name="observacion" value={formData.observacion} onChange={handleChange} className="mt-1 p-2 border rounded-md w-full" />
                </div>

                <div className="mb-4">
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
                        Guardar Datos
                    </button>
                </div>
            </form>

            <div>
                <div>
                    <p>Enlace de descarga fotoRostro:</p>
                    <img src={`http://localhost:3000/uploads/registro/1702842197972_Captura%20de%20pantalla%202023-07-13%20134342.png`} alt="Foto Rostro" />
                </div>
                {downloadLinks.fotoRostro && (
                    <div>
                        <p>Enlace de descarga fotoRostro:</p>
                        <img src={`http://localhost:3000/uploads/registro/1702842197972_Captura%20de%20pantalla%202023-07-13%20134342.png`} alt="Foto Rostro" />
                    </div>
                )}
                {downloadLinks.documentoPosterior && (
                    <div>
                        <p>Enlace de descarga documentoPosterior:</p>
                        <img src={`${baseUrl}/descargar/${downloadLinks.documentoPosterior}`} alt="Documento Posterior" />
                    </div>
                )}
                {downloadLinks.documentoDelantero && (
                    <div>
                        <p>Enlace de descarga documentoDelantero:</p>
                        <img src={`${baseUrl}/descargar/${downloadLinks.documentoDelantero}`} alt="Documento Delantero" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormularioG;
