import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignUp from "../features/auth/screens/SignUp";
import EmailVerificationScreen from "../features/auth/screens/VerifyEmail";
import SignInScreen from "../features/auth/screens/SignIn";

const AuthStack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen component={SignInScreen} name="SignIn" />
      <AuthStack.Screen component={SignUp} name="SignUp" />
      <AuthStack.Screen
        component={EmailVerificationScreen}
        name="VerifyEmail"
      />
    </AuthStack.Navigator>
  );
}
