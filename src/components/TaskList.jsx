import React, { useEffect, useState } from 'react';
import { TextDecrease, Edit, Delete, Save, CalendarMonth } from '@mui/icons-material';
import { styled } from '@mui/system';
import { Card, CardContent, Typography, Button, ButtonGroup, Container, TableContainer, TableHead, TableBody, Table, TableRow, TableCell, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

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
  let [meses] = useState([
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ])
  const navigate = useNavigate();

  const loadTasks = async () => {
    try {
      const response = await fetch('http://localhost:4000/fechas');
      const data = await response.json();
      setTask(data.result);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleDelete = async (id, ide) => {
    try {
      await fetch(`http://localhost:4000/fechas?id=${id}&ide=${ide}`, {
        method: 'DELETE',
      });
      setTask(fechas.filter((fecha) => fecha.id !== id || fecha.ide !== ide));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const setChange = async (id, ide, origen, updatedValue, updatedValue2) => {
    await fetch(`http://localhost:4000/fechas`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id, ide: ide, tabla: origen, cambio: updatedValue, campo: updatedValue2 }),
    })
    .then(() => {
      if (/^\d{4}-\d{2}-\d{2}$/.test(updatedValue)) {
        loadTasks();
      }
      /* navigate('/');   */    
    })
    .catch((error) => {
      console.error('Error updating task:', error);
    });
  };
  

  useEffect(() => {
    loadTasks();
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
              {fechas.map((fecha) => (
                <TableRow key={`${fecha.id}-${fecha.ide}`}>
                  <TdCenter>{fecha.origen}</TdCenter>
                  <TdCenter>{meses[new Date(fecha.fecha).getMonth()]}</TdCenter>
                  <TdCenter>
                  <StyledTextField
                    defaultValue={fecha.descripcion}
                    autoComplete="off"
                    multiline={true}
                    onBlur={(e) => setChange(fecha.id, fecha.ide, fecha.origen, e.target.value, 'descripcion')}
                    inputProps={{ min: 0, style: { textAlign: 'center', color: 'rgb(223, 238, 235)', fontSize: '0.8rem' } }}
                    variant="standard"
                  />
                  </TdCenter>
                  <TdCenter><StyledTextField
                    defaultValue={fecha.monto}
                    autoComplete="off"
                    onBlur={(e) => setChange(fecha.id, fecha.ide, fecha.origen, e.target.value, 'monto')}
                    inputProps={{ min: 0, style: { textAlign: 'center', color: 'rgb(223, 238, 235)', fontSize: '0.8rem' } }}
                    variant="standard"
                    itemType='number'
                  /></TdCenter>
                  <TdCenter><StyledTextField
                    type="date"
                    defaultValue={fecha.fecha}
                    autoComplete="off"
                    onBlur={(e) => setChange(fecha.id, fecha.ide, fecha.origen, e.target.value, 'fecha')}
                    inputProps={{ min: 0, style: { textAlign: 'center', color: 'rgb(223, 238, 235)', fontSize: '0.8rem' } }}
                    variant="standard"
                  /></TdCenter>
                  <TdCenter>
                    <Button color='inherit' onClick={() => handleDelete(fecha.id, fecha.ide)}>
                      <Delete color='error' />
                    </Button>
                  </TdCenter>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}
