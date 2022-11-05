import { useState } from "react";
import { Button, HStack, Text, useTheme, VStack } from "native-base";
import { X, Check } from "phosphor-react-native";
import { getName } from "country-list";
import { toPTBRFormat } from "../../utils/date";

import { Team } from "../Team";

interface GuessData {
    id: string;
    gameId: string;
    createdAt: string;
    participantId: string;
    firstTeamPoints: number;
    secondTeamPoints: number;
}

export interface GameData {
    id: string;
    date: string;
    firstTeamCountryCode: string;
    secondTeamCountryCode: string;
    guess: null | GuessData;
    isOver: boolean;
}

interface GameProps {
    data: GameData;
    onGuessConfirm: () => void;
    setFirstTeamPoints: (value: string) => void;
    setSecondTeamPoints: (value: string) => void;
}

export function Game({
    data,
    setFirstTeamPoints,
    setSecondTeamPoints,
    onGuessConfirm,
}: GameProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { colors, sizes } = useTheme();

    const formatedDate = toPTBRFormat(data.date);

    const handleButtonClick = async () => {
        setIsLoading(true);
        await onGuessConfirm();
        setIsLoading(false);
    };

    return (
        <VStack
            w="full"
            bgColor="gray.800"
            rounded="sm"
            alignItems="center"
            borderBottomWidth={3}
            borderBottomColor="yellow.500"
            mb={3}
            p={4}
        >
            <Text color="gray.100" fontFamily="heading" fontSize="sm">
                {getName(data.firstTeamCountryCode)} vs.{" "}
                {getName(data.secondTeamCountryCode)}
            </Text>

            <Text color="gray.200" fontSize="xs">
                {formatedDate}
            </Text>

            <HStack
                mt={4}
                w="full"
                justifyContent="space-between"
                alignItems="center"
            >
                <Team
                    code={data.firstTeamCountryCode}
                    points={data.guess?.firstTeamPoints}
                    position="right"
                    onChangeText={setFirstTeamPoints}
                />

                <X color={colors.gray[300]} size={sizes[6]} />

                <Team
                    code={data.secondTeamCountryCode}
                    points={data.guess?.secondTeamPoints}
                    position="left"
                    onChangeText={setSecondTeamPoints}
                />
            </HStack>

            {!data.guess && (
                <Button
                    size="xs"
                    w="full"
                    bgColor={data.isOver ? "gray.500" : "green.500"}
                    mt={4}
                    onPress={handleButtonClick}
                    isLoading={isLoading}
                    isDisabled={data.isOver}
                >
                    <HStack alignItems="center">
                        <Text
                            color="white"
                            fontSize="xs"
                            fontFamily="heading"
                            mr={3}
                        >
                            {data.isOver
                                ? "TEMPO ESGOTADO"
                                : "CONFIRMAR PALPITE"}
                        </Text>

                        {!data.isOver && (
                            <Check color={colors.white} size={sizes[4]} />
                        )}
                    </HStack>
                </Button>
            )}
        </VStack>
    );
}
