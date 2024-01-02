import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoEstudioCredito from '../Users/infoEstudioCredito';
import RealizarEstudios from '../Users/realizarEstudioCredito';
import getApiUrl from '../../../config';

const apiURL = getApiUrl();

interface infoPersonal {
  nombre: string;
  apellido: string;
  tipoDocumento: string;
  documento: string;
  fecha_nacimiento: string;
  fecha_expedicion: string;
  genero: string;
  celular: string;
  email: string;
  estado_civil: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  tipo_vivienda: string;
  telefono_residencial: string;
  fotoPerfil: string;
}

const InfoContacto = () => {
  const [estudio, setEstudio] = useState<infoPersonal | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUsdDate = localStorage.getItem('userDocumento');
      const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

      try {
        const response = await axios.post(`${apiURL}/api/infoDatosPersonal`, {
          userDocumento: userDocumento,
        });

        if (response.status === 200) {
          console.log('Datos de estudio', response.data);
          // Asignar el primer elemento del array a estudio
          setEstudio(response.data || null);
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
    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black">
      <h6 className="text-lg font-bold mb-5">Información personal</h6>
      <div className="flex flex-col sm:flex-row">
        <div className="ltr:sm:mr-4 rtl:sm:ml-4 w-full sm:w-2/12 mb-5">
          <img src={estudio?.fotoPerfil || '/assets/images/clients/user.png'} alt="img" className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover mx-auto" />
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name">Nombre</label>
            <input id="name" type="text" placeholder="" className="form-input" value={estudio?.nombre} />
          </div>
          <div>
            <label htmlFor="profession">Apellido</label>
            <input id="profession" type="text" placeholder="" className="form-input" value={estudio?.apellido || ''} />
          </div>

          <div>
            <label htmlFor="tipoDcumento">Tipo documento</label>
            <input id="tipoDcumento" type="text" placeholder="" className="form-input" value={estudio?.tipoDocumento || ''} />
          </div>
          <div>
            <label htmlFor="Documento">Documento</label>
            <input id="Documento" type="text" placeholder="" className="form-input" value={estudio?.documento || ''} />
          </div>

          <div>
            <label htmlFor="nacimiento">Fecha nacimiento</label>
            <input id="nacimiento" type="text" placeholder="" className="form-input" value={estudio?.fecha_nacimiento || ''} />
          </div>
          <div>
            <label htmlFor="expedición">Fecha expedición</label>
            <input id="expedición" type="text" placeholder="" className="form-input" value={estudio?.fecha_expedicion || ''} />
          </div>
          <div>
            <label htmlFor="Género">Género</label>
            <input id="Género" type="text" placeholder="" className="form-input" value={estudio?.genero || ''} />
          </div>
          <div>
            <label htmlFor="Celular">Celular</label>
            <input id="Celular" type="text" placeholder="" className="form-input" value={estudio?.celular || ''} />
          </div>
          <div>
            <label htmlFor="Email">Email</label>
            <input id="Email" type="text" placeholder="" className="form-input" value={estudio?.email || ''} />
          </div>
          <div>
            <label htmlFor="Direccion">Dirección</label>
            <input id="Direccion" type="text" placeholder="" className="form-input" value={estudio?.direccion || ''} />
          </div>
          <div>
            <label htmlFor="Barrio">Barrio</label>
            <input id="Barrio" type="text" placeholder="" className="form-input" value={estudio?.barrio || ''} />
          </div>
          <div>
            <label htmlFor="Ciudad">Ciudad</label>
            <input id="Ciudad" type="text" placeholder="" className="form-input" value={estudio?.ciudad || ''} />
          </div>
          <div>
            <label htmlFor="Vivienda">Tipo Vivienda</label>
            <input id="Vivienda" type="text" placeholder="" className="form-input" value={estudio?.tipo_vivienda || ''} />
          </div>
          <div>
            <label htmlFor="residencial">Teléfono residencial</label>
            <input id="residencial" type="text" placeholder="" className="form-input" value={estudio?.telefono_residencial || ''} />
          </div>
          <div>
            <label htmlFor="civil">Estado civil</label>
            <input id="civil" type="text" placeholder="" className="form-input" value={estudio?.estado_civil || ''} />
          </div>

          <div className="sm:col-span-2 mt-3">
            {/* <button type="button" className="btn btn-primary">
              Actualizar
            </button> */}
          </div>
        </div>
      </div>
    </form>
  );
};

const InfoPersonal = () => {
  return (
    <div>
      <InfoContacto />
      <InfoEstudioCredito />
      <RealizarEstudios />
    </div>
  );
};

export default InfoPersonal;
