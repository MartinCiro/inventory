import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Tasklist from './components/TaskList.jsx';
import TaskForm from './components/TaskForm.jsx';
import { Container } from '@mui/material';
import Navbar from './components/Navbar'
import CreateItem from './components/CreateItem.jsx';
import Home from './components/Home.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
        <Container >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<TaskForm />} />
          </Routes>
      </Container>
    </BrowserRouter>
  )
}
