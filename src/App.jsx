import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Tasklist from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import { Container } from '@mui/material';
import Navbar from './components/Navbar'

export default function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
        <Container style={{ background: '#595959', minHeight: '90vh', borderRadius: '0.2rem' }}>
          <Routes>
            <Route path="/" element={<Tasklist />} />
            <Route path="/new" element={<TaskForm />} />
            <Route path="/edit/:id" element={<TaskForm />} />
          </Routes>
      </Container>
    </BrowserRouter>
  )
}
