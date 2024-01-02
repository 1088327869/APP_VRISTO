import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import getApiUrl from '../../../config';

const apiURL = getApiUrl();

interface EstudioCreditoInfo {
  id: number;
  documento: string;
  sect_real: string;
  sect_coop: string;
  sect_telco: string;
  score: string;
  edad: string;
  observacion: string;
  estado: string;
  creador: string;
  fecha_registro: string;
}

interface CupoTasaInfo {
  id: number;
  documento: string;
  cupo: string;
  cupoDisponible: string;
  tasa: number;
  plazo: number;
  observacion: string;
  fecha_registro: string;
}

const EstudioCredito = () => {
  const [infoEstudioCredito, setInfoEstudioCredito] = useState<EstudioCreditoInfo | null>(null);
  const [infoCupoTasa, setInfoCupoTasa] = useState<CupoTasaInfo | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserDocumento = localStorage.getItem('userDocumento');
      const userDocumento = storedUserDocumento ? JSON.parse(storedUserDocumento) : {};
      try {
        const response = await axios.post(`${apiURL}/api/estudio/realizado`, {
          userDocumento: userDocumento,
        });

        if (response.status === 200) {
          console.log('Datos de estudio', response.data);

          const { estudioCredito, CupoTasa } = response.data;

          setInfoEstudioCredito(estudioCredito || null);
          setInfoCupoTasa(CupoTasa || null);
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

  return (
    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black">
      <h6 className="text-lg font-bold mb-5">Estudio de Crédito</h6>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Mostrar información del estudio de crédito */}
        {infoEstudioCredito && (
          <div>
            <h2>Información Estudio de Crédito</h2>
            <ul>
              <li>ID: {infoEstudioCredito.id}</li>
              <li>Documento: {infoEstudioCredito.documento}</li>
              <li>Sector Real: {infoEstudioCredito.sect_real}</li>
              <li>Sector Coop: {infoEstudioCredito.sect_coop}</li>
              <li>Sector Telco: {infoEstudioCredito.sect_telco}</li>
              <li>Score: {infoEstudioCredito.score}</li>
              <li>Observacion: {infoEstudioCredito.observacion}</li>
              <li>Creador: {infoEstudioCredito.creador}</li>
              <li>Estado: {infoEstudioCredito.estado}</li>
              {/* Agrega más elementos según tus necesidades */}
            </ul>
          </div>
        )}

        {/* Mostrar información del Cupo Tasa */}
        {infoCupoTasa && (
          <div>
            <h2>Información Cupo Tasa</h2>
            <ul>
              <li>ID: {infoCupoTasa.id}</li>
              <li>Documento: {infoCupoTasa.documento}</li>
              <li>Cupo: {infoCupoTasa.cupo}</li>
              <li>Cupo Disponible: {infoCupoTasa.cupoDisponible}</li>
              <li>Tasa: {infoCupoTasa.tasa}</li>
              <li>Plazo: {infoCupoTasa.plazo}</li>
              <li>Fecha registro: {infoCupoTasa.fecha_registro}</li>
              {/* Agrega más elementos según tus necesidades */}
            </ul>
          </div>
        )}
      </div>{' '}
    </form>
  );
};

export default EstudioCredito;
