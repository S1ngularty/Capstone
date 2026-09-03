import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignUp from "../features/auth/screens/SignUp";
import EmailVerificationScreen from "../features/auth/screens/VerifyEmail";

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={SignUp} name="SignUp" />
      <AuthStack.Screen
        component={EmailVerificationScreen}
        name="VerifyEmail"
      />
    </AuthStack.Navigator>
  );
}
