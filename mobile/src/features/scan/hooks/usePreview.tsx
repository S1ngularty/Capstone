import React, { useState, useRef, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NavigationProp } from "../types/navigationTypes";
import { UserStackParamList } from "../../../navigations/UserNavigation";
import { useVideoPlayer } from "expo-video";
import showToast from "../../../helper/toast";
import { Alert } from "react-native";

type VideoScanningRouteProp = RouteProp<UserStackParamList, "VideoPreview">;

export default function usePreview() {
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
        showToast("error", "", "Failed to load video");
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
      showToast(
        "success",
        "Draft Saved",
        "Your video has been saved to drafts.",
      );
      navigation.navigate("HomeTabs");
    }, 1500);
  };
  return {
    isPlaying,
    isLoading,
    videoDuration,
    currentPosition,
    hasEnded,
    isAnalyzing,
    isSaving,
    buttonScale,
    playButtonScale,
    animatedPlayButtonStyle,
    animatedButtonStyle,
    player,
    videoUri,
    navigation,

    handlePlayPause,
    handleRecapture,
    handleAnalyze,
    handleSaveDraft,
  };
}
