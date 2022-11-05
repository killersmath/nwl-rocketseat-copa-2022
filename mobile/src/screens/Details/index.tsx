import { useState, useEffect } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { Loading } from "../../components/Loading";
import { PoolData } from "../../components/PoolCard";
import { EmptyMyPoolList } from "../../components/EmptyMyPoolList";
import { Guesses } from "../../components/Guesses";

import { api } from "../../services/api";
import { PoolHeader } from "../../components/PoolHeader";
import { Option } from "../../components/Option";

interface DetailsRouteParams {
    id: string;
}

type OptionTypes = "guesses" | "ranking";

export function Details() {
    const [optionSelected, setOptionSelected] =
        useState<OptionTypes>("guesses");
    const [isLoading, setIsLoading] = useState(false);
    const [poolDetails, setPoolDetails] = useState<PoolData>({} as PoolData);

    const toast = useToast();
    const route = useRoute();

    const { id } = route.params as DetailsRouteParams;

    const fetchPoolDetails = async (poolId: string) => {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${poolId}`);
            setPoolDetails(response.data.pool);
        } catch (error) {
            console.log(error);

            toast.show({
                title: "Não foi possível carregar os detalhes do bolão.",
                placement: "top",
                bgColor: "red.500",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeShare = async () => {
        await Share.share({
            message: poolDetails.code,
        });
    };

    useEffect(() => {
        fetchPoolDetails(id);
    }, [id]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header
                title={poolDetails.title ?? "Título do bolão"}
                showBackButton
                showShareButton
                onShare={handleCodeShare}
            />
            {poolDetails._count?.participants > 0 ? (
                <VStack px={5} flex={1}>
                    <PoolHeader data={poolDetails} />

                    <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
                        <Option
                            title="Seus Palpites"
                            isSelected={optionSelected === "guesses"}
                            onPress={() => setOptionSelected("guesses")}
                        />
                        <Option
                            title="Ranking do grupo"
                            isSelected={optionSelected === "ranking"}
                            onPress={() => setOptionSelected("ranking")}
                        />
                    </HStack>

                    <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                </VStack>
            ) : (
                <EmptyMyPoolList code={poolDetails.code} />
            )}
        </VStack>
    );
}
