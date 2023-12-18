import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import IconHome from '../../../components/Icon/IconHome';
import IconUser from '../../../components/Icon/IconUser';
import IconThumbUp from '../../../components/Icon/IconThumbUp';
import CameraIconProps from '../../../components/Icon/iconCamara';

import PersonalInfoForm from './PersonalInforForm';
import LaboralInfoForm from './LaboralInfoForm';
import ReferencesForm from './ReferencesForm';
import PhotosForm from './PhotosForm';

import axios from 'axios';
import getApiUrl from '../../../../config';

const Wizards = () => {
    const [activeTab, setActiveTab] = useState(1);
    const navigate = useNavigate();

    const storedUsdDate = localStorage.getItem('userData');
    const userDocumento = storedUsdDate ? JSON.parse(storedUsdDate) : {};

    const apiURL = getApiUrl();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const consultarRegistroResponse = await axios.post(`${apiURL}/api/consultar/Registro`, { documento: userDocumento });
                if (consultarRegistroResponse.status === 200) {
                    console.log('Usuario ya está registrado');
                    // navigate('/');
                } else {
                    console.log(consultarRegistroResponse.data.message);
                    navigate('/forms/wizards');
                }
            } catch (error) {
                console.error('Error consultando el registro:', error);
                navigate('/forms/wizards');
            }
        };
        fetchData();
    }, []);

    const handleTabClick = (tabNumber: number) => {
        setActiveTab(tabNumber);
    };

    const renderForm = () => {
        switch (activeTab) {
            case 1:
                return <PersonalInfoForm onNext={() => handleTabClick(2)} />;
            case 2:
                return <LaboralInfoForm onNext={() => handleTabClick(3)} />;
            case 3:
                return <ReferencesForm onNext={() => handleTabClick(4)} />;
            case 4:
            // return <PhotosForm onNext={() => handleTabClick(1)} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="pt-5 space-y-8">
                <div className="panel lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <h5 className="font-semibold text-lg dark:text-white-light">Actualizar información</h5>
                    </div>
                    <div className="mb-5">
                        <div className="relative z-[1]">
                            {/* <div
                                className={`${
                                    activeTab === 1 ? 'w-[15%]' : activeTab === 2 ? 'w-[48%]' : activeTab === 3 ? 'w-[81%]' : activeTab === 4 ? 'w-[81%]' : ''
                                } bg-primary w-[15%] h-1 absolute ltr:left-0 rtl:right-0 top-[30px] m-auto -z-[1] transition-[width]`}
                            ></div> */}
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
                                        className={`${
                                            activeTab === 2 ? '!border-primary !bg-primary text-white' : ''
                                        } bg-white dark:bg-[##B64609] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
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
                                {/* <li className="mx-auto">
                                    <button
                                        type="button"
                                        className={`${activeTab === 4 ? '!border-primary !bg-primary text-white' : ''}
                        bg-white dark:bg-[##B64609] border-[3px] border-[#f3f2ee] dark:border-[#1b2e4b] flex justify-center items-center w-16 h-16 rounded-full`}
                                        onClick={() => handleTabClick(4)}
                                    >
                                        <CameraIconProps className="w-5 h-5" />
                                    </button>
                                </li> */}
                            </ul>
                        </div>

                        <div>
                            <div>
                                <p className="mb-5 h-full">{activeTab === 1 && ' Informacion personal'}</p>
                                <p className="mb-5 h-full">{activeTab === 2 && ' Informacion laboral'}</p>
                                <p className="mb-5 h-full">{activeTab === 3 && ' Referencias'}</p>
                                <p className="mb-5 h-full">{activeTab === 4 && ' Fotografia'}</p>
                                {renderForm()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Wizards;
