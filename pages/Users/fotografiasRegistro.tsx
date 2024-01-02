import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import getApiUrl from '../../../config';
import GridLoader from 'react-spinners/GridLoader';
import '../../assets/css/app.css';

const apiURL = getApiUrl();

const ImagenDocumentos = () => {
  const [loading, setLoading] = useState(false);
  const [selectedImageUrls, setSelectedImageUrls] = useState<Array<string | null>>([null, null, null]);

  useEffect(() => {
    const storedUserDocumento = localStorage.getItem('userDocumento');
    const userDocumento = storedUserDocumento ? JSON.parse(storedUserDocumento) : {};

    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiURL}/api/info/documentos/registor`, {
          userDocumento: userDocumento,
        });

        if (response.status === 200) {
          console.log('Datos de estudio', response.data);

          // Asumo que response.data tiene una propiedad Documentos que es un array con las imágenes
          const documentos = response.data?.Documentos || [];

          const urls = documentos.map((documento: any) => documento.documento_guardar);
          setSelectedImageUrls(urls);
        } else {
          console.log(response.data.message);
          // Puedes manejar el caso donde no se encontraron registros
        }
      } catch (error) {
        console.error('Error consultando el registro:', error);
        // Puedes manejar el error aquí
      }
    };

    fetchData();
  }, []);

  const handleFileSelectionClick = (index: number) => {
    // No estoy seguro de lo que deseas hacer con esta función, pero aquí está el esbozo
    console.log(`Clicked on file ${index}`);
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
      <form encType="multipart/form-data">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((index) => (
            <div key={index}>
              <label htmlFor={`file${index}`} className="block text-center" onClick={() => handleFileSelectionClick(index)}>
                {/* <strong>{` ${getFileName(index)}`}</strong> */}
              </label>

              {selectedImageUrls[index - 1] ? (
                <div className="selected-image-container" onClick={() => handleFileSelectionClick(index)}>
                  <p>Imagen seleccionada:</p>
                  <img src={selectedImageUrls[index - 1] || ''} alt={`Foto ${index}`} className="selected-image" />
                </div>
              ) : (
                <div className="selected-image-container" onClick={() => handleFileSelectionClick(index)}>
                  <p>No hay imagen seleccionada</p>
                  <img src={getDefaultImageSrc(index)} alt={`Imagen por defecto de ${index}`} className="selected-image" />
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
      </form>
    </div>
  );
};

// Función para obtener la ruta de la imagen por defecto según el índice
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

export default ImagenDocumentos;
