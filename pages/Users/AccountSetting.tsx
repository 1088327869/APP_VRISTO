import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';

import InfoContacto from '../Users/infoPersonal';
import InfoLaboral from '../Users/infoLaboral';
import InfoReferencias from '../Users/infoReferencias';
import ImagenDocumentos from '../Users/fotografiasRegistro';

const AccountSetting = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle('Cliente'));
  });
  const [tabs, setTabs] = useState<string>('Personal');
  const toggleTabs = (name: string) => {
    setTabs(name);
  };

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link to="/users/estudio" className="text-primary hover:underline">
            Estudio
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>Editar</span>
        </li>
      </ul>
      <div className="pt-5">
        <div className="flex items-center justify-between mb-5">
          <h5 className="font-semibold text-lg dark:text-white-light">Información cliente</h5>
        </div>
        <div>
          <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('Personal')}
                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'Personal' ? '!border-primary text-primary' : ''}`}
              >
                <IconHome />
                Información personal
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('payment-details')}
                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
              >
                <IconDollarSignCircle />
                Información laboral
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('preferences')}
                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
              >
                <IconPhone className="w-5 h-5" />
                Información Contacto
              </button>
            </li>
            <li className="inline-block">
              <button
                onClick={() => toggleTabs('danger-zone')}
                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'danger-zone' ? '!border-primary text-primary' : ''}`}
              >
                <IconUser />
                Fotografias
              </button>
            </li>
          </ul>
        </div>
        {tabs === 'Personal' ? <InfoContacto /> : ''}
        {tabs === 'payment-details' ? <InfoLaboral /> : ''}
        {tabs === 'preferences' ? <InfoReferencias /> : ''}
        {tabs === 'danger-zone' ? <ImagenDocumentos /> : ''}
      </div>
    </div>
  );
};

export default AccountSetting;
