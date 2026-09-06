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
import { useVideoPlayer, VideoView } from "expo-video";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ScanLine,
  Save,
  Leaf,
} from "lucide-react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { UserStackParamList } from "../../../navigations/UserNavigation";
import { NavigationProp } from "../types/navigationTypes";

const { width, height } = Dimensions.get("window");

type VideoScanningRouteProp = RouteProp<UserStackParamList, "VideoPreview">;

const VideoPreviewScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VideoScanningRouteProp>();
  const videoUri = route.params?.videoUri;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const buttonScale = useSharedValue(1);
  const playButtonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    };
  });

  const animatedPlayButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: playButtonScale.value }],
    };
  });

  // Initialize video player
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = false;
    player.playbackRate = 1.0;
    player.timeUpdateEventInterval = 0.5; // Update every 0.5 seconds
  });

  // Listen to player status changes
  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener("statusChange", (event) => {
      if (event.status === "readyToPlay") {
        setIsLoading(false);
        setVideoDuration(player.duration);
      } else if (event.status === "error") {
        setIsLoading(false);
        Alert.alert("Error", "Failed to load video");
      }
    });

    const timeUpdateSubscription = player.addListener("timeUpdate", (event) => {
      setCurrentPosition(event.currentTime);

      // Check if video has ended
      if (player.duration > 0 && event.currentTime >= player.duration - 0.1) {
        setIsPlaying(false);
        setHasEnded(true);
      }
    });

    return () => {
      subscription.remove();
      timeUpdateSubscription.remove();
    };
  }, [player]);

  useEffect(() => {
    return () => {
      if (player) {
        player.pause();
      }
    };
  }, [player]);

  const handlePlayPause = async () => {
    if (!player) return;

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      if (hasEnded) {
        player.currentTime = 0;
        setHasEnded(false);
      }
      player.play();
      setIsPlaying(true);
    }

    // Animate play button
    playButtonScale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
  };

  const handleReplay = async () => {
    if (!player) return;

    player.currentTime = 0;
    player.play();
    setIsPlaying(true);
    setHasEnded(false);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    buttonScale.value = withTiming(0.95, { duration: 100 });

    // Pause video if playing
    if (isPlaying && player) {
      player.pause();
      setIsPlaying(false);
    }

    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      buttonScale.value = withTiming(1, { duration: 100 });
      Alert.alert(
        "Analysis Started",
        "Your plant video is being analyzed for diseases.",
        [
          {
            text: "OK",
            // onPress: () => navigation.navigate("AnalysisResults"),
          },
        ],
      );
    }, 2000);
  };

  const handleRecapture = () => {
    Alert.alert(
      "Recapture Video",
      "Are you sure you want to discard this video and record a new one?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Recapture",
          style: "destructive",
          onPress: () => {
            if (player) {
              player.pause();
            }
            navigation.navigate("VideoScanning");
          },
        },
      ],
    );
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    buttonScale.value = withTiming(0.95, { duration: 100 });

    if (isPlaying && player) {
      player.pause();
      setIsPlaying(false);
    }

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      buttonScale.value = withTiming(1, { duration: 100 });
      Alert.alert("Draft Saved", "Your video has been saved to drafts.", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!videoUri) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Leaf size={48} color="#999" strokeWidth={1.5} />
        <Text style={styles.errorText}>No video found</Text>
        <TouchableOpacity
          style={styles.errorButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.errorButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (player) {
              player.pause();
            }
            navigation.goBack();
          }}
        >
          <ArrowLeft size={24} color="#2E7D32" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Preview</Text>
        <View style={styles.headerPlaceholder} />
      </Animated.View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4CAF50" />
          </View>
        )}

        {/* Play/Pause Overlay */}
        {!isLoading && (
          <TouchableOpacity
            style={styles.playOverlay}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            {hasEnded ? (
              <View style={styles.replayButton}>
                <RotateCcw size={32} color="#fff" strokeWidth={2} />
                <Text style={styles.replayText}>Replay</Text>
              </View>
            ) : (
              <Animated.View
                style={[styles.playButton, animatedPlayButtonStyle]}
              >
                {isPlaying ? (
                  <Pause size={36} color="#fff" strokeWidth={2} />
                ) : (
                  <Play size={36} color="#fff" strokeWidth={2} />
                )}
              </Animated.View>
            )}
          </TouchableOpacity>
        )}

        {/* Video Progress Bar */}
        {!isLoading && videoDuration > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(currentPosition / videoDuration) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.timeText}>
              {formatTime(currentPosition)} / {formatTime(videoDuration)}
            </Text>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(400)}
        style={styles.actionsContainer}
      >
        {/* Analyze Button - Primary */}
        <Animated.View style={animatedButtonStyle}>
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={isAnalyzing || isSaving}
            activeOpacity={0.8}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <ScanLine size={20} color="#fff" strokeWidth={2} />
                <Text style={styles.analyzeButtonText}>Analyze Plant</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRecapture}
            disabled={isAnalyzing || isSaving}
            activeOpacity={0.8}
          >
            <RotateCcw size={20} color="#4CAF50" strokeWidth={2} />
            <Text style={styles.secondaryButtonText}>Recapture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleSaveDraft}
            disabled={isAnalyzing || isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator color="#4CAF50" size="small" />
            ) : (
              <>
                <Save size={20} color="#4CAF50" strokeWidth={2} />
                <Text style={styles.secondaryButtonText}>Save to Draft</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#F5F5F0",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 20,
  },
  errorButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  errorButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F0",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E7D32",
  },
  headerPlaceholder: {
    width: 40,
    height: 40,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width,
    height: height * 0.6,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  replayButton: {
    alignItems: "center",
    gap: 8,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  replayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  progressContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    gap: 8,
  },
  progressBackground: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
  timeText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "monospace",
  },
  actionsContainer: {
    padding: 20,
    backgroundColor: "#fff",
    gap: 16,
  },
  analyzeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryActions: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4CAF50",
    backgroundColor: "#F8FDF8",
  },
  secondaryButtonText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default VideoPreviewScreen;
