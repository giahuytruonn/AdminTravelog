import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import ToursPage from './pages/ToursPage';
import CouponsPage from './pages/CouponsPage';
import DestinationsPage from './pages/DestinationsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tours" element={<ToursPage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;