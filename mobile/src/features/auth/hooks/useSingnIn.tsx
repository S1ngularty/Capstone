import React, { useEffect, useState } from "react";
import { useSignIn } from "@clerk/expo";
import { useNavigation } from "@react-navigation/native";

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
      if (!credentials.email || !credentials.password)
        throw new Error("Please fill out the fields.");

      if (!signIn) return;

      setLoading(true);

      const { error } = await signIn.password({
        emailAddress: credentials.email,
        password: credentials.password,
      });

      if (error) throw new Error(`failed to SignIn: ${error.message}`);

      if (signIn.status === "complete") {
        navigation.navigate("Home" as never);
      }

      return;
    } catch (error) {
      console.error("SingIn Error:", error);
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
