import { createContext, ReactNode, useEffect, useState } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google"

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
    const [user, _setUser] = useState<UserProps>({} as UserProps);
    const [isUserLoading, setIsUserLoading] = useState(false);
        
    const [_request, response, promptAsync] = Google.useAuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ["profile", "email"],
    })

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
    }

    const signInWithGoogle = (access_token: string) => {
        console.log("TOKEN DE AUTENTICAÇÃO ===>", access_token);
    }

    useEffect(() => {
        if (response && response.type === "success" && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken)
        }
    }, [response]);
        
    return (
        <AuthContext.Provider value={{
            signIn,
            isUserLoading,
            user,
        }}>
            {children}
        </AuthContext.Provider>
    )
}