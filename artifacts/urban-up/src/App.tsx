import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import NotFound from '@/pages/not-found';

import Dashboard from '@/pages/dashboard';
import Traffic from '@/pages/traffic';
import SafePaths from '@/pages/safe-paths';
import EcoRewards from '@/pages/eco';
import WalletPage from '@/pages/wallet';
import MunicipalityPage from '@/pages/municipality';
import StorePage from '@/pages/store';
import EventsPage from '@/pages/events';
import EventsCreatePage from '@/pages/events-create';
import EventDetailPage from '@/pages/event-detail';

// New pages
import CarbonPage from '@/pages/carbon';
import ToursPage from '@/pages/tours';
import ToursCreatePage from '@/pages/tours-create';
import DestinationOfMonthPage from '@/pages/destination-of-month';
import SuggestionsPage from '@/pages/suggestions';
import SuggestionsCreatePage from '@/pages/suggestions-create';
import ComplaintsPage from '@/pages/complaints';
import ComplaintsCreatePage from '@/pages/complaints-create';
import FuelPage from '@/pages/fuel';
import AdminStatusPage from '@/pages/admin-status';
import ContentManagerPage from '@/pages/content-manager';
import ServicesDirectoryPage from '@/pages/services-directory';
import ReportObstaclePage from '@/pages/report-obstacle';
import AwarenessPage from '@/pages/awareness';
import { LoginPage } from '@/pages/Login';

import { I18nProvider } from '@/lib/i18n-context';
import { ThemeProvider } from '@/lib/theme-context';
import { ContentProvider } from '@/lib/content-context';
import { Chatbot } from '@/components/Chatbot';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/dashboard" />} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/login" component={LoginPage} />
      <Route path="/traffic" component={Traffic} />
      <Route path="/safe-paths" component={SafePaths} />
      <Route path="/municipality" component={MunicipalityPage} />
      <Route path="/suggestions/create" component={SuggestionsCreatePage} />
      <Route path="/suggestions" component={SuggestionsPage} />
      <Route path="/complaints/create" component={ComplaintsCreatePage} />
      <Route path="/complaints" component={ComplaintsPage} />
      <Route path="/admin/status" component={AdminStatusPage} />
      <Route path="/admin/content" component={ContentManagerPage} />
      <Route path="/services-directory" component={ServicesDirectoryPage} />
      <Route path="/report-obstacle" component={ReportObstaclePage} />
      <Route path="/awareness" component={AwarenessPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ContentProvider>
        <I18nProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <Router />
                <Chatbot />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </QueryClientProvider>
        </I18nProvider>
      </ContentProvider>
    </ThemeProvider>
  );
}

export default App;
