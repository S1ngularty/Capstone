import React, { useState } from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import {
  Leaf,
  Mail,
  Lock,
  ChevronRight,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react-native";
import SignInHook from "../hooks/useSingnIn";

const SignInScreen = () => {
  const { credentials, loading, error, handleInput, handleSignIn, navigation } =
    SignInHook();

  const [language, setLanguage] = useState("en");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSignInPress = async () => {
    if (!credentials.email || !credentials.password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password.",
      );
      return;
    }

    await handleSignIn();
  };

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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
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
                placeholder="Email Address"
                placeholderTextColor="#999"
                value={credentials.email}
                onChangeText={(value) => handleInput("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
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
                secureTextEntry={!showPassword}
                autoComplete="password"
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" strokeWidth={1.5} />
                ) : (
                  <Eye size={20} color="#666" strokeWidth={1.5} />
                )}
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {error && (
              <Animated.View
                entering={FadeInDown.duration(300)}
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{error}</Text>
              </Animated.View>
            )}

            <Animated.View style={animatedButtonStyle}>
              <Pressable
                onPress={handleSignInPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading}
                style={[styles.signInButton, loading && styles.buttonDisabled]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                    <ChevronRight size={20} color="#fff" strokeWidth={2} />
                  </>
                )}
              </Pressable>
            </Animated.View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => console.log("Navigate to Forgot Password")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons - Single Column */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    "Google Sign In",
                    "Google authentication coming soon",
                  )
                }
              >
                <View style={styles.socialButtonContent}>
                  <View
                    style={[
                      styles.socialIconContainer,
                      { backgroundColor: "#DB4437" },
                    ]}
                  >
                    <Text style={styles.socialIconText}>G</Text>
                  </View>
                  <Text style={styles.socialButtonText}>
                    Continue with Google
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    "Facebook Sign In",
                    "Facebook authentication coming soon",
                  )
                }
              >
                <View style={styles.socialButtonContent}>
                  <View
                    style={[
                      styles.socialIconContainer,
                      { backgroundColor: "#4267B2" },
                    ]}
                  >
                    <Text style={styles.socialIconText}>f</Text>
                  </View>
                  <Text style={styles.socialButtonText}>
                    Continue with Facebook
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    "Device Sign In",
                    "Device authentication coming soon",
                  )
                }
              >
                <View style={styles.socialButtonContent}>
                  <View
                    style={[
                      styles.socialIconContainer,
                      { backgroundColor: "#333333" },
                    ]}
                  >
                    <Globe size={20} color="#fff" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.socialButtonText}>
                    Continue with Device
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUp" as never)}
              >
                <Text style={styles.signUpLink}> Sign Up</Text>
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
                English
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
                Filipino
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
  eyeButton: {
    padding: 8,
  },
  errorContainer: {
    backgroundColor: "#FFF5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  errorText: {
    color: "#EF5350",
    fontSize: 14,
    textAlign: "center",
  },
  signInButton: {
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
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  forgotPasswordButton: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
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
  },
  socialIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  socialIconText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  socialButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signUpText: {
    color: "#666",
    fontSize: 14,
  },
  signUpLink: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
  languageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  languageButton: {
    paddingHorizontal: 16,
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

export default SignInScreen;
