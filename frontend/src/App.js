import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RatingPage from './Components/ratingPage/ratingpage'; 
import Test from './Components/test'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/ratingpage" />} />
        <Route path="/ratingpage" element={<RatingPage />} />
        <Route path ="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;