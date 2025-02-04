import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MedicalDocumentation from "./pages/MedicalDocumentation";
import NotFound from "./pages/NotFound";
import SubscriptionPlans from "./pages/SubscriptionPlans";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/medical-documentation" element={<MedicalDocumentation />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;