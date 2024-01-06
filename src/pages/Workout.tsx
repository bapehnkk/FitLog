import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDatabase, TrainingDay } from '@/context/DatabaseProvider';
import {
    TEToast,
    TEInput,
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
    TESelect, TETabs, TETabsItem, TETabsContent, TETabsPane
} from "tw-elements-react";
import { ArrowUturnLeftIcon, ClockIcon, CalculatorIcon } from '@heroicons/react/24/solid';

import { Link } from 'react-router-dom';
import ExerciseTabs from '@/components/ExerciseTabs';
import clsx from "clsx";


interface ActiveTabBorderWrapperProps {
    children: React.ReactNode;
    isActive: boolean;
}

const ActiveTabBorderWrapper: React.FC<ActiveTabBorderWrapperProps> = ({ children, isActive }) => (
    <div className={clsx('relative', { 'border-r-2 border-primary': isActive })}>
        {children}
    </div>
);

interface Exercise {
    name: string;
    sets: number;
    repetitions: number | null;
    weight: number;
    type: any;
    duration: number | null;
}


const Workout: React.FC = () => {
    const { id } = useParams();
    const { fetchTrainingDayDetails, addExercise, fetchExercisesForTrainingDay } = useDatabase();
    const [trainingDay, setTrainingDay] = useState({} as TrainingDay);
    const [newExercise, setNewExercise] = useState<Exercise>({
        name: '',
        sets: 0,
        repetitions: null,
        weight: 0,
        type: 1,
        duration: null
    });
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        if (id) {
            fetchTrainingDayDetails(parseInt(id)).then(data => {
                setTrainingDay(data);
            });
            fetchExercisesForTrainingDay(parseInt(id));
        }
    }, [id, fetchTrainingDayDetails, fetchExercisesForTrainingDay]);

    const handleAddExercise = async () => {
        if (trainingDay) {
            const exerciseType = typeof newExercise.type === 'number' ? newExercise.type : (newExercise.type as any).value || 1;
            await addExercise({ ...newExercise, training_day_id: trainingDay.id, type: exerciseType });

            setShowToast(true);
            setToastMessage(`Упражнение ${newExercise.name} добавлено`);
            setNewExercise({ name: '', sets: 0, repetitions: null, weight: 0, type: 1, duration: null }); // Очистка формы после добавления
            setIsModalOpen(false)
        }
    };


    const [verticalActive, setVerticalActive] = useState("tab1");

    const handleVerticalClick = (value: string) => {
        if (value === verticalActive) {
            return;
        }
        setVerticalActive(value);

        // Reset the field that is not active
        if (value === "tab1") {
            setNewExercise({
                ...newExercise,
                duration: null, // Reset duration when tab1 is active
            });
        } else {
            setNewExercise({
                ...newExercise,
                repetitions: null, // Reset repetitions when tab2 is active
            });
        }
    };


    return (
        <div className='flex flex-col items-center justify-center p-4 gap-4'>
            {/* Отображение типа тренировки */}

            <div className='w-full'>
                <TERipple>
                    <Link
                        to={'/'}
                        className="block rounded border-2 border-neutral-800 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-800 transition duration-150 ease-in-out hover:border-neutral-800 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-800 focus:border-neutral-800 focus:text-neutral-800 focus:outline-none focus:ring-0 active:border-neutral-900 active:text-neutral-900 dark:border-neutral-900 dark:text-neutral-900 dark:hover:border-neutral-900 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10 dark:hover:text-neutral-900 dark:focus:border-neutral-900 dark:focus:text-neutral-900 dark:active:border-neutral-900 dark:active:text-neutral-900"
                    >
                        <ArrowUturnLeftIcon className="h-4 w-4 text-dark-50" />
                    </Link>
                </TERipple>
            </div>
            {trainingDay &&
                <h2 className="w-full text-4xl font-medium leading-tight pl-4">
                    {trainingDay.name}
                </h2>
            }

            {/* Отображение списка упражнений */}
            <ExerciseTabs />


            {/* Кнопка для добавления упражнения */}

            <TERipple rippleColor="white">
                <button
                    type="button"
                    className="mt-5 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add New Workout
                </button>
            </TERipple>
            <TEModal show={isModalOpen} setShow={setIsModalOpen} scrollable>
                <TEModalDialog size="fullscreen">
                    <TEModalContent>
                        <TEModalHeader>
                            {/* <!-- Modal title --> */}
                            <h5 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                                Add New Workaut
                            </h5>
                            {/* <!--Close button--> */}
                            <button
                                type="button"
                                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                onClick={() => setIsModalOpen(false)}
                                aria-label="Close"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="h-6 w-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </TEModalHeader>
                        {/* <!--Modal body--> */}
                        <TEModalBody>
                            <div className="px-10 text-center leading-[3rem]">
                                <TEInput
                                    type="text"
                                    value={newExercise.name}
                                    onChange={e => setNewExercise({ ...newExercise, name: e.target.value })}
                                    label="Название упражнения"
                                    className="mb-6"
                                />
                                <TEInput
                                    type="number"
                                    value={newExercise.sets != 0 ? newExercise.sets : ""}
                                    onChange={e => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                                    label="Количество подходов"
                                    className="my-3"
                                />


                                <div className="flex items-center my-3">
                                    <TETabs vertical>
                                        <ActiveTabBorderWrapper isActive={verticalActive === "tab1"}>
                                            <TETabsItem
                                                onClick={() => handleVerticalClick("tab1")}
                                                active={verticalActive === "tab1"}
                                                className=' !border-b-[0px] !m-0'
                                            >
                                                <CalculatorIcon className="h-8 w-8 text-dark-50" />
                                            </TETabsItem>
                                        </ActiveTabBorderWrapper>

                                        <ActiveTabBorderWrapper isActive={verticalActive === "tab2"}>

                                            <TETabsItem
                                                onClick={() => handleVerticalClick("tab2")}
                                                active={verticalActive === "tab2"}
                                                className=' !border-b-[0px] !m-0 '
                                            >
                                                <ClockIcon className="h-8 w-8 text-dark-50" />
                                            </TETabsItem>
                                        </ActiveTabBorderWrapper>
                                    </TETabs>

                                    <TETabsContent
                                        className={'max-w-full mx-auto h-full flex items-center justify-center'}
                                    >
                                        <TETabsPane
                                            show={verticalActive === "tab1"}
                                            className={verticalActive === "tab1" ? "pane-active" : ""}
                                        >
                                            <TEInput
                                                type="number"
                                                value={newExercise.repetitions != null ? newExercise.repetitions : ""}
                                                onChange={e => setNewExercise({
                                                    ...newExercise,
                                                    repetitions: parseInt(e.target.value)
                                                })}
                                                label="Количество повторений"
                                                className="my-auto"
                                            />
                                        </TETabsPane>
                                        <TETabsPane
                                            show={verticalActive === "tab2"}
                                            className={verticalActive === "tab2" ? "pane-active" : ""}
                                        >

                                            <TEInput
                                                type="number"
                                                value={newExercise.duration != null ? newExercise.duration : ""}
                                                onChange={e => setNewExercise({
                                                    ...newExercise,
                                                    duration: e.target.value ? parseInt(e.target.value) : null
                                                })}
                                                label="Время подхода (cек)"
                                                className="my-auto"
                                            />
                                        </TETabsPane>
                                    </TETabsContent>
                                </div>
                                <TEInput
                                    type="number"
                                    value={newExercise.weight != 0 ? newExercise.weight : ""}
                                    onChange={e => setNewExercise({ ...newExercise, weight: parseInt(e.target.value) })}
                                    label="Вес"
                                    className="mb-6"
                                />

                                <TESelect
                                    data={[
                                        { text: "Разминка", value: 1 },
                                        { text: "Основная тренировка", value: 2 },
                                        { text: "Заминка", value: 3 },
                                        { text: "Дополнительные упражнения", value: 4 },
                                    ]}
                                    label="Тип упражнения"
                                    onValueChange={value => setNewExercise({ ...newExercise, type: value as number })}
                                />
                            </div>
                        </TEModalBody>
                        <TEModalFooter>
                            <TERipple rippleColor="light">
                                <button
                                    type="button"
                                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close
                                </button>
                            </TERipple>
                            <TERipple rippleColor="light">
                                <button
                                    type="button"
                                    className="ml-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                    onClick={handleAddExercise}
                                >
                                    Save changes
                                </button>
                            </TERipple>
                        </TEModalFooter>
                    </TEModalContent>
                </TEModalDialog>
            </TEModal>
            <div>
                <TEToast open={showToast} autohide={true} delay={3000} setOpen={setShowToast}>
                    <div
                        className="flex items-center justify-between rounded-t-lg border-b-2 border-neutral-100 border-opacity-100 bg-clip-padding px-4 pb-2 pt-2.5">
                        <p className="font-bold text-neutral-500 dark:text-neutral-200">
                            Успех
                        </p>
                        <div className="flex items-center">
                            <button
                                type="button"
                                className="ml-2 box-content rounded-none border-none opacity-80 hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                onClick={() => setShowToast(false)}
                                aria-label="Close"
                            >
                                <span
                                    className="w-[1em] focus:opacity-100 disabled:pointer-events-none disabled:select-none disabled:opacity-25 [&.disabled]:pointer-events-none [&.disabled]:select-none [&.disabled]:opacity-25">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="break-words rounded-b-lg px-4 py-4 text-neutral-700 dark:text-neutral-200">
                        {toastMessage}
                    </div>
                </TEToast>
            </div>
        </div>
    );
};

export default Workout;
