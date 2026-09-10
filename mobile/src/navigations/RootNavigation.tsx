import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/expo";
import AuthNavigator from "./AuthStackNavigation";
import UserNavigation from "./UserNavigation";
export type RootStackParamList = { Auth: undefined; User: undefined };
const RootStack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) {
    return null;
  }

  console.log("Is signedIn?:", isSignedIn);
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <RootStack.Screen name="User" component={UserNavigation} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
