import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import WebsiteEditor from './pages/WebsiteEditor';
import LiveSite from './pages/LiveSite';
import Pricing from './pages/Pricing';



function App() {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/dashboard" element={userData ? <Dashboard /> : <Home />} />
        <Route path="/generate" element={userData ? <Generate /> : <Home />} />
        <Route path="/editor/:id" element={userData ? <WebsiteEditor /> : <Home />} />
        <Route path='/site/:slug' element={<LiveSite />} />
        <Route path='/pricing' element={<Pricing />} />
      </Routes>
    </div>
  )
}

export default App
