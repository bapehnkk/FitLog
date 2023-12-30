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
    <div className="app-container">
    <ThemeSwitcher />
      <DatabaseProvider>
        <AppRouter/>
      </DatabaseProvider>
    </div>
  );
}

export default App;
