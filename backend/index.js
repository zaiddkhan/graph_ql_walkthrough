import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mergedResolvers from "./resolver/index.js";
import mergedTypeDefs from "./typedefs/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from 'express';
import http from 'http';
import cors from 'cors';
import exp from "constants";
import dotenv from 'dotenv';
import { connectDb } from "./db/connectDb.js";

dotenv.config();
const app = express()

const httpServer = http.createServer(app)

const server = new ApolloServer({
    typeDefs : mergedTypeDefs,
    resolvers : mergedResolvers,
    plugins : [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start();

app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server,{
        context : async ( { req }) => ({
              req  })
    }),
);

await new Promise((resolve) => httpServer.listen({
    port : 4000
},resolve));
await connectDb();

console.log(`Server started at `)

