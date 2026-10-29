import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';
import HelpButton from './components/chat/HelpButton';
import ChatModal from './components/chat/ChatModal';
import { useSelector } from 'react-redux';

function App() {
  const { isOpen } = useSelector((state) => state.chat);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
      <HelpButton />
      {isOpen && <ChatModal />}
    </Router>
  );
}

export default App;
