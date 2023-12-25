import { useEffect, useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';
import IconCode from '../../components/Icon/IconCode';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconAirplay from '../../components/Icon/IconAirplay';
import IconBox from '../../components/Icon/IconBox';
import IconLayout from '../../components/Icon/IconLayout';
import CodeHighlight from '../../components/Highlight'; // Asegúrate de importar el componente CodeHighlight

const Accordians = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Accordions'));
    }, [dispatch]);

    // Datos dinámicos
    // Datos dinámicos
    const dynamicData = [
        { icon: <IconAirplay />, title: 'Collapsible Group Item #1', content: '2' },
        { icon: <IconBox />, title: 'Collapsible Group Item #2', content: '3' },
        { icon: <IconLayout />, title: 'Collapsible Group Item #3', content: 'Contenido del elemento #3...' },
    ];

    const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
    const [isCodeVisible, setIsCodeVisible] = useState(false);

    const toggleAccordion = (index: number) => {
        setActiveAccordion((prev) => (prev === index.toString() ? null : index.toString()));
    };

    const toggleCode = () => {
        setIsCodeVisible((prev) => !prev);
    };

    return (
        <div>
            <div className="panel">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Accordions</h5>
                    <button onClick={toggleCode} className="font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600">
                        <span className="flex items-center">
                            <IconCode className="me-2" />
                            Code
                        </span>
                    </button>
                </div>

                <div className="mb-5">
                    <div className="space-y-2 font-semibold">
                        {dynamicData.map((item, index) => (
                            <div key={index} className="border border-[#d3d3d3] rounded dark:border-[#1b2e4b]">
                                <button
                                    type="button"
                                    className={`p-4 w-full flex items-center text-white-dark dark:bg-[#1b2e4b] ${activeAccordion === index.toString() ? '!text-primary' : ''}`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {item.icon}
                                    {item.title}
                                    <div className={`ltr:ml-auto rtl:mr-auto ${activeAccordion === index.toString() ? 'rotate-180' : ''}`}>
                                        <IconCaretDown />
                                    </div>
                                </button>
                                <div>
                                    <AnimateHeight duration={300} height={activeAccordion === index.toString() ? 'auto' : 0}>
                                        <div className="space-y-2 p-4 text-white-dark text-[13px] border-t border-[#d3d3d3] dark:border-[#1b2e4b]">
                                            <p>{item.content}</p>
                                            {/* ... Puedes agregar más contenido según tus necesidades ... */}
                                        </div>
                                    </AnimateHeight>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {isCodeVisible && <CodeHighlight>{`// Tu código de resaltado aquí`}</CodeHighlight>}
            </div>
        </div>
    );
};

export default Accordians;
