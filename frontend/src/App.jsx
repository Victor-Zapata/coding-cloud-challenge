
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import DetailOrder from './pages/DetailOrder';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/order/:id" element={<DetailOrder />} />
    </Routes>
  )
}

export default App;
