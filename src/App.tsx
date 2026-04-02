import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { AMLPage } from '@/pages/AMLPage';
import { LicensingPage } from '@/pages/LicensingPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { DisputesPage } from '@/pages/DisputesPage';
import { DisciplinaryPage } from '@/pages/DisciplinaryPage';
import { SalespersonsPage } from '@/pages/SalespersonsPage';
import { AdvertisementsPage } from '@/pages/AdvertisementsPage';
import { ChatbotPage } from '@/pages/ChatbotPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/aml" element={<AMLPage />} />
          <Route path="/licensing" element={<LicensingPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/disputes" element={<DisputesPage />} />
          <Route path="/disciplinary" element={<DisciplinaryPage />} />
          <Route path="/salespersons" element={<SalespersonsPage />} />
          <Route path="/advertisements" element={<AdvertisementsPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
