import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import {
  Leaf,
  Mail,
  Lock,
  User,
  ChevronRight,
  Phone,
} from "lucide-react-native";
import useSignUpHook from "../hooks/useSignUp";

const SignUpScreen = () => {
  const { credentials, loading, handleSignUp, handleInput } = useSignUpHook();

  const [language, setLanguage] = useState("en");
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const handlePressIn = () => {
    buttonScale.value = withTiming(0.97, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const socialButtons = [
    { icon: "G", label: "Continue with Google", color: "#DB4437" },
    { icon: "f", label: "Continue with Facebook", color: "#4267B2" },
    { icon: "📱", label: "Continue with Device", color: "#333333" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            entering={FadeInDown.duration(600)}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <Leaf size={32} color="#4CAF50" strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Grow with us</Text>
          </Animated.View>

          {/* Form */}
          <Animated.View
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.form}
          >
            <View style={styles.inputContainer}>
              <Mail
                size={20}
                color="#666"
                strokeWidth={1.5}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={credentials.email}
                onChangeText={(value) => handleInput("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Lock
                size={20}
                color="#666"
                strokeWidth={1.5}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={credentials.password}
                onChangeText={(value) => handleInput("password", value)}
                secureTextEntry
                autoComplete="password-new"
              />
            </View>

            <Animated.View style={animatedButtonStyle}>
              <Pressable
                onPress={handleSignUp}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading}
                style={[styles.signUpButton, loading && styles.buttonDisabled]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                    <ChevronRight size={20} color="#fff" strokeWidth={2} />
                  </>
                )}
              </Pressable>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons - Single Column */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => console.log("Google Sign Up")}
              >
                <View style={styles.socialButtonContent}>
                  <Text style={[styles.socialIcon, { color: "#DB4437" }]}>
                    G
                  </Text>
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => console.log("Facebook Sign Up")}
              >
                <View style={styles.socialButtonContent}>
                  <Text style={[styles.socialIcon, { color: "#4267B2" }]}>
                    f
                  </Text>
                  <Text style={styles.socialButtonText}>
                    Continue with Facebook
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() => console.log("Device Sign Up")}
              >
                <View style={styles.socialButtonContent}>
                  <Phone size={24} color="#333" strokeWidth={1.5} />
                  <Text style={styles.socialButtonText}>
                    Continue with Device
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => console.log("Navigate to Sign In")}
              >
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Language Selector */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.languageContainer}
          >
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "en" && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage("en")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "en" && styles.languageTextActive,
                ]}
              >
                EN
              </Text>
            </TouchableOpacity>
            <View style={styles.languageDivider} />
            <TouchableOpacity
              style={[
                styles.languageButton,
                language === "fil" && styles.languageButtonActive,
              ]}
              onPress={() => setLanguage("fil")}
            >
              <Text
                style={[
                  styles.languageText,
                  language === "fil" && styles.languageTextActive,
                ]}
              >
                FIL
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
  },
  signUpButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D0D0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  socialButtonsContainer: {
    gap: 12,
  },
  socialButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  socialIcon: {
    fontSize: 20,
    fontWeight: "600",
    marginRight: 1,
    width: 24,
    textAlign: "center",
  },
  socialButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signInText: {
    color: "#666",
    fontSize: 14,
  },
  signInLink: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  languageButtonActive: {
    backgroundColor: "#E8F5E9",
  },
  languageText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  languageTextActive: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  languageDivider: {
    width: 1,
    height: 20,
    backgroundColor: "#D0D0D0",
    marginHorizontal: 8,
  },
});

export default SignUpScreen;
