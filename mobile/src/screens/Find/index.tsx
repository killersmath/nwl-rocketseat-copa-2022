import { useState } from "react";
import { Heading, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { api } from "../../services/api";

import { useNotification } from "../../hooks/useShowNotification";

export function Find() {
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState("");
    const { navigate } = useNavigation();

    const { showSuccess, showError } = useNotification();

    const handleJoinPool = async () => {
        try {
            if (!code.trim()) {
                return showError("Informe o código!");
            }

            await api.post("/pools/join", { code });
            showSuccess("Você entrou no bolão com sucesso!");
            navigate("pools");
        } catch (error) {
            console.log(error);
            setIsLoading(true);

            const defaultMessage = "o Bolão não encontrado!";
            const messageDicionary: Record<string, string> = {
                "Pool not found": "Bolão não encontrado!",
                "You've already joined in this pool":
                    "Você já está nesse bolão!",
            };

            const responseMessage = error.response?.data?.message;
            const errorMessage =
                messageDicionary[responseMessage] ?? defaultMessage;

            showError(errorMessage);
        }
    };

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Buscar por código" showBackButton />

            <VStack mt={8} mx={5} alignItems="center">
                <Heading
                    fontFamily="heading"
                    color="white"
                    fontSize="xl"
                    mb={8}
                    textAlign="center"
                >
                    Encontre um bolão através de seu código único
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual o código do bolão?"
                    autoCapitalize="characters"
                    onChangeText={setCode}
                    value={code}
                />

                <Button
                    title="Buscar Bolão"
                    uppercase
                    onPress={handleJoinPool}
                    isLoading={isLoading}
                />
            </VStack>
        </VStack>
    );
}
