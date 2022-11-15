import { UserAttemp, UserSubmission, UserSubmissionWithScore } from "../@types/user";

type RuleFunction = (attemp: UserAttemp) => number;
type RuleRecord = RuleFunction[][];

const rules: RuleRecord = [
    [
        function match(attemp) {
            if (!attemp.gameResult) {
                return 0;
            }

            if (
                attemp.guessSubmission.firstTeamPoints === attemp.gameResult.firstTeamPoints &&
                attemp.guessSubmission.secondTeamPoints === attemp.gameResult.secondTeamPoints
            ) {
                return 5;
            }

            return 0;
        },
    ],
    [
        function winnerScore(attemp) {
            if (!attemp.gameResult) {
                return 0;
            }

            if (
                attemp.guessSubmission.firstTeamPoints === attemp.gameResult.firstTeamPoints &&
                attemp.gameResult.firstTeamPoints > attemp.guessSubmission.secondTeamPoints
            ) {
                return 3;
            }

            if (
                attemp.guessSubmission.secondTeamPoints === attemp.gameResult.secondTeamPoints &&
                attemp.gameResult.secondTeamPoints > attemp.gameResult.firstTeamPoints
            ) {
                return 3;
            }

            return 0;
        },
        function loserScore(attemp) {
            if (!attemp.gameResult) {
                return 0;
            }

            if (
                attemp.guessSubmission.firstTeamPoints === attemp.gameResult.firstTeamPoints &&
                attemp.gameResult.firstTeamPoints < attemp.guessSubmission.secondTeamPoints
            ) {
                return 2;
            }

            if (
                attemp.guessSubmission.secondTeamPoints === attemp.gameResult.secondTeamPoints &&
                attemp.gameResult.secondTeamPoints < attemp.gameResult.firstTeamPoints
            ) {
                return 2;
            }

            return 0;
        },
    ],
    [
        function winnerWithoutScore(attemp) {
            if (!attemp.gameResult) {
                return 0;
            }

            if (
                attemp.guessSubmission.firstTeamPoints === attemp.guessSubmission.secondTeamPoints ||
                attemp.gameResult.firstTeamPoints === attemp.gameResult.secondTeamPoints
            ) {
                return 0;
            }

            const submissionWinnerA = attemp.guessSubmission.firstTeamPoints > attemp.guessSubmission.secondTeamPoints;
            const resultWinnerA = attemp.gameResult.firstTeamPoints > attemp.gameResult.secondTeamPoints;

            if (submissionWinnerA !== resultWinnerA) {
                return 0;
            }

            return 1;
        },
    ],
    [
        function draw(attemp) {
            if (!attemp.gameResult) {
                return 0;
            }

            if (attemp.guessSubmission.firstTeamPoints !== attemp.guessSubmission.secondTeamPoints) {
                return 0;
            }

            if (attemp.gameResult.firstTeamPoints !== attemp.gameResult.secondTeamPoints) {
                return 0;
            }

            return 1;
        },
    ],
];

export class EvaluateUserRankingUseCase {
    static execute(data: UserSubmission[]): UserSubmissionWithScore[] {
        const evaluatedData = data.map<UserSubmissionWithScore>((dataItem) => {
            let score = 0;
            const INITIAL_VALUE = 0;

            if (dataItem.attemps) {
                score = dataItem.attemps.reduce((totalScore, attempItem) => {
                    let computedScore = 0;
                    rules.every((ruleClass) => {
                        const localScore = ruleClass.reduce((localScore, executorFn) => {
                            return localScore + executorFn(attempItem);
                        }, INITIAL_VALUE);

                        if (localScore) {
                            computedScore = localScore;
                        }

                        return !localScore;
                    });

                    return totalScore + computedScore;
                }, INITIAL_VALUE);
            }

            return {
                ...dataItem,
                score,
            };
        });
        return evaluatedData;
    }
}
