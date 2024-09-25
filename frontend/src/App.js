import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './Components/Sign-Login/SignupPage'; 
import LoginPage from './Components/Sign-Login/LoginPage';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect from "/" to "/signup" */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  );
};

export default App;