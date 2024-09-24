import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Sign-Login/LoginPage';
import SignupPage from './Components/Sign-Login/SignupPage';
// Import other components as necessary

const App = () => {
  return (
    <Router>
      <Routes>
        {/*<Route path="/" element={<LoginPage />} />*/}
        <Route path="/signup" element={<SignupPage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
};

export default App;
