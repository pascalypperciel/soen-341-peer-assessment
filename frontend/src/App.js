import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignupPage from './Components/Sign-Login/SignupPage'; 
import HomeStudent from './Components/Sign-Login/homeStudent'; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect from "/" to "/signup" */}
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/homeStudent" element={<HomeStudent />} />
      </Routes>
    </Router>
  );
};

export default App;