'use client'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FormEvent, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Snackbar } from '@mui/material';
import chatApi from '../services/chatApi';
import useStorage from '@/hooks/useStorage';

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const storage = useStorage();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const loginObject = {
      email: data.get('email'),
      senha: data.get('password'),
    };
    setLoading(true);
    chatApi.post('/api/auth/login', loginObject)
      .then((res) => {
        sessionStorage.setItem("token", res.data.token)
        router.push('/chats');
      })
      .catch((err: any) => {
        // console.log(err)
        setOpen(true)
      })
      .finally(() => {
        setLoading(false);
      })
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockPersonIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <LoadingButton
            loading={loading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Entrar
          </LoadingButton>
          <Grid container>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Não tem uma conta? Crie uma aqui!"}
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message="Erro ao fazer login: E-mail ou senha incorretos"
        />
      </Box>
    </Container>
  );
}