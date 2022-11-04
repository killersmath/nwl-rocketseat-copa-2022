import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";

import { poolRoutes } from "./routes/pool";
import { authRoutes } from "./routes/auth";
import { gameRoutes } from "./routes/game";
import { guessRoutes } from "./routes/guess";
import { userRoutes } from "./routes/user";

const run = async () => {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, { origin: true });

  // TODO: Deve criar secret via env
  await fastify.register(jwt, {
    secret: "teste-max"
  });

  await fastify.register(poolRoutes);
  await fastify.register(authRoutes);
  await fastify.register(gameRoutes);
  await fastify.register(guessRoutes);
  await fastify.register(userRoutes);

  await fastify.listen({ host: "0.0.0.0" , port: 3333 });
};

run();
