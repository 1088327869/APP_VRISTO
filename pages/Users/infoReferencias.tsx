import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getApiUrl from '../../../config';

const apiURL = getApiUrl();

interface referenciaPersonal {
  familiar: {
    nombre: string;
    parentesco: string;
    telefono: string;
  };
  personal: {
    nombre: string;
    parentesco: string;
    telefono: string;
  };
}

const InfoLaboral = () => {
  const [infoReferencias, setInfoReferencias] = useState<referenciaPersonal | null>(null);

  const storedUserDocumento = localStorage.getItem('userDocumento');
  const userDocumento = storedUserDocumento ? JSON.parse(storedUserDocumento) : {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiURL}/api/info/referenica/estudio`, {
          userDocumento: userDocumento,
        });

        if (response.status === 200) {
          console.log('Datos de estudio', response.data);

          const { infoReferencias } = response.data;

          setInfoReferencias(infoReferencias || null);
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
            <h5 className="font-semibold text-lg mb-4">Informacion familiar</h5>
          </div>
          <div className="mb-5">
            <form>
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="familiarName">Nombre Familiar</label>
                  <input id="familiarName" type="text" placeholder="Ingresa el nombre del familiar" className="form-input" value={infoReferencias?.familiar?.nombre || ''} />
                </div>
                <div>
                  <label htmlFor="familiarRelationship">Parentesco Familiar</label>
                  <input id="familiarRelationship" type="text" placeholder="Ingresa el parentesco familiar" className="form-input" value={infoReferencias?.familiar?.parentesco || ''} />
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="familiarPhone">Teléfono Familiar</label>
                <input id="familiarPhone" type="text" placeholder="Ingresa el teléfono familiar" className="form-input" value={infoReferencias?.familiar?.telefono || ''} />
              </div>

              <button type="submit" className="btn btn-primary">
                Actualizar
              </button>
            </form>
          </div>
        </div>
        {/* informacion personal */}
        <div className="panel">
          <div className="mb-5">
            <h5 className="font-semibold text-lg mb-4">Informacion personal</h5>
          </div>
          <div className="mb-5">
            <form>
              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4"></div>

              <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="personalName">Nombre Personal</label>
                  <input id="personalName" type="text" placeholder="Ingresa el nombre personal" className="form-input" value={infoReferencias?.personal?.nombre || ''} />
                </div>
                <div>
                  <label htmlFor="personalRelationship">Parentesco Personal</label>
                  <input id="personalRelationship" type="text" placeholder="Ingresa el parentesco personal" className="form-input" value={infoReferencias?.personal?.parentesco || ''} />
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="personalPhone">Teléfono Personal</label>
                <input id="personalPhone" type="text" placeholder="Ingresa el teléfono personal" className="form-input" value={infoReferencias?.personal?.telefono || ''} />
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
