import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignUp from "../features/auth/screens/SignUp";

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={SignUp} name="SignUp" />
    </AuthStack.Navigator>
  );
}
