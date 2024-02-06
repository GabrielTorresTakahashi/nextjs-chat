'use client'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Snackbar } from '@mui/material';


export default function SignUp() {
    const navigation = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const toSave = {
            nome: data.get('name'),
            email: data.get('email'),
            senha: data.get('password'),
        }
        try {
            await axios.post('/api/user', toSave);
            navigation.push('/login');
        } catch (error) {
            console.error(error)
            setOpen(true)
        } finally {
            setLoading(false)
        }
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
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Cadastre-se
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Seu Nome"
                                name="name"
                                autoComplete="name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="E-mail"
                                name="email"
                                autoComplete="email"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Senha"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                            />
                        </Grid>
                    </Grid>
                    {!loading && <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Cadastre-se
                    </Button>}
                    {loading && <LoadingButton
                        fullWidth
                        variant="contained"
                        loading
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Cadastre-se
                    </LoadingButton>}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Já possui conta? Fazer login
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Erro ao criar usuário"
            />
        </Container>
    );
}