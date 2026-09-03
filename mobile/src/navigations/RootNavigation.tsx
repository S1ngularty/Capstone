import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthStackNavigation";

const RootStack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Details: {
    id: string;
  };
};

export default function RootNavigator<RootStackParamList>() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen component={AuthNavigator} name="Auth" />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
