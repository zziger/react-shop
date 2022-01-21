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

const AdminUsers: NextPage<{ users: User[] }> = (props) => {
    const { data, error, mutate } = useSWR('/api/users', fetcher, { fallbackData: props.users });
    const user = useContext(UserContext);

    return <AdminLayout>
        <DataGrid
            sx={{ height: '90vh' }}
            columns={[
                { field: '_id', width: 200 },
                { field: 'email', width: 350, editable: true },
                { field: 'admin', type: 'boolean', editable: true },
                {
                    field: 'actions', type: 'actions', width: 70, getActions: (params) => [
                        <IconButton onClick={async () => {
                            await fetch('/api/users/' + params.id, { method: 'DELETE' });
                            mutate();
                        }}><DeleteIcon /></IconButton>
                    ]
                }
            ]}
            rows={data}
            rowsPerPageOptions={[50, 100]}
            isCellEditable={(params) => params.id !== user._id}
            onCellEditCommit={async (params) => {
                await fetch('/api/users/' + params.id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
                mutate();
            }}
            getRowId={row => row._id}
        />
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