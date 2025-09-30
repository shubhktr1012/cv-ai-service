import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from "express";
import cors from "cors";
import http from "http";
import axios from "axios";

// GraphQL schema
const typeDefs = `#graphql
    type Mutation{
        askCV(question: String!): String
    }
    type Query{
        _empty: String
    }
`;

//Dictionary of resolvers
const resolvers = {
    Mutation: {
        askCV: async (_: any, { question }: { question: string}) => { //parent and args are the parameters used here
           try {
            const contextPayload = {
                question: question,
                timestamp: new Date().toISOString(),
                source: "CV_API_GATEWAY",
            };
            const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:5000/ask";
            const response = await axios.post(aiServiceUrl, contextPayload);
            return response.data.answer;
           } catch (error) { 
            console.error("Error in askCV:", error);
            throw new Error('Failed to get a response from the AI service.');
           }
        },
    },
};

async function start_server() {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
     })

    await server.start();
    app.use('/graphql', cors<cors.CorsRequest>(), express.json(), expressMiddleware(server));
    await new Promise<void>((resolve) => httpServer.listen({ port: 4000}, resolve));
    console.log(`🚀 Server is running on http://localhost:4000/graphql`);
}

start_server();




