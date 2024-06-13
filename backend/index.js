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
import passport from "passport";
import session from "express-session";
import connectMongo, { MongoDBStore } from 'connect-mongodb-session'
import { configurePassport } from "./passport/config.js";

import { buildContext } from "graphql-passport";

dotenv.config();
configurePassport();
const app = express()

const httpServer = http.createServer(app)


const MongoDpStore = connectMongo(session);

const store = new MongoDBStore({
     url : process.env.MONGO_URL,
     collection : "sessions"
})
store.on("error",(err) => {
    console.log(err)
})

app.use(
    session(
        {
            secret : process.env.SESSION_SECRET,
            resave : false,
            saveUninitialized : false,
            cookie : {
                maxAge : 1000 * 60 * 60 * 24 * 7,
                httpOnly : true
            },
            store : store
        }
    )
)

app.use(passport.initialize());
app.use(passport.session());
const server = new ApolloServer({
    typeDefs : mergedTypeDefs,
    resolvers : mergedResolvers,
    plugins : [ApolloServerPluginDrainHttpServer({ httpServer })]
})

await server.start();

app.use(
    '/',
    cors({
        origin : "http://localhost:3000",
        credentials : true
    }),
    express.json(),
    expressMiddleware(server,{
        context :  buildContext( { req,res })
    }),
);

await new Promise((resolve) => httpServer.listen({
    port : 4000
},resolve));
await connectDb();

console.log(`Server started at `)

