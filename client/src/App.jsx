import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import Editor from './pages/Editor';

function App() {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/dashboard" element={userData ? <Dashboard /> : <Home />} />
        <Route path="/generate" element={userData ? <Generate /> : <Home />} />
        <Route path="/editor/:id" element={userData ? <Editor /> : <Home />} />
      </Routes>
    </div>
  )
}

export default App
