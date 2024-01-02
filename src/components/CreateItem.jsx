import React, { useEffect, useState } from 'react';
import { AddOutlined, RemoveOutlined } from '@mui/icons-material';
import { styled } from '@mui/system';
import { Card, CardContent, Typography, Button, Container, Grid, InputLabel, Input } from '@mui/material';

const InputStyle = styled(Input)({
  display: 'block',
  margin: '0.5rem 0',
  border: '1px solid gray',
  borderRadius: '5px',
  backgroundColor: '#73737d',
  color: '#cbd5e1',
  variant: 'standard',
});

const LabelStyle = styled(InputLabel)({
  color: '#cbd5e1',
});


export default function CreateItem() {
  const [suma, setSumas] = useState([])
  const [selectedId, setSelectedId] = useState({ id: '', fecha: null });

  const [fechas, setFechas] = useState({
    id: selectedId.id,
    fecha: new Date().toISOString().slice(0, 10) || selectedId.fecha,
    descripcion: '',
    monto: '',
    tipo: '',
  })

  

  const handleSubmit = async (e) => {
    console.log(fechas);
    e.preventDefault();
    await fetch('http://localhost:4000/crear', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fechas),
    });
    
  };
  

  const loadSumas = async () => {
    try {
      const response = await fetch('http://localhost:4000/fechas/suma');
      const data = await response.json();
      setSumas(data.result);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };
  useEffect(() => {
    loadSumas(),
      setFechas({ ...fechas, id: selectedId.id, fecha: new Date().toISOString().slice(0, 10) || selectedId.fecha });
  }, []);
  return (
    <>
      <Grid justifyContent={'center'} alignItems={'center'}>
        <Grid>
        {suma.map((sum) => (
          <Card sx={{ mt: 2, backgroundColor: 'inherit', border: 'none'}}>
            <Typography sx={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', mb: 1, color: '#f5e4e4' }}>
              Expensa
            </Typography>
            <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
              <form onSubmit={handleSubmit}>
                <Container sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Container>
                    <LabelStyle>Descripcion</LabelStyle>
                    <InputStyle name="descripcion" autoComplete='off' autoFocus={true} required multiline  size='small' onChange={(e) => setFechas({ descripcion: e.target.value })}/>

                    <Input name="id" type="hidden" defaultValue={() => setFechas({ ...fechas, id: sum.id, fecha: sum.fecha })}/>
                  </Container>
                  <Grid container spacing={2} padding={1}>
                    <Grid item xs={6}>
                      <Grid container spacing={1} direction="column" justifyContent="center">
                        <Grid item>
                          <Button sx={{ width: '.3rem', padding: '0' }} onClick={() => setFechas({ ...fechas, tipo: 'ingreso' })}><AddOutlined fontSize='small' color='success' /></Button>
                        </Grid>
                        <Grid item>
                          <Button sx={{ width: '20%', padding: '0' }} onClick={() => setFechas({ ...fechas, tipo: 'egreso' })}><RemoveOutlined fontSize='small' color='error' /></Button>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <LabelStyle>Monto</LabelStyle>
                      <InputStyle name="monto" autoComplete='off' required  size='small' onChange={(e) => setFechas({ ...fechas, monto: e.target.value })}/>
                    </Grid>
                  </Grid>

                  <Button variant='contained' color='primary' type='submit'>Enviar</Button>
                </Container>
              </form>
              <Container>
                
                  <React.Fragment key={sum.id}>
                    <Container>
                      <LabelStyle>Ingreso mensual</LabelStyle>
                      <InputStyle name="monto_ingreso" disabled value={sum.monto_ingreso} />
                    </Container>
                    <Container>
                      <LabelStyle>Egreso mensual</LabelStyle>
                      <InputStyle name="monto_egreso" disabled value={sum.monto_egreso} />
                    </Container>
                    <Container>
                      <LabelStyle padding={0}>Balance mensual</LabelStyle>
                      <InputStyle name="resultado" disabled value={sum.resultado} padding={0} />
                    </Container>
                  </React.Fragment>
                
              </Container>

            </CardContent>
          </Card>
          ))}
        </Grid>
      </Grid>
    </>
  );
}
