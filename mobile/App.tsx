import React from "react";
import { NativeBaseProvider, StatusBar } from "native-base";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { Loading } from "./src/components/Loading";
// import { New } from "./src/screens/New";
// import { SignIn } from "./src/screens/SignIn";
// import { Find } from "./src/screens/Find";
import { Pools } from "./src/screens/Pools";
import { AuthContextProvider } from "./src/contexts/AuthContext";

import { THEME } from "./src/styles/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {!fontsLoaded ? <Loading /> : <Pools />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}
