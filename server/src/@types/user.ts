interface AttempScore {
    firstTeamPoints: number;
    secondTeamPoints: number;
}

export interface UserAttemp {
    guessSubmission: AttempScore;
    gameResult: AttempScore | null;
}

export interface UserSubmission {
    id: string;
    avatarUrl: string | null;
    name: string;
    attemps: UserAttemp[];
}

export type UserSubmissionWithScore = UserSubmission & {
    score: number;
};
