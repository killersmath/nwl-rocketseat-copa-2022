import { useEffect, useState } from "react";
import { useToast, FlatList } from "native-base";
import { api } from "../../services/api";

import { Game, GameData } from "../../components/Game";
import { Loading } from "../Loading";
import { EmptyMyPoolList } from "../EmptyMyPoolList";

interface GuessesProps {
    poolId: string;
    code: string;
}

export function Guesses({ poolId, code }: GuessesProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [games, setGames] = useState<GameData[]>([]);

    const [firstTeamPoints, setFirstTeamPoints] = useState("");
    const [secondTeamPoints, setSecondTeamPoints] = useState("");

    const toast = useToast();

    const fetchGames = async (id: string) => {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}/games`);

            setGames(response.data.games);
        } catch (error) {
            console.log(error);
            toast.show({
                title: "Não foi possível encontrar os jogos.",
                placement: "top",
                bgColor: "red.500",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuessConfirm = async (gameId: string) => {
        try {
            if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
                return toast.show({
                    title: "Informa o placar do palpite.",
                    placement: "top",
                    bgColor: "red.500",
                });
            }

            await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
                firstTeamPoints: Number(firstTeamPoints),
                secondTeamPoints: Number(secondTeamPoints),
            });

            toast.show({
                title: "Palpite realizado com sucesso!",
                placement: "top",
                bgColor: "green.500",
            });
        } catch (error) {
            console.log("error");

            toast.show({
                title: "Não foi possível enviar o palpite.",
                placement: "top",
                bgColor: "red.500",
            });
        }
    };

    useEffect(() => {
        fetchGames(poolId);
    }, [poolId]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <FlatList
            data={games}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <Game
                    data={item}
                    setFirstTeamPoints={setFirstTeamPoints}
                    setSecondTeamPoints={setSecondTeamPoints}
                    onGuessConfirm={() => handleGuessConfirm(item.id)}
                />
            )}
            _contentContainerStyle={{ pb: 10 }}
            ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
        />
    );
}
