import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthStackNavigation";
import { useAuth } from "@clerk/expo";
import UserNavigation from "./UserNavigation";

export type RootStackParamList = {
  Auth: undefined;
  User: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
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
          <RootStack.Screen component={UserNavigation} name="User" />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
