import { useState } from "react";
import { Heading, Text, VStack } from "native-base";

import Logo from "../../assets/logo.svg";
import { Header } from "../../components/Header";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

import { api } from "../../services/api";

import { useNotification } from "../../hooks/useShowNotification";

export function New() {
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { showSuccess, showError } = useNotification();

    const handlePoolCreate = async () => {
        if (!title.trim()) {
            return showError("Informe um nome para o seu bolão");
        }

        try {
            setIsLoading(true);

            await api.post("/pools", {
                title,
            });

            showSuccess("Bolão criado com sucesso!");

            setTitle("");
        } catch (error) {
            console.log(error);

            showError("Não foi possível criar o bolão");

            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VStack flex={1} bgColor="gray.900">
            <Header title="Criar novo bolão" />

            <VStack mt={8} mx={5} alignItems="center">
                <Logo />

                <Heading
                    fontFamily="heading"
                    color="white"
                    fontSize="xl"
                    my={8}
                    textAlign="center"
                >
                    Crie seu próprio bolão da copa e compartilhe entre amigos!
                </Heading>

                <Input
                    mb={2}
                    placeholder="Qual nome do seu bolão?"
                    onChangeText={setTitle}
                    value={title}
                />

                <Button
                    title="Criar meu bolão"
                    uppercase={true}
                    onPress={handlePoolCreate}
                    isLoading={isLoading}
                />

                <Text
                    color="gray.200"
                    fontSize="sm"
                    textAlign="center"
                    px={10}
                    mt={4}
                >
                    Após criar seu bolão, você receberá um código único que
                    poderá usar para convidar outras pessoas.
                </Text>
            </VStack>
        </VStack>
    );
}
