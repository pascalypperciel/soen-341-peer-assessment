import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./Components/landingPage/Landing";
import Contact from "./Components/contact/Components/Contact";
import SignupPage from "./Components/Sign-Login/SignupPage";
import Teams from "./Components/TeamPage/Teams";
import RatingPage from "./Components/ratingPage/ratingpage";
import ShortSummary from "./Components/Summary-Instructor/short-summary";
import LongSummary from "./Components/Summary-Instructor/long-summary";
import DashboardInstructor from "./Components/Summary-Instructor/dashboard-instructor";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/ratingpage" element={<RatingPage />} />
        <Route path="/shortsummary" element={<ShortSummary />} />
        <Route path="/longsummary" element={<LongSummary />} />
        <Route path="/dashboardinstructor" element={<DashboardInstructor />} />
      </Routes>
    </Router>
  );
};

export default App;
