import React, { useCallback, useState } from "react";

import { Row, FlatList } from "native-base";
import { useFocusEffect } from "@react-navigation/native";

import { api } from "../../services/api";

import { EmptyRakingList } from "../EmptyRankingList";
import { Loading } from "../Loading";
import { RankingCard, RankingData } from "../RankingCard";

interface RankingProps {
    poolId: string;
}

export function Ranking({ poolId }: RankingProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [ranking, setRanking] = useState<RankingData[]>([]);

    const fetchRanking = async (id: string) => {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}/ranking`);

            setRanking(response.data.ranking);
        } catch (error) {
            console.log(error?.response?.data ?? error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRanking(poolId);
        }, [poolId])
    );

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Row flexWrap="wrap" justifyContent="center">
            <FlatList
                data={ranking}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <RankingCard key={item.id} data={item} />
                )}
                _contentContainerStyle={{ pb: 10 }}
                ListEmptyComponent={() => <EmptyRakingList />}
            />
        </Row>
    );
}
