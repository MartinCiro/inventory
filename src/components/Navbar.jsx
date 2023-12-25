import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container, Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar>
        <Container>
          <Toolbar>
            <Typography sx={{ flexGrow: 1 }}>
              <Link to="/">Home</Link>
            </Typography>

            <Button variant="contained" color='primary' onClick={() => navigate('/tasks/new')}> 
              New Task
            </Button>

          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}
