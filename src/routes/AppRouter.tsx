import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Workout from '@/pages/Workout';
import Templates from '@/pages/Templates';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

export const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/workout/:id" element={<Workout />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
};
export default AppRouter;