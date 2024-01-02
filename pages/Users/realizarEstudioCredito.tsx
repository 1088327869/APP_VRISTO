import React, { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import getApiUrl from '../../../config';
import GridLoader from 'react-spinners/GridLoader';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const apiURL = getApiUrl();

interface EstudioCreditoInfo {
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

const RealizarEstudio = () => {
  const [loading, setLoading] = useState(false);
  const [infoEstudioCredito, setInfoEstudioCredito] = useState<EstudioCreditoInfo | null>(null);
  const [infoCupoTasa, setInfoCupoTasa] = useState<CupoTasaInfo | null>(null);
  const navigate = useNavigate();

  const [EstudioCredito, setFormData] = useState<EstudioCreditoInfo>({
    documento: '',
    sect_real: '',
    sect_coop: '',
    sect_telco: '',
    score: '',
    edad: '',
    observacion: '',
    estado: '',
    creador: '',
    fecha_registro: '',
  });

  const [CupoTasa, setFormData2] = useState<CupoTasaInfo>({
    id: 0,
    documento: '',
    cupo: '',
    cupoDisponible: '',
    tasa: 0,
    plazo: 0,
    observacion: '',
    fecha_registro: '',
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleChange = (name: keyof EstudioCreditoInfo, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleChange2 = (name: keyof CupoTasaInfo, value: string) => {
    setFormData2((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedUserDocumento = localStorage.getItem('userDocumento');
      const userDocumento = storedUserDocumento ? JSON.parse(storedUserDocumento) : {};
      try {
        const EstudiosMasCupo = await axios.post(`${apiURL}/api/estudio/realizado`, {
          userDocumento: userDocumento,
        });

        if (EstudiosMasCupo.status === 200) {
          const { estudioCredito, CupoTasa } = EstudiosMasCupo.data;

          setInfoEstudioCredito(estudioCredito || null);
          setInfoCupoTasa(CupoTasa || null);

          if (estudioCredito) {
            setFormData({
              documento: estudioCredito.documento,
              sect_real: estudioCredito.sect_real,
              sect_coop: estudioCredito.sect_coop,
              sect_telco: estudioCredito.sect_telco,
              score: estudioCredito.score,
              edad: estudioCredito.edad,
              observacion: estudioCredito.observacion,
              estado: estudioCredito.estado,
              creador: estudioCredito.creador,
              fecha_registro: estudioCredito.fecha_registro,
            });
          }

          if (CupoTasa) {
            setFormData2({
              id: CupoTasa.id,
              documento: CupoTasa.documento,
              cupo: CupoTasa.cupo,
              cupoDisponible: CupoTasa.cupoDisponible,
              tasa: CupoTasa.tasa,
              plazo: CupoTasa.plazo,
              observacion: CupoTasa.observacion,
              fecha_registro: CupoTasa.fecha_registro,
            });
          }
        } else {
          console.log(EstudiosMasCupo.data.message);
          // Puedes manejar el caso donde no se encontraron registros
        }
      } catch (error) {
        console.error('Error consultando el registro:', error);
        // Puedes manejar el error aquí
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar que todos los campos estén llenos
    const requiredFields: (keyof EstudioCreditoInfo)[] = ['sect_real', 'sect_coop', 'sect_telco', 'score', 'edad', 'observacion', 'estado'];
    const emptyFields = requiredFields.filter((field) => !EstudioCredito[field]);

    if (emptyFields.length > 0) {
      setErrorMessages(emptyFields.map((field) => `El campo ${field} es obligatorio`));
      return;
    }
    try {
      setLoading(true);

      // Obtener documento del localStorage
      const storedUserDocumento = localStorage.getItem('userDocumento');
      const userDocumento = storedUserDocumento ? JSON.parse(storedUserDocumento) : {};

      // Desestructurar campos específicos de EstudioCredito
      const { documento, edad, estado, observacion, score, sect_coop, sect_real, sect_telco } = EstudioCredito;

      // Desestructurar campos específicos de CupoTasa
      const { cupo, cupoDisponible, fecha_registro, plazo, tasa } = CupoTasa;

      await axios.post(`${apiURL}/api/Estudio/realizado/actualizar`, {
        documento: documento,
        edad: edad,
        score: score,
        sect_real: sect_real,
        sect_coop: sect_coop,
        sect_telco: sect_telco,
        cupo: cupo,
        cupoDisponible: cupo,
        estado: estado,
        tasa: tasa,
        plazo: plazo,
        fecha_registro: fecha_registro,
        observacion: observacion,
      });

      Swal.fire({
        title: 'Estudio actualizado',
        text: 'Los datos se han guardado con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#dc3545', // Color rojo
        timer: 4000,
      });
      navigate('/users/estudio');
    } catch (error) {
      console.error('Error al enviar datos:', error);
    } finally {
      setLoading(false);
    }
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
      <form onSubmit={handleSubmit} className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 bg-white dark:bg-black">
        <h6 className="text-lg font-bold mb-5">Parametros de estudio</h6>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="Sector real">Sector Real</label>
            <input
              type="text"
              id="Sector real"
              name="Sector real"
              placeholder="Sector real"
              className={`form-input form-input-lg ${errorMessages.includes('sect_real') && 'border-red-500'}`}
              value={EstudioCredito.sect_real}
              onChange={(e) => handleChange('sect_real', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="Sector Coop">Sector Coop</label>
            <input
              type="text"
              id="Sector Coop"
              name="Sector Coop"
              placeholder="Sector Coop"
              className={`form-input form-input-lg ${errorMessages.includes('sect_coop') && 'border-red-500'}`}
              value={EstudioCredito.sect_coop}
              onChange={(e) => handleChange('sect_coop', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="sect_telco">Sector telco</label>
            <input
              type="text"
              id="sect_telco"
              name="sect_telco"
              placeholder="sect_telco"
              className={`form-input form-input-lg ${errorMessages.includes('sect_telco') && 'border-red-500'}`}
              value={EstudioCredito.sect_telco}
              onChange={(e) => handleChange('sect_telco', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="Score">Score</label>
            <input
              type="text"
              id="Score"
              name="Score"
              placeholder="Score"
              className={`form-input form-input-lg ${errorMessages.includes('score') && 'border-red-500'}`}
              value={EstudioCredito.score}
              onChange={(e) => handleChange('score', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="edad">Edad</label>
            <input
              type="text"
              id="edad"
              name="Edad"
              placeholder="edad"
              className={`form-input form-input-lg ${errorMessages.includes('edad') && 'border-red-500'}`}
              value={EstudioCredito.edad}
              onChange={(e) => handleChange('edad', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              className={`form-input form-input-lg ${errorMessages.includes('estado') && 'border-red-500'}`}
              value={EstudioCredito.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
              required
            >
              <option value="">Seleccionar Estado</option>
              <option value="EN ESTUDIO">EN ESTUDIO</option>
              <option value="APROBADO">AROBADO</option>
              <option value="RECHAZADO">RECHAZADO</option>
            </select>
          </div>

          <div>
            <label htmlFor="tasa">Tasa</label>
            <input
              type="text"
              id="tasa"
              name="tasa"
              placeholder="tasa"
              className={`form-input form-input-lg ${errorMessages.includes('tasa') && 'border-red-500'}`}
              value={CupoTasa.tasa}
              onChange={(e) => handleChange2('tasa', e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="plazo">plazo</label>
            <input
              type="text"
              id="plazo"
              name="plazo"
              placeholder="plazo"
              className={`form-input form-input-lg ${errorMessages.includes('plazo') && 'border-red-500'}`}
              value={CupoTasa.plazo}
              onChange={(e) => handleChange2('plazo', e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="cupo">Cupo</label>
            <input
              type="text"
              id="cupo"
              name="cupo"
              placeholder="cupo"
              className={`form-input form-input-lg ${errorMessages.includes('cupo') && 'border-red-500'}`}
              value={CupoTasa.cupo}
              onChange={(e) => handleChange2('cupo', e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="observacion">Observacion</label>
          <input
            type="text"
            id="observacion"
            name="Observacion"
            placeholder="observacion"
            className={`form-input form-input-lg ${errorMessages.includes('observacion') && 'border-red-500'}`}
            value={EstudioCredito.observacion}
            onChange={(e) => handleChange('observacion', e.target.value)}
            required
          />
        </div>
        <div className="mt-4 flex justify-end">
          <button type="submit" className="btn btn-primary mr-2">
            Guardar
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

export default RealizarEstudio;
