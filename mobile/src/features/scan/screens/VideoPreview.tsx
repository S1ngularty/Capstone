import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { VideoView } from "expo-video";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  ScanLine,
  Save,
  Leaf,
} from "lucide-react-native";
import { formatTime } from "../../../utils/formatTime";
import usePreview from "../hooks/usePreview";

const { width, height } = Dimensions.get("window");

const VideoPreviewScreen = () => {
  const {
    isPlaying,
    isLoading,
    videoDuration,
    currentPosition,
    hasEnded,
    isAnalyzing,
    isSaving,
    animatedPlayButtonStyle,
    animatedButtonStyle,
    player,
    videoUri,
    navigation,

    handlePlayPause,
    handleRecapture,
    handleAnalyze,
    handleSaveDraft,
  } = usePreview();

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
