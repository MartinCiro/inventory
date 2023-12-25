import { TextDecrease, Edit, Delete, Save, CalendarMonth } from '@mui/icons-material';
import { Card, CardContent, Typography, Button, ButtonGroup, Container, TableContainer, TableHead, TableBody, Table, TableRow, TableCell, TextField } from '@mui/material';
import { React, useEffect, useState } from 'react';
import { styled } from '@mui/system';


import { useNavigate } from 'react-router-dom';

const ThCenter = styled(TableCell)({
  textAlign: 'center',
  padding: '1rem',
  color: '#f5e4e4',
  fontSize: '1.2rem',
  borderBottom: '.01rem solid rgb(41, 231, 196)',
});

const TdCenter = styled(TableCell)({
  textAlign: 'center',
  color: 'rgb(223, 238, 235)',
  fontSize: '0.8rem',
  borderBottom: '.01rem solid rgb(109, 110, 110)',
  
});
const StyledTextField = styled(TextField)({
  width: '100%',
});


export default function Tasklist() {
  const [fechas, setTask] = useState([]);
  const navigate = useNavigate();

  const loadTasks = async () => {
    const response = await fetch('http://localhost:4000/fechas')
    const data = await response.json()
    setTask(data.result)
  }
  const handleDelete = async (id, ide) => {
    await fetch(`http://localhost:4000/fechas?id=${id}&ide=${ide}`, {
      method: 'DELETE'
    })
    setTask(fechas.filter(fecha => fecha.id !== id || fecha.ide !== ide))
  }
  useEffect(() => { //call the function chargeData when the component is mounted
    loadTasks()
  }, []);
  return (
    <>
      <Container style={{ background: '#18181b', minHeight: '90vh', borderRadius: '0.8rem' }}>
        <h1 style={{ textAlign: 'center', color: '#f5e4e4', paddingTop: '1rem', marginBottom: '1rem', fontWeight: 'bold' }}>Historial</h1>

        <TableContainer style={{ display: 'flex', justifyContent: 'center' }}>
        <Table sx={{ minWidth: 70 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <ThCenter>Tipo</ThCenter>
              <ThCenter>Mes</ThCenter>
              <ThCenter>Descripcion</ThCenter>
              <ThCenter>Monto</ThCenter>
              <ThCenter>Fecha</ThCenter>
              <ThCenter>Acciones</ThCenter>
            </TableRow>
          </TableHead>
          <TableBody>
            {fechas.map(fecha =>
              <TableRow key={`${fecha.id}-${fecha.ide}`}>
                <TdCenter><TextField defaultValue={fecha.origen} size='small' color='secondary' variant="outlined"></TextField></TdCenter>
                <TdCenter>{fecha.mes}</TdCenter>
                <TdCenter>{fecha.descripcion}</TdCenter>
                <TdCenter>{fecha.monto}</TdCenter>
                <TdCenter>{fecha.fecha}</TdCenter>
                <TdCenter>
                  <Button color='inherit' onClick={() => navigate(`/${fecha.id, fecha.ide}`)} style={{ marginRight: '.5rem' }}><Save color='primary' /></Button>
                  
                  <Button color='inherit' onClick={() => handleDelete(fecha.id, fecha.ide)}><Delete color='error' /></Button></TdCenter>
              </TableRow>
            )}
          </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  )
}
