import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Homepage from './Pages/Homepage';
import Servicepage from './Pages/Servicepage';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/servicepage" element={<Servicepage />} />
      </Routes>
      <Footer />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
};

export default App;