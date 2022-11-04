import React from "react";
import { Center, Text, Icon } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

import Logo from "../../assets/logo.svg";
import { Button } from "../../components/Button";

export function SignIn() {
    const { signIn, isUserLoading } = useAuth();

    return (
        <Center flex={1} bgColor="gray.900" p={7}>
            <Logo />
            <Button
                type="SECONDARY"
                title="Entrar com google"
                uppercase={true}
                leftIcon={
                    <Icon as={Fontisto} name="google" color="white" size="md" />
                }
                mt={12}
                onPress={signIn}
                isLoading={isUserLoading}
                _loading={{ _spinner: { color: "white" } }}
            />
            <Text color="white" textAlign="center" mt={4}>
                Não utilizamos nenhuma informação além {"\n"} do seu e-mail para
                criação de sua conta.
            </Text>
        </Center>
    );
}
