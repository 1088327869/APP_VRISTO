import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getApiUrl from '../../../config';

const apiURL = getApiUrl();

interface Laboral {
  empresa: string;
  actividadEconomica: string;
  telefono: string;
}

interface Bancaria {
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
}

const InfoLaboral = () => {
  const [infoLaboral, setInfoLaboral] = useState<Laboral | null>(null);
  const [infoBancaria, setInfoBancaria] = useState<Bancaria | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUserDocumento = localStorage.getItem('userDocumento');
      const userDocumento = storedUserDocumento ? JSON.parse(storedUserDocumento) : {};
      try {
        const response = await axios.post(`${apiURL}/api/infoLaboralBancaria`, {
          userDocumento: userDocumento,
        });

        if (response.status === 200) {
          console.log('Datos de estudio', response.data);

          const { informacionLaboral, informacionBancaria } = response.data;

          setInfoLaboral(informacionLaboral || null);
          setInfoBancaria(informacionBancaria || null);
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
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="panel">
          <div className="mb-5">
            <h5 className="font-semibold text-lg mb-4">Informacion laboral</h5>
          </div>
          <div className="mb-5">
            <form>
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="billingName">Nombre Empresa</label>
                  <input id="billingName" type="text" placeholder="Ingresa el nombre de la empresa" className="form-input" value={infoLaboral?.empresa || ''} />
                </div>
                <div>
                  <label htmlFor="billingEmail">Actividad Económica</label>
                  <input id="billingEmail" type="text" placeholder="Ingresa la actividad económica" className="form-input" value={infoLaboral?.actividadEconomica || ''} />
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="billingAddress">Teléfono</label>
                <input id="billingAddress" type="text" placeholder="Ingresa el teléfono" className="form-input" value={infoLaboral?.telefono || ''} />
              </div>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </form>
          </div>
        </div>
        <div className="panel">
          <div className="mb-5">
            <h5 className="font-semibold text-lg mb-4">Informacion bancaria</h5>
          </div>
          <div className="mb-5">
            <form>
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="payBrand">Banco</label>
                  <input id="payBrand" type="text" placeholder="Ingrese el nombre del banco" className="form-input" value={infoBancaria?.banco || ''} />
                </div>
                <div>
                  <label htmlFor="payNumber">Tipo de Cuenta</label>
                  <input id="payNumber" type="text" placeholder="Ingrese el tipo de cuenta" className="form-input" value={infoBancaria?.tipoCuenta || ''} />
                </div>
              </div>
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="payHolder">Número de Cuenta</label>
                  <input id="payHolder" type="text" placeholder="Ingrese el número de cuenta" className="form-input" value={infoBancaria?.numeroCuenta || ''} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoLaboral;
