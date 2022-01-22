import { GetServerSideProps, NextPage } from "next";
import { getSession } from "next-auth/react";
import { AdminLayout } from "../../components/AdminLayout";
import { getUser } from "../../src/user";
import { cleanObject, fetcher } from "../../src/utils";
import { DataGrid } from '@mui/x-data-grid';
import { getShopProducts } from "../api/products";
import { ShopProduct } from "../../models/ShopProduct";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, TextField } from "@mui/material";
import useSWR from "swr";
import { useContext, useEffect, useState } from "react";
import { getUsers } from "../api/users";
import { User } from "../../models/User";
import { UserContext } from "../../src/UserContext";
import PasswordIcon from '@mui/icons-material/Password';
import sha256 from 'crypto-js/sha256';

const ModalWindow = (props: { open: boolean; id: string; email: string; close(): void; mutate: () => void }) => {
    const { open, close, mutate } = props;
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!open) return;
        setPassword('');
    }, [open]);

    return <Dialog open={open} onClose={() => close()}>
        <DialogTitle>Zmień hasło dla uytkownika {props.email}</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Hasło"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => close()}>Anuluj</Button>
            <Button onClick={async () => {
                console.log(sha256(password).toString());
                await fetch('/api/users/' + props.id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ field: 'password', value: sha256(password).toString() }) });
                mutate();
                close();
            }}>Zmień hasło</Button>
        </DialogActions>
    </Dialog>
}

const AdminUsers: NextPage<{ users: User[] }> = (props) => {
    const { data, error, mutate } = useSWR<User[]>('/api/users', fetcher, { fallbackData: props.users });
    const user = useContext(UserContext);
    const [changePassword, setChangePassword] = useState('');

    return <AdminLayout>
        <DataGrid
            sx={{ height: '90vh' }}
            columns={[
                { field: '_id', width: 200 },
                { field: 'email', width: 350, editable: true },
                { field: 'admin', type: 'boolean', editable: true },
                {
                    field: 'actions', type: 'actions', width: 100, getActions: (params) => [
                        <IconButton key="delete" onClick={async () => {
                            await fetch('/api/users/' + params.id, { method: 'DELETE' });
                            mutate();
                        }}>
                            <DeleteIcon />
                        </IconButton>,
                        <IconButton key="changePassword" onClick={() => {
                            setChangePassword(params.id as string);
                        }}>
                            <PasswordIcon />
                        </IconButton>,
                    ]
                }
            ]}
            rows={data as any}
            rowsPerPageOptions={[50, 100]}
            isCellEditable={(params) => params.id !== user?._id}
            onCellEditCommit={async (params) => {
                await fetch('/api/users/' + params.id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
                mutate();
            }}
            getRowId={row => row._id}
        />
        <ModalWindow open={!!changePassword} id={changePassword} email={data?.find(e => e._id == changePassword)?.email ?? ''} close={() => setChangePassword('')} mutate={mutate} />
    </AdminLayout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;
    const users = cleanObject(await getUsers());

    if (!user?.admin) return { notFound: true };

    return { props: { session, user, users } };
}

export default AdminUsers;