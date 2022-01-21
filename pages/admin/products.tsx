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
import { useEffect, useState } from "react";

const ModalWindow = (props: { create: boolean; setCreate(value: boolean): void; mutate: () => void }) => {
    const { create, setCreate, mutate } = props;
    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (!create) return;
        setName('');
        setImage('');
        setPrice(0);
    }, [ create ]);

    return <Dialog open={create} onClose={() => setCreate(false)}>
        <DialogTitle>Dodaj nowy produkt</DialogTitle>
        <DialogContent>
            <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nazwa"
                type="text"
                fullWidth
                variant="standard"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="price"
                label="Cena"
                type="number"
                fullWidth
                variant="standard"
                value={price}
                onChange={e => setPrice(+e.target.value)}
            />
            <TextField
                autoFocus
                margin="dense"
                id="image"
                label="Zdjęcie"
                type="text"
                fullWidth
                variant="standard"
                value={image}
                onChange={e => setImage(e.target.value)}
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setCreate(false)}>Anuluj</Button>
            <Button onClick={async () => {
                await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, price, image }) });
                mutate();
                setCreate(false);
            }}>Dodaj</Button>
        </DialogActions>
    </Dialog>
}

const AdminProducts: NextPage<{ products: ShopProduct[] }> = (props) => {
    const { data, error, mutate } = useSWR('/api/products', fetcher, { fallbackData: props.products });
    const [create, setCreate] = useState(false);

    return <AdminLayout>
        <DataGrid
            sx={{ height: '90vh' }}
            columns={[
                { field: '_id', width: 200 },
                { field: 'name', width: 250, editable: true },
                { field: 'price', type: 'number', editable: true },
                { field: 'image', width: 350, editable: true },
                {
                    field: 'actions', type: 'actions', width: 70, getActions: (params) => [
                        <IconButton onClick={async () => {
                            await fetch('/api/products/' + params.id, { method: 'DELETE' });
                            mutate();
                        }}><DeleteIcon /></IconButton>
                    ]
                }
            ]}
            rows={data}
            rowsPerPageOptions={[50, 100]}
            onCellEditCommit={async (params) => {
                await fetch('/api/products/' + params.id, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
                mutate();
            }}
            getRowId={row => row._id}
        />
        <ModalWindow create={create} setCreate={setCreate} mutate={mutate} />
        <Fab onClick={() => setCreate(true)} sx={{ position: 'fixed', bottom: 110, right: 20 }} color="primary">
            <AddIcon />
        </Fab>
    </AdminLayout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;
    const products = cleanObject(await getShopProducts());

    if (!user?.admin) return { notFound: true };

    return { props: { session, user, products } };
}

export default AdminProducts;