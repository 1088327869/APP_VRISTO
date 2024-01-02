import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import getApiUrl from '../../../config';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconSearch from '../../components/Icon/IconSearch';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import { server_user } from '../../../config';

const apiURL = getApiUrl();

const server_url = server_user;

interface Enestudios {
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
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  email: string;
  ciudad: string;
  tipo: string;
  fotoPerfil: string;
  thumb?: string;
  nombreCompleto: string;
}

const Search = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Search'));
  });

  const [search, setSearch] = useState<string>('');
  const [estudios, setEstudios] = useState<Enestudios[]>([]);
  const [filteredEstudios, setFilteredEstudios] = useState<Enestudios[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${apiURL}/api/consultar/Registro`);

        if (response.status === 200) {
          console.log('Datos de estudio', response.data.estudios);
          setEstudios(response.data.estudios);
          setFilteredEstudios(response.data.estudios); // Inicializar con todos los estudios
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

  useEffect(() => {
    // Filtrar estudios en tiempo real
    setFilteredEstudios((prevEstudios) => {
      if (search === '') {
        // Si el campo de búsqueda está vacío, mostrar todos los estudios
        return estudios;
      } else {
        // Filtrar estudios según el término de búsqueda
        return prevEstudios.filter((estudio) => {
          return (
            estudio.documento.toLowerCase().includes(search.toLowerCase()) || estudio.edad.toLowerCase().includes(search.toLowerCase()) || estudio.nombre.toLowerCase().includes(search.toLowerCase()) // Agregado para filtrar por nombre
          );
        });
      }
    });
  }, [search, estudios]);

  const handleResultClick = (selectedEstudio: Enestudios) => {
    // Al hacer clic en un resultado, guarda los datos en localStorage
    localStorage.setItem('userDocumento', JSON.stringify(selectedEstudio.documento));
    // Navega a la página deseada
    navigate('/users/user-account-settings');
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="#" className="text-primary hover:underline">
            Estudio
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Crédito</span>
        </li>
      </ul>
      <div className="pt-5 grid lg:grid-cols-1 grid-cols-1 gap-6">
        <div className="panel lg:row-span-2" id="live">
          <div className="flex items-center justify-between mb-5">
            <h5 className="font-semibold text-lg dark:text-white-light">Estudios de créditos</h5>
          </div>
          <div className="mb-5 space-y-5">
            <form className="mx-auto w-full sm:w-1/2 mb-5">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  placeholder="Buscar estudio..."
                  className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="button" className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center">
                  <IconSearch className="mx-auto" />
                </button>
              </div>
            </form>
            <div className="p-4 border border-white-dark/20 rounded-lg space-y-4 overflow-x-auto w-full block">
              <table className="w-full">
                <tbody>
                  {filteredEstudios.map((item: Enestudios) => (
                    <tr
                      key={item.id}
                      className="bg-white dark:bg-[#1b2e4b] rounded-xl shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] p-3 text-gray-500 font-semibold min-w-[625px] hover:text-primary transition-all duration-300 hover:scale-[1.01]"
                      onClick={() => handleResultClick(item)}
                    >
                      <td>#{item.id}</td>
                      <td>
                        <div className="user-profile">
                          <img src={item.fotoPerfil ? `${item.fotoPerfil}` : '/assets/images/clients/user.png'} alt="img" className="w-8 h-8 rounded-md object-cover" />
                        </div>
                      </td>
                      {/* <td>{item.fotoPerfil}</td> */}
                      <td>{item.nombreCompleto}</td>
                      <td>{item.documento}</td>
                      <td>{item.estado}</td>
                      <td>{item.fecha_registro}</td>
                      <td>{item.ciudad}</td>
                      <td className="cursor-pointer">
                        <IconHorizontalDots className="w-6 h-6 opacity-70" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
