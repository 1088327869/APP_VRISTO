import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Nouislider from '@x1mrdonut1x/nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../store/themeConfigSlice';

const DateRangePicker = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Date & Range Picker'));
    }, [dispatch]);

    // Primer rango
    const [inputStart, setInputStart] = useState<number>(2000);
    const [inputEnd, setInputEnd] = useState<number>(1000000);

    // Segundo rango
    const [inputStart2, setInputStart2] = useState<number>(2); // Mínimo
    const [inputEnd2, setInputEnd2] = useState<number>(12); // Máximo

    const slider1Update = (range: number[]) => {
        setInputStart(range[0]);
        setInputEnd(range[1]);
    };

    const slider2Update = (range: number[]) => {
        setInputStart2(range[0]);
        setInputEnd2(range[1]);
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Forms
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Date and Range Picker</span>
                </li>
            </ul>
            <div className="pt-5 space-y-8">
                <div className="space-y-8" id="noui_sliders">
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="panel col-span-full">
                            <div className="flex items-center justify-between mb-5">
                                <h5 className="font-semibold text-lg dark:text-white-light">Solicitud de Crédito</h5>
                            </div>
                            {/* Primer rango */}
                            <div className="mb-5 pt-10">
                                <Nouislider range={{ min: 0, max: 1000000 }} start={[inputStart, inputEnd]} step={1} connect={true} onSlide={slider1Update} tooltips={true} />
                                <div className="container d-flex justify-content-between">
                                    <h1 className="text-start">""</h1>
                                    <h1 className="text-end">Minimo</h1>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-9">
                                    <div>
                                        <h1>Cupo solicitado</h1>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={`$ ${inputEnd.toLocaleString('en-US', {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}`}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const inputValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                setInputEnd(inputValue);
                                            }}
                                            onBlur={() => {
                                                setInputEnd((prevValue: number) => Math.min(1000000, Math.max(200000, prevValue)));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Segundo rango */}
                            <div className="mb-5 pt-10">
                                <Nouislider
                                    range={{ min: 0, max: 12 }} // Ajustar los límites para el segundo rango
                                    start={[inputStart2, inputEnd2]}
                                    step={1}
                                    connect={true}
                                    onSlide={slider2Update}
                                    tooltips={true}
                                />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4 mt-9">
                                    <div>
                                        <h1>Plazo Mensual</h1>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={` ${inputEnd2.toLocaleString('en-US', {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                            })}`}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const inputValue = parseInt(e.target.value.replace(/\D/g, ''), 10);
                                                setInputEnd2(inputValue);
                                            }}
                                            onBlur={() => {
                                                setInputEnd2((prevValue: number) => Math.min(12, Math.max(2, prevValue))); // Limitar el rango entre 2 y 12
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
