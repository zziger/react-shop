import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export default NextAuth({
    secret: 'tajemnyString',
    providers: [
        GoogleProvider({
            clientId: '238820174472-cel8hogk6u85h6ia7h0s78had8eoo8go.apps.googleusercontent.com',
            clientSecret: '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'
        })
    ],
});