import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LandingPage from "./Components/LandingPage/LandingPage";
import SignupPage from "./Components/SignupLogin/SignupLogin";
import Contact from "./Components/Contact/Contact";
import Teams from "./Components/Teams/Teams";
import FeedbackPage from "./Components/Feedback/FeedbackPage";
import AboutUs from "./Components/AboutUsPage/AboutUs";
import RatingPage from "./Components/Rating/RatingPage";
import AnnouncementsPage from "./Components/Announcement/AnnouncementsPage";
import ShortSummary from "./Components/DashboardInstructor/ShortSummary";
import LongSummary from "./Components/DashboardInstructor/LongSummary";
import DashboardInstructor from "./Components/DashboardInstructor/DashboardInstructor";
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="contact" element={<Contact />}/>
        <Route path="/teams" element={<Teams />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/ratingpage" element={<RatingPage />} />
        <Route path="/shortsummary" element={<ShortSummary />} />
        <Route path="/longsummary" element={<LongSummary />} />
        <Route path="/dashboardinstructor" element={<DashboardInstructor />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
