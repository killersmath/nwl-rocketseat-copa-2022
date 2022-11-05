import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { z } from "zod";

export async function gameRoutes(fastify: FastifyInstance) {
    fastify.get(
        "/pools/:id/games",
        { onRequest: [authenticate] },
        async (request) => {
            const getPoolParams = z.object({
                id: z.string(),
            });

            const { id: poolId } = getPoolParams.parse(request.params);

            const games = await prisma.game.findMany({
                orderBy: {
                    date: "desc",
                },
                include: {
                    guesses: {
                        where: {
                            participant: {
                                userId: request.user.sub,
                                poolId,
                            },
                        },
                    },
                },
            });

            const currentDate = new Date();

            return {
                games: games.map((game) => {
                    return {
                        ...game,
                        guess: game.guesses.length > 0 ? game.guesses[0] : null,
                        guesses: undefined,
                        isOver: game.date < currentDate,
                    };
                }),
            };
        }
    );
}
