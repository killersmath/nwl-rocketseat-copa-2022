import { useCallback, useEffect, useState } from "react";
import { FlatList } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { Game, GameData } from "../../components/Game";
import { Loading } from "../Loading";
import { EmptyMyPoolList } from "../EmptyMyPoolList";

import { api } from "../../services/api";

import { useNotification } from "../../hooks/useShowNotification";

interface GuessesProps {
    poolId: string;
    code: string;
}

export function Guesses({ poolId, code }: GuessesProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [games, setGames] = useState<GameData[]>([]);
    const [firstTeamPoints, setFirstTeamPoints] = useState("");
    const [secondTeamPoints, setSecondTeamPoints] = useState("");

    const { showSuccess, showError } = useNotification();

    const resetInputState = () => {
        setFirstTeamPoints("");
        setSecondTeamPoints("");
    };

    const fetchGames = async (id: string) => {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}/games`);

            setGames(response.data.games);
        } catch (error) {
            console.log(error);

            showError("Não foi possível encontrar os jogos.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuessConfirm = async (gameId: string) => {
        try {
            if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
                return showError("Informa o placar do palpite.");
            }

            await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
                firstTeamPoints: Number(firstTeamPoints),
                secondTeamPoints: Number(secondTeamPoints),
            });

            showSuccess("Palpite realizado com sucesso!");

            fetchGames(poolId);
            resetInputState();
        } catch (error) {
            console.log(error);
            showError("Não foi possível enviar o palpite.");
        }
    };

    useEffect(() => {
        fetchGames(poolId);
    }, [poolId]);

    useFocusEffect(
        useCallback(() => {
            resetInputState();
        }, [])
    );

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
