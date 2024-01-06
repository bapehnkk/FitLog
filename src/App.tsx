import { useEffect } from 'react';
import AppRouter from '@/routes/AppRouter';
import { DatabaseProvider, createDatabaseStructure } from '@/context/DatabaseProvider';
import ThemeSwitcher from '@/components/ThemeSwitcher';


function App() {
  useEffect(() => {
    createDatabaseStructure();
  }, []);

  // Остальная часть компонента App
  return (
    <div className="app-container bg-backgroundMain min-h-screen">
    <ThemeSwitcher />
      <DatabaseProvider>
        <AppRouter/>
      </DatabaseProvider>
    </div>
  );
}

export default App;
