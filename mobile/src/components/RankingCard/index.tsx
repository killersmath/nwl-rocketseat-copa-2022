import { Avatar, Box, Heading, HStack, Row, Text, VStack } from "native-base";
import React from "react";

export interface RankingData {
    position: number;
    id: string;
    name: string;
    avatarUrl: string | null;
    score: number;
}

interface RankingCardProps {
    data: RankingData;
}

export function RankingCard({ data }: RankingCardProps) {
    return (
        <Row
            w="full"
            bgColor="gray.800"
            rounded="sm"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={2}
            borderBottomColor="yellow.500"
            px={4}
            py={5}
            space={2}
            mb={3}
        >
            <HStack space={3}>
                <Avatar
                    key={data.id}
                    source={{ uri: data.avatarUrl ?? undefined }}
                    w={10}
                    h={10}
                    rounded="full"
                >
                    {data?.name?.at?.(0)?.toUpperCase() ?? "Any"}
                </Avatar>
                <VStack justifyContent="space-evenly">
                    <Heading color="white" fontSize="md" fontFamily="heading">
                        {data.name}
                    </Heading>
                    <Text color="gray.200" fontSize="xs">
                        {data.score} ponto(s)
                    </Text>
                </VStack>
            </HStack>
            <Box
                bgColor={data.position <= 3 ? "yellow.500" : "gray.600"}
                px={3}
                py={1}
                borderRadius="3xl"
                justifyContent="center"
                alignItems="center"
            >
                <Text
                    fontSize="xs"
                    color={data.position <= 3 ? "black" : "gray.300"}
                    fontFamily="heading"
                >
                    {`${data.position}º`}
                </Text>
            </Box>
        </Row>
    );
}
