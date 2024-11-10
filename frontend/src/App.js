import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Landing from "./Components/landingPage/Landing";
import SignupPage from "./Components/Sign-Login/SignupPage";
import Teams from "./Components/TeamPage/Teams";
import RatingPage from "./Components/ratingPage/ratingpage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/landing" />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/ratingpage" element={<RatingPage />} />
      </Routes>
    </Router>
  );
};

export default App;
