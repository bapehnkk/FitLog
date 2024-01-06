import React, { createContext, useContext, useState } from 'react';
import Database from "@tauri-apps/plugin-sql";

export interface TrainingDay {
  id?: number;
  name: string;
  date: string;
}
export interface Exercise {
  id?: number;
  training_day_id?: number;
  type: number;
  name: string;
  sets: number;
  repetitions: number | null;  // Может быть `null`, если используется время
  weight: number;              // Может быть `null`, если вес не применим
  duration: number | null;     // Может быть `null`, если используются повторения
}


export interface ExerciseType {
  id?: number;
  name: string; // Например, 'Разминка', 'Основные упражнения', 'Заминка'
}

export interface Template {
  id?: number;
  name: string;
  exercise_type_id: number;
  sets: number;
  repetitions: number;
  weight: number;
}

export interface DatabaseContextProps {
  trainingDays: TrainingDay[];
  exercises: Exercise[];
  exerciseTypes: ExerciseType[];
  templates: Template[];
  fetchTrainingDays: () => Promise<void>;
  addTrainingDay: (newDay: TrainingDay) => Promise<void>;
  deleteTrainingDay: (id: number) => Promise<number>;
  updateTrainingDay: (updatedDay: TrainingDay) => Promise<void>;
  fetchTrainingDayDetails: (id: number) => Promise<TrainingDay>;
  addExercise: (exercise: Exercise) => Promise<number>;
  deleteExercise: (exerciseId: number) => Promise<number>;
  updateExercise: (exerciseId: number, updates: Partial<Exercise>) => Promise<number>;
  fetchExercisesForTrainingDay: (trainingDayId: number) => Promise<void>;
}



const DatabaseContext = createContext<DatabaseContextProps>({} as DatabaseContextProps);

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseTypes] = useState<ExerciseType[]>([]);
  const [templates] = useState<Template[]>([]);

  // Functions for interacting with the database

  // Function for fetching training days
  const fetchTrainingDays = async () => {
    const db = await Database.load("sqlite:test.db");
    const result = await db.select<TrainingDay[]>("SELECT * FROM training_days");
    setTrainingDays(result);
  };

  // Функция для добавления нового тренировочного дня
  //Function for adding a new training day
  const addTrainingDay = async (newDay: TrainingDay) => {
    const db = await Database.load("sqlite:test.db");
    await db.execute("INSERT INTO training_days (name, date) VALUES ($1, $2)", [newDay.name, newDay.date]);
    fetchTrainingDays(); // Update the state after adding // Обновить состояние после добавления 
  };

  const deleteTrainingDay = async (id: number) => {
    const db = await Database.load("sqlite:test.db");
    const query = "DELETE FROM training_days WHERE id = $1";
    const result = await db.execute(query, [id]);
    return result.rowsAffected; // Возвращает количество удаленных строк
  };

  // Функция для обновления тренировочного дня
  // Function for updating a training day
  const updateTrainingDay = async (updatedDay: TrainingDay) => {
    const db = await Database.load("sqlite:test.db");
    await db.execute("UPDATE training_days SET name = $1, date = $2 WHERE id = $3", [updatedDay.name, updatedDay.date, updatedDay.id]);
    fetchTrainingDays();
  };

  // Function for fetching training day details
  const fetchTrainingDayDetails = async (id: number) => {
    const db = await Database.load("sqlite:test.db");
    const results = await db.select<TrainingDay[]>("SELECT * FROM training_days WHERE id = $1", [id]);
    return results[0]; // Возвращает первую запись, если она есть
  };



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Function for fetching exercises for a training day
  const fetchExercisesForTrainingDay = async (training_day_id: number) => {
    const db = await Database.load("sqlite:test.db");
    const query = "SELECT * FROM exercises WHERE training_day_id = $1";
    const exercises = await db.select<Exercise[]>(query, [training_day_id]);
    setExercises(exercises); // Возвращает список упражнений для данного дня тренировки
  };

  // Function for fetching exercises
  const addExercise = async (exercise: Exercise) => {
    const db = await Database.load("sqlite:test.db");
    const query = `
        INSERT INTO exercises (training_day_id, type, name, sets, repetitions, weight, duration) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const result = await db.execute(query, [
      exercise.training_day_id,
      exercise.type,
      exercise.name,
      exercise.sets,
      exercise.repetitions,
      exercise.weight,
      exercise.duration
    ]);
    return result.lastInsertId; // Возвращает ID вставленного упражнения
  };



  // Function for fetching exercise types
  const deleteExercise = async (exerciseId: number) => {
    const db = await Database.load("sqlite:test.db");
    const query = "DELETE FROM exercises WHERE id = $1";
    const result = await db.execute(query, [exerciseId]);
    return result.rowsAffected; // Возвращает количество удаленных строк
  };


  // Function for fetching templates
  const updateExercise = async (exerciseId: number, updates: Partial<Exercise>) => {
    const db = await Database.load("sqlite:test.db");
    const query = `
        UPDATE exercises 
        SET sets = $1, repetitions = $2, weight = $3, duration = $4, type = $5 
        WHERE id = $6
    `;
    const result = await db.execute(query, [
      updates.sets,
      updates.repetitions,
      updates.weight,
      updates.duration,
      updates.type,
      exerciseId
    ]);
    return result.rowsAffected; // Возвращает количество обновленных строк
  };





  return (
    <DatabaseContext.Provider value={{
      trainingDays,
      exercises,
      exerciseTypes,
      templates,
      fetchTrainingDays,
      addTrainingDay,
      deleteTrainingDay,
      updateTrainingDay,
      fetchTrainingDayDetails,
      addExercise,
      deleteExercise,
      updateExercise,
      fetchExercisesForTrainingDay,
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export async function createDatabaseStructure() {
  const db = await Database.load("sqlite:test.db");

  // await db.execute(`DROP TABLE IF EXISTS exercises;`);
  // await db.execute(`DROP TABLE IF EXISTS training_days;`);
  // await db.execute(`DROP TABLE IF EXISTS templates;`);

  // Создание таблиц
  await db.execute(`
    CREATE TABLE IF NOT EXISTS training_days (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date DATE
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS exercises (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      training_day_id INTEGER,
      type INTEGER CHECK (type >= 1 AND type <= 4),
      name TEXT NOT NULL,
      sets INTEGER,
      repetitions INTEGER CHECK ((repetitions IS NOT NULL AND duration IS NULL) OR (repetitions IS NULL AND duration IS NOT NULL)),
      weight REAL,
      duration INTEGER, -- Добавлено новое поле для времени выполнения
      FOREIGN KEY(training_day_id) REFERENCES training_days(id)
    );
  `);


  await db.execute(`
    CREATE TABLE IF NOT EXISTS templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      exercise_type_id INTEGER,
      sets INTEGER,
      repetitions INTEGER,
      weight REAL,
      FOREIGN KEY(exercise_type_id) REFERENCES exercise_types(id)
    );
  `);
}
