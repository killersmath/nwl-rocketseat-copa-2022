import { PrismaClient } from "@prisma/client";
import Fastify from "fastify";
import ShortUniqueId from "short-unique-id";

import { z } from "zod";

const prisma = new PrismaClient({
    log: ['query']
});

const run = async () => {
    const fastify = Fastify({
        logger: true
    });

    fastify.get("/pools/count", async () => {
        const count = await prisma.pool.count();

        return { count };
    });

    fastify.post("/pools", async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })
        const { title } = createPoolBody.parse(request.body);

        const generate = new ShortUniqueId({ length: 6 });
        const poolCode = String(generate()).toUpperCase();

        await prisma.pool.create({
            data: {
                title,
                code: poolCode,
            }
        })

        return reply.status(201).send({ code: poolCode });
    });



    await fastify.listen({ port: 3333 });
}

run();