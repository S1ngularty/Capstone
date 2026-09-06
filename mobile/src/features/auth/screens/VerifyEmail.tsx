import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import {
  Mail,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  Leaf,
} from "lucide-react-native";
import useSignUpHook from "../hooks/useSignUp";

const EmailVerificationScreen = () => {
  const {
    credentials,
    loading,
    navigation,
    verificationStatus,
    verificationCode,
    handleVerifyEmail,
    handleResendCode,
    setVerificationCode,
  } = useSignUpHook();

  const [activeIndex, setActiveIndex] = useState(0);
  const [resendTimer, setResendTimer] = useState(30);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const buttonScale = useSharedValue(1);
  const successScale = useSharedValue(0);
  const errorShake = useSharedValue(0);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const animatedSuccessStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: successScale.value }],
      opacity: successScale.value,
    };
  });

  const animatedErrorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: errorShake.value }],
    };
  });

  useEffect(() => {
    // Focus first input on mount
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
  }, []);

  useEffect(() => {
    // Resend timer countdown
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Watch for verification completion from the hook
  useEffect(() => {
    if (verificationStatus) {
      setVerificationSuccess(true);
      successScale.value = withTiming(1, { duration: 400 });

      // Navigate to home or next screen after successful verification
    //   setTimeout(() => {
    //     navigation.navigate("Home" as never);
    //   }, 1500);
    }
  }, [verificationStatus]);

  const handleCodeChange = (text: string, index: number) => {
    const codeArray = verificationCode.split("");
    while (codeArray.length < 6) codeArray.push("");

    // Handle paste
    if (text.length > 1) {
      const pastedCode = text.slice(0, 6).split("");
      for (let i = 0; i < pastedCode.length; i++) {
        if (index + i < 6) {
          codeArray[index + i] = pastedCode[i];
        }
      }
      const newCode = codeArray.join("");
      setVerificationCode(newCode);

      // Move focus to last filled input or first empty
      const nextEmptyIndex = codeArray.findIndex((char) => char === "");
      if (nextEmptyIndex !== -1) {
        inputRefs.current[nextEmptyIndex]?.focus();
        setActiveIndex(nextEmptyIndex);
      } else {
        inputRefs.current[5]?.focus();
        setActiveIndex(5);
      }
      return;
    }

    // Handle single character
    codeArray[index] = text;
    const newCode = codeArray.join("");
    setVerificationCode(newCode);

    // Auto-advance to next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    const codeArray = verificationCode.split("");
    while (codeArray.length < 6) codeArray.push("");

    if (e.nativeEvent.key === "Backspace" && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);

      // Clear previous input
      codeArray[index - 1] = "";
      setVerificationCode(codeArray.join(""));
    }
  };

  const triggerShakeAnimation = () => {
    errorShake.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      triggerShakeAnimation();
      return;
    }
    setError("");

    try {
      await handleVerifyEmail();
      // The verificationStatus flag will be set by the hook
      // and the useEffect will handle the success animation and navigation
    } catch (error) {
      setError("Invalid code. Please try again.");
      triggerShakeAnimation();
      // Clear the code inputs on error
      setVerificationCode("");
      setActiveIndex(0);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      setVerificationCode("");
      setActiveIndex(0);
      inputRefs.current[0]?.focus();
      setError("");

      try {
        await handleResendCode();
        Alert.alert(
          "Code Sent",
          "A new verification code has been sent to your email.",
        );
      } catch (error) {
        Alert.alert("Error", "Failed to resend code. Please try again.");
      }
    }
  };

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  // Helper to get individual digits from verificationCode
  const getDigit = (index: number) => {
    return verificationCode[index] || "";
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.content}>
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.header}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color="#2E7D32" strokeWidth={1.5} />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Mail size={32} color="#4CAF50" strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>We sent a verification code to</Text>
            <Text style={styles.emailText}>{credentials.email}</Text>
          </Animated.View>

          {/* Code Input */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={[styles.codeContainer, animatedErrorStyle]}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <TextInput
                key={index}
                ref={(ref): void => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.codeInput,
                  activeIndex === index && styles.codeInputActive,
                  getDigit(index) && styles.codeInputFilled,
                  error && styles.codeInputError,
                ]}
                value={getDigit(index)}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => setActiveIndex(index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!verificationStatus}
              />
            ))}
          </Animated.View>

          {/* Error Message */}
          {error && (
            <Animated.View
              entering={FadeInDown.duration(300)}
              style={styles.errorContainer}
            >
              <Text style={styles.errorText}>{error}</Text>
            </Animated.View>
          )}

          {/* Verification Status */}
          {verificationSuccess && (
            <Animated.View
              style={[styles.successContainer, animatedSuccessStyle]}
            >
              <CheckCircle size={24} color="#4CAF50" strokeWidth={1.5} />
              <Text style={styles.successText}>
                Email Verified Successfully!
              </Text>
            </Animated.View>
          )}

          {/* Verify Button */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(600)}
            style={[styles.verifyButtonWrapper, animatedButtonStyle]}
          >
            <Pressable
              onPress={handleVerify}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading || verificationStatus}
              style={[
                styles.verifyButton,
                (loading || verificationStatus) && styles.buttonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.verifyButtonText}>
                  {verificationStatus ? "Verified" : "Verify Code"}
                </Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Resend Section */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.resendContainer}
          >
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={resendTimer > 0 || verificationStatus}
              style={styles.resendButton}
            >
              {resendTimer > 0 ? (
                <Text style={styles.resendTimer}>
                  Resend code in {resendTimer}s
                </Text>
              ) : (
                <View style={styles.resendButtonContent}>
                  <RefreshCw size={16} color="#4CAF50" strokeWidth={1.5} />
                  <Text style={styles.resendLink}>Resend Code</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Help Text */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            style={styles.helpContainer}
          >
            <Leaf size={16} color="#999" strokeWidth={1.5} />
            <Text style={styles.helpText}>
              Check your spam folder if you don't see the email
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  emailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginTop: 4,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 56,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    textAlign: "center",
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
  },
  codeInputActive: {
    borderColor: "#4CAF50",
    borderWidth: 2,
    backgroundColor: "#F8FDF8",
  },
  codeInputFilled: {
    borderColor: "#81C784",
    backgroundColor: "#F0F8F0",
  },
  codeInputError: {
    borderColor: "#EF5350",
    backgroundColor: "#FFF5F5",
  },
  errorContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  errorText: {
    color: "#EF5350",
    fontSize: 14,
    fontWeight: "500",
  },
  verifyButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  verifyButtonWrapper: {
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
  },
  successText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
  },
  resendButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resendLink: {
    color: "#4CAF50",
    fontSize: 15,
    fontWeight: "600",
  },
  resendTimer: {
    color: "#999",
    fontSize: 14,
  },
  helpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: "auto",
    marginBottom: 20,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default EmailVerificationScreen;
