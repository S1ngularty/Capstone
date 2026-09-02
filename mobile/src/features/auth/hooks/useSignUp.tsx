import React, { useState, useRef, useEffect } from "react";
import { useSignUp } from "@clerk/expo";
import { useNavigation } from "@react-navigation/native";

interface UserCredentials {
  first_name: string;
  last_name: string;
  role: "user";
  username: string;
  email: string;
  password: string;
}

export default function () {
  const { signUp } = useSignUp();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState<UserCredentials>({
    first_name: "",
    last_name: "",
    role: "user",
    username: "",
    email: "",
    password: "",
  });

  const handleSignUp = async () => {
    if (
      !credentials.first_name.trim() ||
      !credentials.last_name.trim() ||
      !credentials.email ||
      !credentials.password
    ) {
      console.log("Please fill out all required fields.");
      return;
    }

    if (!signUp) return;

    setLoading(true);

    try {
      const { error } = await signUp.create({
        firstName: credentials.first_name,
        lastName: credentials.last_name,
        username: credentials.username,
        emailAddress: credentials.email,
        password: credentials.password,
      });

      if (signUp.unverifiedFields.includes("email_address")) {
        const { error: codeError } = await signUp.verifications.sendEmailCode();

        if (codeError) {
          console.log("Failed to send verification code, Please try again.");
        }
        return;
      }

      console.log("Verification code sent!");
      // navigation.navigate("VerifyEmail" as never);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleInput = (fieldName: string, value: unknown): void => {
    setCredentials((prev) => ({ ...prev, [fieldName]: value }));
  };
}
