import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { api } from "../services/api";

import { GOOGLE_CLIENT_ID } from "@env";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    isUserLoading: boolean;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps>({} as UserProps);
    const [isUserLoading, setIsUserLoading] = useState(false);

    const [_, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ["profile", "email"],
    });

    const signIn = async () => {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (err) {
            console.log(err);
            throw err;
        } finally {
            setIsUserLoading(false);
        }
    };

    const signInWithGoogle = async (access_token: string) => {
        try {
            setIsUserLoading(true);

            const tokenResponse = await api.post("/users", { access_token });
            api.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${tokenResponse.data.token}`;

            const userInfoResponse = await api.get("/me");
            setUser(userInfoResponse.data.user);
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    };

    useEffect(() => {
        if (
            response &&
            response.type === "success" &&
            response.authentication?.accessToken
        ) {
            signInWithGoogle(response.authentication.accessToken);
        }
    }, [response]);

    return (
        <AuthContext.Provider
            value={{
                signIn,
                isUserLoading,
                user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
