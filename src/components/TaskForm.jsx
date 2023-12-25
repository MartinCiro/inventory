import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function TaskForm() {
  const [editing, setEditing] = useState(false);
  const [tasks, setTasks] = useState({
    title: '',
    description: ''
  })
  const navigate = useNavigate()
  const params = useParams()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await fetch(`http://localhost:3000/tasks?id=${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
      });
    } else {
      await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
      });
    }
    navigate('/')
  }

  const handleChange = (e) => {
    setTasks({
      ...tasks,
      [e.target.name]: e.target.value
    });
  };

  const loadTasks = async (id) => {
    const response = await fetch(`http://localhost:3000/tasks?id=${id}`)
    const data = await response.json()
    setTasks({ title: data.status_cod.title, description: data.status_cod.descripcion })
    setEditing(true)
  }

  useEffect(() => {
    if (params.id) {
      loadTasks(params.id)
    }
  }, [params.id])

  return (
    <Grid container direction={'column'} justifyContent={'center'} alignItems={'center'}>
      <Grid item xs={3}>
        <Card sx={{ mt: 2 }}>
          <Typography>
            Create task
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField variant='filled' label='Write your title' sx={{ display: 'block', margin: '0.5rem 0' }} name='title' onChange={handleChange} value={tasks.title} />

              <TextField variant='filled' label='Write your description' multiline rows={4} sx={{ display: 'block', margin: '0.5rem 0' }} name='description' onChange={handleChange} value={tasks.description} />

              <Button variant='contained' color='primary' type='submit'>Create</Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
