import React, { useState, useRef, useEffect } from "react";
import { useSignUp } from "@clerk/expo";
import { useNavigation } from "@react-navigation/native";
import showToast from "../../../helper/toast";

interface UserCredentials {
  first_name: string;
  last_name: string;
  role: "user";
  username?: string;
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
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setverificationStatus] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (
      // !credentials.first_name.trim() ||
      // !credentials.last_name.trim() ||
      !credentials.email ||
      !credentials.password
    ) {
      showToast("error", "Sign up error", "Please fill out the fields first.");
      return;
    }

    if (!signUp) return;

    setLoading(true);

    try {
      const { error } = await signUp.create({
        emailAddress: credentials.email,
        password: credentials.password,
      });

      if (signUp.unverifiedFields.includes("email_address")) {
        const { error: codeError } = await signUp.verifications.sendEmailCode();

        if (codeError) {
          console.error("Verification error:", codeError);
          showToast(
            "error",
            "Sign up verification",
            "Failed to send a verification code, please try again.",
          );

          return;
        }
      }

      showToast("success", "Sign up verification", "Verification code sent.");
      navigation.navigate("VerifyEmail" as never);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!signUp) return;
    if (!verificationCode) return;
    setLoading(true);

    try {
      const attemptVerification = await signUp.verifications.verifyEmailCode({
        code: verificationCode,
      });
      if (attemptVerification.error)
        throw new Error(attemptVerification.error.message);

      if (signUp.status === "complete") {
        console.log("User is now authenticated!");
        setverificationStatus(true);
      }
    } catch (error) {
      console.error("email verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!signUp) return;
    setLoading(true);
    try {
      await signUp.verifications.sendEmailCode();
      console.log("New verification code sent!");
    } catch (error) {
      console.log("Failed to send verification code, Please try again.");
      console.error("Resend code error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (fieldName: string, value: unknown): void => {
    setCredentials((prev) => ({ ...prev, [fieldName]: value }));
  };

  return {
    credentials,
    loading,
    navigation,
    verificationCode,
    verificationStatus,
    setCredentials,
    handleSignUp,
    setVerificationCode,
    handleVerifyEmail,
    handleResendCode,
    handleInput,
  };
}
