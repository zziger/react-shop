import { Container, Box, Typography, Grid, Alert, TextField, Button } from "@mui/material";
import { GetServerSideProps } from "next";
import { Provider, ProviderType } from "next-auth/providers";
import { ClientSafeProvider, getCsrfToken, getProviders, getSession, signIn } from "next-auth/react"
import Link from "next/link";
import { Router } from "next/router";
import { useState } from "react";
import { Layout } from "../../components/Layout";

export default function SignIn(props: { callbackUrl: string }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                        Logowanie się
                    </Typography>
                    <Box component="div" sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            {/* {!!error && <Grid item xs={12}><Alert severity="error" onClose={() => setError('')}>{error}</Alert></Grid>} */}
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
                            onClick={() => signIn("credentials", { username: email, password, callbackUrl: props.callbackUrl })}
                        >
                            Zaloguj się
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            sx={{ mt: 3 }}
                            onClick={() => signIn("google", { callbackUrl: props.callbackUrl })}
                        >
                            Zaloguj się za pomocą Google
                        </Button>
                        <Link href="/auth/register">
                            <Button
                                fullWidth
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 1 }}
                            >
                                Załóż konto
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Layout>
    )

    // return (
    //     <>
    //         <label>
    //             Username
    //             <input name="login" type="text" value={username} onChange={e => setUsername(e.target.value)} />
    //         </label>
    //         <label>
    //             Password
    //             <input name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
    //         </label>
    //         <button onClick={() => signIn("credentials", { username, password, callbackUrl: props.callbackUrl })}>Sign in</button>
    //         {/* {Object.values(providers).map((provider: any) => (
    //             <div key={provider.name}>

    //                 <button onClick={() => signIn(provider.id)}>
    //                     Sign in with {provider.name}
    //                 </button>
    //             </div>
    //         ))} */}
    //     </>
    // )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    if (session?.user) return { redirect: { destination: '/', permanent: false } };
    return {
        props: { callbackUrl: context.query.callbackUrl },
    }
}