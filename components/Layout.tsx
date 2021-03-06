import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react"
import { useContext } from "react";
import { UserContext } from "../src/UserContext";

export function Layout(props: { children: any }) {
    const { data: session, status: sessionStatus } = useSession();
    const user = useContext(UserContext);

    return <>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Toolbar variant="dense">
                <Link href="/">
                    <Typography variant="h6" color="inherit" component="div" sx={{ cursor: 'pointer', flexGrow: 1 }}>
                        Sklep internetowy
                    </Typography>
                </Link>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    { !!user?.admin && <Link href="/admin">
                        <Button sx={{ mr: 2 }}>
                            Admin
                        </Button>
                    </Link> }
                    { sessionStatus == "authenticated" && <Link href="/products/favorites">
                        <Button sx={{ mr: 2 }}>
                            Ulubione
                        </Button>
                    </Link> }
                    <Link href="/cart">
                        <Button sx={{ mr: 5 }}>
                            Koszyk
                        </Button>
                    </Link>
                    <Typography color="inherit" component="div" sx={{ mr: 3 }}>
                        {(session?.user?.name ?? null)}
                    </Typography>
                    {
                        sessionStatus == "authenticated"
                            ? <Button onClick={() => signOut()}>
                                Wyloguj
                            </Button>
                            : <Button onClick={() => signIn()}>
                                Zaloguj
                            </Button>
                    }
                </Box>
            </Toolbar>
        </AppBar>
        {props.children}
    </>;
}