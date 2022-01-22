import { Copyright } from "@mui/icons-material";
import { Box, Grid, TextField, FormControlLabel, Checkbox, Button, Container, CssBaseline, Typography, Alert } from "@mui/material";
import { GetServerSideProps } from "next";
import { Provider, ProviderType } from "next-auth/providers";
import { ClientSafeProvider, getCsrfToken, getProviders, getSession, signIn, useSession } from "next-auth/react"
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { Layout } from "../../components/Layout";

export default function SignIn(props: {}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    async function register() {
        const request = await fetch('/api/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });

        if (request.ok) {
            signIn("credentials", { username: email, password });
        } else {
            if (request.status === 403) {
                const body = await request.json();
                console.log(body);
                switch (body.error) {
                    case 'ENTER_LOGIN':
                        setError('Wprowadź email');
                        break;
                    case 'ENTER_PASSWORD':
                        setError('Wprowadź hasło');
                        break;
                    case 'EMAIL_ALREADY_IN_USE':
                        setError('Już istnieje konto z takim adresem email');
                        break;
                    default:
                        setError("Wystąpił błąd przy logowaniu");
                        break;
                }
            } else {
                setError("Wystąpił błąd przy logowaniu");
            }
        }
    }

    return (
        <Layout>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Tworzenie konta
                    </Typography>
                    <Box component="div" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {!!error && <Grid item xs={12}><Alert severity="error" onClose={() => setError('')}>{error}</Alert></Grid>}
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="E-mail"
                                    name="email"
                                    autoComplete="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Hasło"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={register}
                        >
                            Stwórz konto
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session?.user) return { redirect: { destination: '/', permanent: false } };
    return {
        props: {},
    }
}