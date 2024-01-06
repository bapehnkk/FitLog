import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { TETabs, TETabsContent, TETabsItem, TETabsPane } from "tw-elements-react";
import { CollapseExercise } from "@/components/CollapseExercise";
import { useDatabase } from '@/context/DatabaseProvider';

export const ExerciseTabs = () => {
    const [activeTab, setActiveTab] = useState("type1");
    const { deleteExercise, exercises, updateExercise } = useDatabase();

    // Группировка упражнений
    const groupedExercises = {
        type1: exercises.filter(ex => ex.type === 1),
        type2: exercises.filter(ex => ex.type === 2),
        type3: exercises.filter(ex => ex.type === 3),
        type4: exercises.filter(ex => ex.type === 4),
    };
    // console.log(groupedExercises);


    const handleExerciseUpdate = (exerciseId: number | undefined, field: string) => (newValue: any) => {
        // Находим текущее упражнение и обновляем его
        const updatedExercises = exercises.map(ex => {
            if (ex.id === exerciseId) {
                return { ...ex, [field]: newValue };
            }
            return ex;
        });

        // Находим обновленное упражнение
        const updatedExercise = updatedExercises.find(ex => ex.id === exerciseId);

        // Check if exerciseId is defined and updatedExercise is not undefined before updating the exercise
        if (exerciseId !== undefined && updatedExercise !== undefined) {
            // Call the updateExercise function with the exerciseId and updatedExercise
            updateExercise(exerciseId, updatedExercise)
                .then(rowsAffected => {
                    if (rowsAffected > 0) {
                        console.log(`Упражнение с ID ${exerciseId} обновлено.`);
                    }
                })
                .catch(error => {
                    console.error('Ошибка обновления упражнения:', error);
                });
        }
    };
    function convertSecondsToMinutes(seconds: number) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
    
        // Добавляем ведущий ноль, если необходимо
        let formattedMinutes = minutes.toString().padStart(2, '0');
        let formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    
        return `${formattedMinutes}:${formattedSeconds}`;
    }
    

    return (
        <div className="mb-3">
            <TETabs>
                <TETabsItem onClick={() => setActiveTab("type1")} active={activeTab === "type1"}>
                    Разминка
                </TETabsItem>
                <TETabsItem onClick={() => setActiveTab("type2")} active={activeTab === "type2"}>
                    Основные
                </TETabsItem>
                <TETabsItem onClick={() => setActiveTab("type3")} active={activeTab === "type3"}>
                    Заминка
                </TETabsItem>
                <TETabsItem onClick={() => setActiveTab("type4")} active={activeTab === "type4"}>
                    Дополнительные
                </TETabsItem>
            </TETabs>

            <TETabsContent>
                {Object.entries(groupedExercises).map(([type, exercisess]) => (
                    <TETabsPane key={type} show={activeTab === type}>
                        {/* Здесь можно вставить ваш список упражнений для каждого типа */}
                        <ul className="w-96 mx-auto">
                            {exercisess.map(exercise => (
                                <li key={exercise.id} className="w-full border-b-2 border-neutral-100 border-opacity-100 py-4 dark:border-opacity-50">
                                    <ul className='flex flex-col gap-1'>
                                        <li className='flex justify-between'>
                                            <p>{exercise.name}</p>
                                            <button
                                                onClick={() => exercise.id && deleteExercise(exercise.id)}
                                                className="inline-block rounded bg-danger p-1.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                                type='button'
                                            >
                                                <TrashIcon className="h-4 w-4 text-neutral-50" />
                                            </button>
                                        </li>
                                        <li className='flex justify-between'>
                                            <p>
                                                Подходы: {exercise.sets}
                                            </p>

                                            <CollapseExercise
                                                label={'Подходы'}
                                                onChange={handleExerciseUpdate(exercise.id, 'sets')}
                                            />
                                        </li>
                                        {exercise.repetitions ?
                                            <li className='flex justify-between'>
                                                <p>
                                                    Повторения: {exercise.repetitions}
                                                </p>

                                                <CollapseExercise
                                                    label="Повторения"
                                                    onChange={handleExerciseUpdate(exercise.id, 'repetitions')}
                                                />
                                            </li> :
                                            <li className='flex justify-between'>
                                                <p>
                                                    Время повтора: {convertSecondsToMinutes(exercise.duration || 0)} мин
                                                </p>

                                                <CollapseExercise
                                                    label="Время повтора (сек)"
                                                    onChange={handleExerciseUpdate(exercise.id, 'duration')}
                                                />
                                            </li>
                                        }
                                        <li className='flex justify-between'>
                                            <p>
                                                Вес: {exercise.weight} кг
                                            </p>

                                            <CollapseExercise
                                                label="Вес"
                                                onChange={handleExerciseUpdate(exercise.id, 'weight')}
                                            />
                                        </li>
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </TETabsPane>
                ))}
            </TETabsContent>
        </div>
    );
};

export default ExerciseTabs;