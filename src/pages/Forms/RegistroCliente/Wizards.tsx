import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CodeHighlight from '../../../components/Highlight';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconCode from '../../../components/Icon/IconCode';
import IconHome from '../../../components/Icon/IconHome';
import IconUser from '../../../components/Icon/IconUser';
import IconThumbUp from '../../../components/Icon/IconThumbUp';
import CameraIconProps from '../../../components/Icon/iconCamara';

import PersonalInfoForm from './PersonalInforForm'; // Importa tu componente de formulario de información personal
import LaboralInfoForm from './LaboralInfoForm'; // Importa tu componente de formulario de información laboral
import ReferencesForm from './ReferencesForm'; // Importa tu componente de formulario de referencias
import PhotosForm from './PhotosForm'; // Importa tu componente de formulario de fotografías

import axios from 'axios';
import getApiUrl from '../../../../config';

const storedUsdDate = localStorage.getItem('userData');
const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

const apiURL = getApiUrl();

const Wizards = () => {
    const [activeTab, setActiveTab] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const consultarRegistroResponse = await axios.post(`${apiURL}/api/consultar/Registro`, { documento: userDocumento });

                if (consultarRegistroResponse.status === 200) {
                    console.log('Usuario ya está registrado');
                    navigate('/');
                } else {
                    console.log(consultarRegistroResponse.data.message);
                    navigate('/forms/wizards');
                }
            } catch (error) {
                console.error('Error consultando el registro:', error);
            }
        };

        fetchData(); // Llama a la función de consulta cuando el componente se monta

        // No olvides añadir userDocumento como dependencia si lo usas dentro de useEffect y cambia durante la vida del componente.
    }, [navigate, userDocumento]);
    const handleTabClick = (tabNumber: number) => {
        if (tabNumber < activeTab) {
            setActiveTab(tabNumber);
        }
        // Puedes agregar lógica adicional aquí si es necesario.
    };

    const handleBackClick = () => {
        setActiveTab((prevTab) => Math.max(1, prevTab - 1));
    };

    const handleNextClick = () => {
        setActiveTab((prevTab) => Math.min(4, prevTab + 1));
    };

    const renderForm = () => {
        switch (activeTab) {
            case 1:
                return <PersonalInfoForm onNext={handleNextClick} />;
            case 2:
                return <LaboralInfoForm onNext={handleNextClick} />;
            case 3:
                return <ReferencesForm onNext={handleNextClick} />;
            case 4:
                return <PhotosForm onNext={handleNextClick} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="pt-5 space-y-8">
                <div className="panel lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Solicitud de crédito</h5>
                    </div>
                    <div className="mb-5">
                        <div className="relative z-[1]">
                            <div
                                className={`${
                                    activeTab === 1 ? 'w-[15%]' : activeTab === 2 ? 'w-[48%]' : activeTab === 3 ? 'w-[81%]' : activeTab === 4 ? 'w-[81%]' : ''
                                } bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]`}
                            ></div>
                            <ul className="mb-5 grid grid-cols-4">
                                <li className="mx-auto">
                                    <button
                                        type="button"
                                        className={`${activeTab === 1 ? '!border-primary !bg-primary text-white' : ''}
                        bg-white dark:bg-[##B64609] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                        onClick={() => handleTabClick(1)}
                                    >
                                        <IconUser />
                                    </button>
                                </li>
                                <li className="mx-auto">
                                    <button
                                        type="button"
                                        className={`${activeTab === 2 ? '!border-primary !bg-primary text-white' : ''}
                        bg-white dark:bg-[##B64609] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                        onClick={() => handleTabClick(2)}
                                    >
                                        <IconHome className="w-5 h-5" />
                                    </button>
                                </li>
                                <li className="mx-auto">
                                    <button
                                        type="button"
                                        className={`${activeTab === 3 ? '!border-primary !bg-primary text-white' : ''}
                        bg-white dark:bg-[##B64609] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                        onClick={() => handleTabClick(3)}
                                    >
                                        <IconThumbUp className="w-5 h-5" />
                                    </button>
                                </li>
                                <li className="mx-auto">
                                    <button
                                        type="button"
                                        className={`${activeTab === 4 ? '!border-primary !bg-primary text-white' : ''}
                        bg-white dark:bg-[##B64609] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                        onClick={() => handleTabClick(4)}
                                    >
                                        <CameraIconProps className="w-5 h-5" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="mb-5 h-full">{activeTab === 1 && ' Informacion personal'}</p>
                            <p className="mb-5 h-full">{activeTab === 2 && ' Informacion laboral'}</p>
                            <p className="mb-5 h-full">{activeTab === 3 && ' Referencias'}</p>
                            <p className="mb-5 h-full">{activeTab === 4 && ' Fotografia'}</p>
                            {renderForm()}
                        </div>
                        <div className="flex justify-between">
                            <button type="button" className={`btn btn-primary ${activeTab === 1 ? 'hidden' : ''}`} onClick={handleBackClick}>
                                Atras
                            </button>
                            {/* <button type="button" className="btn btn-primary ltr:ml-auto rtl:mr-auto" onClick={handleNextClick}>
                                {activeTab === 4 ? 'Finish' : 'Next'}
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wizards;
