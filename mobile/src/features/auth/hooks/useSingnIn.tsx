import React, { useEffect, useState } from "react";
import { isClerkAPIResponseError, useSignIn } from "@clerk/expo";
import { useNavigation } from "@react-navigation/native";
import showToast from "../../../helper/toast";

interface SignInCredentials {
  email: string;
  password: string;
}

export default function SignInHook() {
  const { signIn, fetchStatus, errors } = useSignIn();
  const navigation = useNavigation();
  const [credentials, setCredentials] = useState<SignInCredentials>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (): Promise<void> => {
    try {
      if (!credentials.email || !credentials.password) {
        showToast(
          "error",
          "Sign up error",
          "Please fill out the fields first.",
        );
        return;
      }

      if (!signIn) return;

      setLoading(true);

      const { error } = await signIn.password({
        emailAddress: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      console.log(signIn.status);

      if (signIn.status === "complete") {
        navigation.navigate("Home" as never);
      }

      return;
    } catch (error) {
      if (isClerkAPIResponseError(error)) {
        if (
          error?.code === "form_password_incorrect" ||
          error?.code === "form_identifier_not_found"
        ) {
          showToast(
            "error",
            "Sign in Error",
            "Invalid email or password. Please try again.",
          );
        } else {
          showToast(
            "error",
            "Sign in Error",
            "An error occured, please try again later",
          );
        }
      } else {
        console.log("Clerk sign up error:", error);
        showToast(
          "error",
          "Sign in Error",
          "A network error occurred. Please try again.",
        );
      }
      console.error("Sign In Error:", error);
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (fieldName: string, value: string) => {
    setCredentials((prev) => ({ ...prev, [fieldName]: value }));
    if (error) setError("");
  };

  return {
    credentials,
    navigation,
    error,
    loading,

    handleInput,
    setCredentials,
    handleSignIn,
    setError,
  };
}
