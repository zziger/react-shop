import { AppBar, Toolbar, IconButton, Typography, Button, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react"
import { useContext } from "react";
import { UserContext } from "../src/UserContext";

export function AdminLayout(props: { children: any }) {
    const { data: session, status: sessionStatus } = useSession();
    const user = useContext(UserContext);
    if (!user?.admin) return null;

    return <>
        <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
            <Toolbar variant="dense">
                <Link href="/">
                    <Typography variant="h6" color="inherit" component="div" sx={{ cursor: 'pointer', flexGrow: 1 }}>
                        Sklep internetowy - Panel administracyjny
                    </Typography>
                </Link>
                <Link href="/admin/users">
                    <Button sx={{ mr: 2 }}>
                        Lista użytkowników
                    </Button>
                </Link>
                <Link href="/admin/products">
                    <Button sx={{ mr: 2 }}>
                        Lista produktów
                    </Button>
                </Link>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography color="inherit" component="div" sx={{ mr: 3 }}>
                        {(session?.user?.name ?? null)}
                    </Typography>
                    {
                        sessionStatus == "authenticated"
                            ? <Button onClick={() => signOut()}>
                                Wyloguj
                            </Button>
                            : <Button onClick={() => signIn("google")}>
                                Zaloguj
                            </Button>
                    }
                </Box>
            </Toolbar>
        </AppBar>
        {props.children}
    </>;
}