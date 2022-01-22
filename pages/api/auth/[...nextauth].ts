import NextAuth, { User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByCredentials } from "./authorize";

export default NextAuth({
    secret: 'tajemnyString',
    pages: {
        signIn: '/auth'
    },
    providers: [
        GoogleProvider({
            clientId: '238820174472-cel8hogk6u85h6ia7h0s78had8eoo8go.apps.googleusercontent.com',
            clientSecret: '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'
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: "Email", type: "email", placeholder: "user@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials) return null;
                const res = await getUserByCredentials(credentials.username, credentials.password);
                return res ? {
                    email: res.email,
                    name: res.email,
                    id: res.id,
                    image: ''
                } : null;
            }
        })
    ],
});