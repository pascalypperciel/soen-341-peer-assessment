import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Sign-Login/LoginPage';
import SignupPage from './Components/Sign-Login/SignupPage';
import Header from './Components/Sign-Login/header';
import Footer from './Components/Sign-Login/footer';
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="layout">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


export default App;
