import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import Navbar from './Navbar';
import Home from './Home';
import EL from './EL';
import MatchesDetail from './MatchesDetail';
import NoMatch from './NoMatch';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="ngoai-hang-anh" element={<EL />} />
        <Route path="chi-tiet-tran-dau/:matchId" element={<MatchesDetail />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Router>
  );
}

export default App;
