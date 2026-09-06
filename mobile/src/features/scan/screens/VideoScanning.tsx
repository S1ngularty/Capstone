import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraView } from "expo-camera";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import {
  ArrowLeft,
  RotateCcw,
  Leaf,
  Timer,
  Mic,
  MicOff,
  Camera as CameraIcon,
  SwitchCamera,
  SwitchCameraIcon,
  LucideSwitchCamera
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import showToast from "../../../helper/toast";

const MAX_DURATION = 15; // seconds
const { width, height } = Dimensions.get("window");

const VideoScanningScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cameraType, setCameraType] = useState<"back" | "front">("back");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const navigation = useNavigation();

  const cameraRef = useRef<CameraView | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const recordButtonScale = useSharedValue(1);

  const animatedRecordButton = useAnimatedStyle(() => {
    return {
      transform: [{ scale: recordButtonScale.value }],
    };
  });

  useEffect(() => {
    // Request camera and microphone permissions
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(cameraStatus === "granted" && micStatus === "granted");
    })();

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      setRecordingTime(0);
      recordButtonScale.value = withTiming(0.8, { duration: 200 });

      // Start timer FIRST - before waiting for recordAsync
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_DURATION) {
            clearInterval(recordingTimerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // Start recording - this promise resolves when recording stops
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: MAX_DURATION, // Let Expo handle the max duration
        });

        if (video) {
          // Handle recorded video
          console.log("Video recorded:", video.uri);
          showToast("success", "", "Video recorded successfully!");
          // navigation.navigate("VideoPreview", { videoUri: video.uri });
        }
      } catch (error) {
        console.error("Recording error:", error);
        showToast("error", "", "Failed to record video");
      } finally {
        // Clean up after recording finishes (naturally or manually stopped)
        setIsRecording(false);
        setRecordingTime(0);
        recordButtonScale.value = withTiming(1, { duration: 200 });
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current && isRecording) {
      setIsProcessing(true);
      try {
        await cameraRef.current.stopRecording();
        // Timer will be cleaned up in the finally block of startRecording
        // when recordAsync promise resolves
      } catch (error) {
        console.error("Stop recording error:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const toggleCameraType = () => {
    setCameraType((current) => (current === "back" ? "front" : "back"));
  };

  const toggleMute = () => {
    setIsMuted((current) => !current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.permissionText}>
          Requesting camera and microphone permission...
        </Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <CameraIcon size={48} color="#999" strokeWidth={1.5} />
        <Text style={styles.permissionTitle}>Permissions Required</Text>
        <Text style={styles.permissionText}>
          Please grant camera and microphone permissions to record plant videos.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.permissionButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Camera View - Self Enclosing */}
      <CameraView
        ref={cameraRef}
        mode="video"
        focusable={true}
        style={StyleSheet.absoluteFill}
        facing={cameraType}
        videoQuality="720p"
        mute={isMuted}
        ratio="16:9"
        onCameraReady={() => {
          console.log("Camera is ready");
        }}
        onMountError={(event) => {
          console.error("Camera mount error:", event.message);
        }}
      />

      {/* Top Overlay */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        style={styles.topOverlay}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isRecording}
        >
          <ArrowLeft size={24} color="#fff" strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Leaf size={20} color="#4CAF50" strokeWidth={1.5} />
          <Text style={styles.titleText}>Scan Plant</Text>
        </View>

        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleMute}
            disabled={isRecording}
          >
            {isMuted ? (
              <MicOff size={22} color="#fff" strokeWidth={2} />
            ) : (
              <Mic size={22} color="#fff" strokeWidth={2} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={toggleCameraType}
            disabled={isRecording}
          >
            <LucideSwitchCamera size={24} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Scanning Frame - Vertical Rectangle */}
      <View style={styles.scanFrameContainer}>
        <View style={[styles.scanFrame, isRecording && styles.scanFrameActive]}>
          {/* Corner markers */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>
      </View>

      {/* Recording Indicator */}
      {isRecording && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={styles.recordingIndicator}
        >
          <View style={styles.recordingDot} />
          <Text style={styles.recordingText}>Scanning...</Text>
        </Animated.View>
      )}

      {/* Bottom Controls */}
      <Animated.View
        entering={FadeInUp.duration(400)}
        style={styles.bottomControls}
      >
        {/* Timer Display - Above the button */}
        {isRecording && (
          <View style={styles.timerContainer}>
            <Timer size={18} color="#4CAF50" strokeWidth={1.5} />
            <Text
              style={[
                styles.timerText,
                recordingTime >= MAX_DURATION - 5 && styles.timerWarning,
              ]}
            >
              {formatTime(recordingTime)} / {formatTime(MAX_DURATION)}
            </Text>
          </View>
        )}

        <View style={styles.controlsRow}>
          {/* Recording Button */}
          <Animated.View
            style={[styles.recordButtonWrapper, animatedRecordButton]}
          >
            <TouchableOpacity
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <View
                  style={[
                    styles.recordButtonInner,
                    isRecording && styles.recordButtonInnerActive,
                  ]}
                />
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.helpText}>
          {isRecording
            ? "Tap to stop scanning"
            : `Tap to start scanning (Max ${MAX_DURATION}s)`}
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    marginTop: 12,
  },
  permissionButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  topRightControls: {
    flexDirection: "row",
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  switchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  scanFrameContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  scanFrame: {
    width: width * 0.85,
    height: height * 0.6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 16,
    overflow: "hidden",
  },
  scanFrameActive: {
    borderColor: "#4CAF50",
    borderWidth: 3,
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "#4CAF50",
  },
  cornerTopLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  recordingIndicator: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    zIndex: 10,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
  },
  recordingText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  timerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "monospace",
  },
  timerWarning: {
    color: "#FF5252",
  },
  progressContainer: {
    position: "absolute",
    top: 175,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    zIndex: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  progressBarWarning: {
    backgroundColor: "#FF5252",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  recordButtonWrapper: {
    alignItems: "center",
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  recordButtonActive: {
    borderColor: "#4CAF50",
  },
  recordButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  recordButtonInnerActive: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
  },
  helpText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    textAlign: "center",
  },
});

export default VideoScanningScreen;
