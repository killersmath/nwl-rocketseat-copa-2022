import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { authenticate } from "../plugins/authenticate";
import { z } from "zod";
import { UserSubmission } from "../@types/user";
import { EvaluateUserRankingUseCase } from "../usecases/evaluateUserRankingUsecase";

export async function gameRoutes(fastify: FastifyInstance) {
    fastify.get("/pools/:id/games", { onRequest: [authenticate] }, async (request) => {
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
    });

    fastify.get("/pools/:id/ranking", { onRequest: [authenticate] }, async (request) => {
        const getPoolParams = z.object({
            id: z.string(),
        });

        const { id: poolId } = getPoolParams.parse(request.params);

        const participants = await prisma.participant.findMany({
            select: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                guesses: {
                    select: {
                        id: true,
                        firstTeamPoints: true,
                        secondTeamPoints: true,
                        createdAt: true,
                        game: {
                            select: {
                                date: true,
                                result: {
                                    select: {
                                        firstTeamPoints: true,
                                        secondTeamPoints: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                poolId,
            },
        });

        const preparedUserData: UserSubmission[] = participants.map((participantItem) => {
            return {
                id: participantItem.user.id,
                name: participantItem.user.name,
                avatarUrl: participantItem.user.avatarUrl,
                attemps: participantItem.guesses.map((guessItem) => {
                    let gameResult = null;

                    if (guessItem.game.result) {
                        gameResult = {
                            firstTeamPoints: guessItem.game.result.firstTeamPoints,
                            secondTeamPoints: guessItem.game.result.secondTeamPoints,
                        };
                    } 

                    return {
                        guessSubmission: {
                            firstTeamPoints: guessItem.firstTeamPoints,
                            secondTeamPoints: guessItem.secondTeamPoints,
                        },
                        gameResult,
                    };
                }),
            };
        });

        const computedScoreUsers = EvaluateUserRankingUseCase.execute(preparedUserData);

        computedScoreUsers.sort((a, b) => {
            if (a.score > b.score) {
                return -1;
            }

            if (a.score < b.score) {
                return 1;
            }

            if (a.attemps.length > b.attemps.length) {
                return -1;
            }

            if (a.attemps.length < b.attemps.length) {
                return 1;
            }

            return a.name < b.name ? 1 : -1;
        });

        return {
            ranking: computedScoreUsers.map((computedItem, idx) => ({
                position: idx+1,
                ...computedItem,
                attemps: undefined,
            })),
        };
    });
}
