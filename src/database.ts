import { connect, connections } from "mongoose";


export async function connectToDatabase() {
    if (connections.some(e => e.readyState)) return;
    await connect("mongodb://localhost/shop");
}