import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { AdminLayout } from "../../components/AdminLayout";
import { getUser } from "../../src/user";
import { cleanObject } from "../../src/utils";

const Admin = () => {
    return <AdminLayout>a</AdminLayout>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const user = session?.user?.email ? cleanObject(await getUser(session.user.email)) : null;

    if (!user?.admin) return { notFound: true };
    return {
        redirect: { destination: '/admin/products', permanent: true }
    }

    return { props: { session, user } };
}

export default Admin;