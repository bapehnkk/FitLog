import React, { useEffect, useRef, useState } from 'react';
import {
    TEInput,
    TERipple,
    TECollapse,
} from "tw-elements-react";
import { WrenchIcon } from '@heroicons/react/24/solid';


export interface CollapseExerciseProps {
    label: string;
    onChange: (value: number) => void;
}

export const CollapseExercise: React.FC<CollapseExerciseProps> = ({ label, onChange }) => {
    const [show, setShow] = useState(false);
    const ref = useRef(null);

    const toggleShow = () => setShow(!show);

    // Функция для проверки, был ли клик снаружи компонента
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !(ref.current as any).contains(event.target as Node)) {
            setShow(false);
        }
    };

    useEffect(() => {
        // Добавляем слушатель события при монтировании компонента
        document.addEventListener('mousedown', handleClickOutside);

        // Удаляем слушатель события при размонтировании компонента
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={ref} className='relative'>
            <TECollapse horizontal className="max-w-[200px] absolute right-7 top-0 mt-0" show={show}>
                <div className="block rounded-lg w-[200px] bg-white p-1 pt-2 pb-2 shadow-lg dark:bg-neutral-700 dark:text-neutral-50">
                    <TEInput
                        type="number"
                        onChange={e => onChange(parseInt(e.target.value))}
                        label={label}
                    />
                </div>
            </TECollapse>
            <TERipple rippleColor="light">
                <button
                    type="button"
                    className="inline-block rounded bg-warning p-1.5 text-xs font-medium uppercase leading-normal text-white shadow-md"
                    onClick={toggleShow}
                >
                    <WrenchIcon className="h-4 w-4 text-neutral-50" />
                </button>
            </TERipple>
        </div>
    );
};
export default CollapseExercise;