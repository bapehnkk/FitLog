import React, { useEffect, useState } from 'react';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useDatabase } from '@/context/DatabaseProvider';
import { Link } from 'react-router-dom';


import {
    TERipple,
    TEModal,
    TEModalDialog,
    TEModalContent,
    TEModalHeader,
    TEModalBody,
    TEModalFooter,
    TEInput,
} from "tw-elements-react";
import { TrashIcon } from '@heroicons/react/24/solid';

interface HomeProps {
}

const Home: React.FC<HomeProps> = () => {
    const { trainingDays, fetchTrainingDays, addTrainingDay, deleteTrainingDay } = useDatabase();
    const [date] = useState(new Date());

    useEffect(() => {
        fetchTrainingDays(); // Загрузить данные при монтировании компонента
    }, [fetchTrainingDays]);


    // const onChange = (newDate: Date) => {
    //     setDate(newDate);
    //     // Add logic here to display workout details
    // };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTrainingName, setNewTrainingName] = useState("");

    const onAddTrainingDay = async () => {
        if (newTrainingName) {
            await addTrainingDay({ id: Date.now(), name: newTrainingName, date: date.toISOString().split('T')[0] });
            setIsModalOpen(false); // Закрыть модальное окно
            setNewTrainingName(""); // Сбросить название тренировки
            fetchTrainingDays(); // Обновить список тренировок
        }
    };



    return (
        <div className="flex flex-col items-center justify-center p-4">
            <Calendar
                // onChange={onChange}
                value={date}
                className="border rounded-lg"
            />
            <div className="workouts-list my-4">
                {/* The list of workouts will be displayed here */}
                <h2 className="text-4xl font-medium leading-tight">

                    List of Workouts
                </h2>
                {/* Example list of workouts (can be replaced with a dynamic list) */}
                <ul className="w-96">
                    {trainingDays.map((day) => (
                        <li className="w-full flex justify-between items-center">
                            <TERipple key={day.id} className="w-full  py-1">
                                <Link
                                    to={`/workout/${day.id}`}
                                    className="block w-full cursor-pointer rounded-lg p-4 transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200">
                                    {day.name} - {day.date}
                                </Link>
                            </TERipple>
                            <button
                                onClick={() => day.id && deleteTrainingDay(day.id)}
                                className="inline-block rounded bg-danger p-1.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                type='button'
                            >
                                <TrashIcon className="h-4 w-4 text-neutral-50" />
                            </button>
                        </li>

                    ))}
                </ul>
            </div>
            <div className="add-workout-button">
                {/* Button to add a new workout */}

                <TERipple rippleColor="white">
                    <button
                        type="button"
                        className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
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
                                        label="Training Name"
                                        value={newTrainingName}
                                        onChange={(e) => setNewTrainingName(e.target.value)}
                                    ></TEInput>
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
                                        onClick={onAddTrainingDay}
                                    >
                                        Save changes
                                    </button>
                                </TERipple>
                            </TEModalFooter>
                        </TEModalContent>
                    </TEModalDialog>
                </TEModal>
            </div>
        </div>
    );
};

export default Home;
