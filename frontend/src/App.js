import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./Components/landingPage/Home";
import SignupPage from "./Components/Sign-Login/SignupPage";
import Contact from "./Components/Contact/Contact";
import Teams from "./Components/TeamPage/Teams";
import RatingPage from "./Components/ratingPage/ratingpage";
import Feedback from "./Components/feedbackPage/Feedback";
import AnnouncementsPage from "./Components/announcementPage/AnnouncementsPage";
import ShortSummary from "./Components/Summary-Instructor/short-summary";
import LongSummary from "./Components/Summary-Instructor/long-summary";
import DashboardInstructor from "./Components/Summary-Instructor/dashboard-instructor";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="contact" element={<Contact />}/>
        <Route path="/teams" element={<Teams />} />
        <Route path="/ratingpage" element={<RatingPage />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/shortsummary" element={<ShortSummary />} />
        <Route path="/longsummary" element={<LongSummary />} />
        <Route path="/dashboardinstructor" element={<DashboardInstructor />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
