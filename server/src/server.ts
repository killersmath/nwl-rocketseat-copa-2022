import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { poolRoutes } from "./routes/pool";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";

const run = async () => {
    if (!process.env.JWT_TOKEN_SECRET) {
        throw new Error("You must provide the JWT TOKEN SECRET");
    }

    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, { origin: true });

    await fastify.register(jwt, {
        secret: process.env.JWT_TOKEN_SECRET,
    });

    await fastify.register(poolRoutes);
    await fastify.register(authRoutes);
    await fastify.register(gameRoutes);
    await fastify.register(guessRoutes);
    await fastify.register(userRoutes);

    await fastify.listen({ host: "0.0.0.0", port: 3333 });
};

run();
