import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthStackNavigation";
import { useAuth } from "@clerk/expo";
import UserNavigation from "./UserNavigation";

const RootStack = createNativeStackNavigator();

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
};

export default function RootNavigator<RootStackParamList>() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <RootStack.Screen component={AuthNavigator} name="Auth" />
        ) : (
          <RootStack.Screen component={UserNavigation} name="user" />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
