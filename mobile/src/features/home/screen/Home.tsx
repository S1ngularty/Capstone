import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import {
  Leaf,
  ScanLine,
  ChevronRight,
  Sprout,
  CloudSun,
  MapPin,
  Bell,
  Upload,
  BookOpen,
  Bug,
  CircleAlert,
  Wifi,
  WifiOff,
  Video,
  FileText,
  Camera,
  ShieldCheck,
  FlaskConical,
  Calendar,
  ArrowRight,
  Sun,
  ThermometerSun,
  Droplets,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface CropArticle {
  id: string;
  title: string;
  category: string;
  color: string;
  icon: any;
  articles: number;
}

interface ScanRecord {
  id: string;
  cropName: string;
  date: string;
  result: string;
  confidence: number;
  type: "disease" | "pest" | "healthy";
  color: string;
}

interface UploadQueue {
  id: string;
  fileName: string;
  size: string;
  duration: string;
  status: "pending" | "uploading" | "queued";
  progress?: number;
}

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const cropCategories: CropArticle[] = [
    {
      id: "1",
      title: "Tomato",
      category: "12 Articles",
      color: "#F44336",
      icon: Sprout,
      articles: 12,
    },
    {
      id: "2",
      title: "Pepper",
      category: "8 Articles",
      color: "#4CAF50",
      icon: Leaf,
      articles: 8,
    },
    {
      id: "3",
      title: "Eggplant",
      category: "10 Articles",
      color: "#9C27B0",
      icon: Sprout,
      articles: 10,
    },
    {
      id: "4",
      title: "Potato",
      category: "6 Articles",
      color: "#FF9800",
      icon: Leaf,
      articles: 6,
    },
  ];

  const recentScans: ScanRecord[] = [
    {
      id: "1",
      cropName: "Tomato Leaf Sample",
      date: "2 hours ago",
      result: "Early Blight",
      confidence: 87,
      type: "disease",
      color: "#F44336",
    },
    {
      id: "2",
      cropName: "Pepper Plant",
      date: "5 hours ago",
      result: "Aphids",
      confidence: 92,
      type: "pest",
      color: "#FF9800",
    },
    {
      id: "3",
      cropName: "Eggplant Leaf",
      date: "1 day ago",
      result: "Healthy",
      confidence: 95,
      type: "healthy",
      color: "#4CAF50",
    },
  ];

  const uploadQueue: UploadQueue[] = [
    {
      id: "1",
      fileName: "tomato_scan_001.mp4",
      size: "24 MB",
      duration: "0:45",
      status: "pending",
    },
    {
      id: "2",
      fileName: "pepper_field_002.mp4",
      size: "18 MB",
      duration: "0:32",
      status: "queued",
    },
  ];

  const getScanIcon = (type: string) => {
    switch (type) {
      case "disease":
        return ShieldCheck;
      case "pest":
        return Bug;
      case "healthy":
        return Leaf;
      default:
        return Leaf;
    }
  };

  const getStatusIcon = () => {
    return isOnline ? Wifi : WifiOff;
  };

  const StatusIcon = getStatusIcon();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
            colors={["#4CAF50"]}
          />
        }
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning</Text>
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#666" strokeWidth={1.5} />
              <Text style={styles.location}>Your Farm</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.statusIndicator}>
              <StatusIcon
                size={16}
                color={isOnline ? "#4CAF50" : "#F44336"}
                strokeWidth={1.5}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: isOnline ? "#4CAF50" : "#F44336" },
                ]}
              >
                {isOnline ? "Online" : "Offline"}
              </Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={22} color="#4CAF50" strokeWidth={1.5} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Weather Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(600)}
          style={styles.weatherCard}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"]}
            style={styles.weatherGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherMain}>
              <View>
                <Text style={styles.weatherTemp}>28°C</Text>
                <Text style={styles.weatherCondition}>Partly Cloudy</Text>
              </View>
              <CloudSun size={64} color="#fff" strokeWidth={1.5} />
            </View>
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetail}>
                <Droplets size={16} color="#fff" strokeWidth={1.5} />
                <Text style={styles.weatherDetailText}>65% Humidity</Text>
              </View>
              <View style={styles.weatherDetail}>
                <ThermometerSun size={16} color="#fff" strokeWidth={1.5} />
                <Text style={styles.weatherDetailText}>Good for planting</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Action - Scan */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.scanSection}
        >
          <TouchableOpacity style={styles.scanButton} activeOpacity={0.7}>
            <View style={styles.scanIconContainer}>
              <ScanLine size={28} color="#4CAF50" strokeWidth={2} />
            </View>
            <View style={styles.scanContent}>
              <Text style={styles.scanTitle}>Scan Crop</Text>
              <Text style={styles.scanSubtitle}>
                Detect diseases and pests instantly
              </Text>
            </View>
            <ChevronRight size={20} color="#4CAF50" strokeWidth={1.5} />
          </TouchableOpacity>
        </Animated.View>

        {/* Solanaceous Crops - 2x2 Grid */}
        <Animated.View
          entering={FadeInUp.delay(300).duration(600)}
          style={styles.cropsSection}
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Solanaceous Crops</Text>
              <Text style={styles.sectionSubtitle}>
                Guides & information for your crops
              </Text>
            </View>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>View All</Text>
              <ArrowRight size={16} color="#4CAF50" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.cropsGrid}>
            {cropCategories.map((crop) => {
              const CropIcon = crop.icon;
              return (
                <TouchableOpacity
                  key={crop.id}
                  style={styles.cropCard}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.cropIconContainer,
                      { backgroundColor: crop.color },
                    ]}
                  >
                    <CropIcon size={32} color="#fff" strokeWidth={1.5} />
                  </View>
                  <Text style={styles.cropTitle}>{crop.title}</Text>
                  <Text style={styles.cropCategory}>{crop.category}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Recent Scans */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.scansSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>History</Text>
              <ArrowRight size={16} color="#4CAF50" strokeWidth={1.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.scansList}>
            {recentScans.map((scan) => {
              const ScanIcon = getScanIcon(scan.type);
              return (
                <TouchableOpacity
                  key={scan.id}
                  style={styles.scanCard}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.scanIconSmall,
                      { backgroundColor: scan.color },
                    ]}
                  >
                    <ScanIcon size={20} color="#fff" strokeWidth={1.5} />
                  </View>
                  <View style={styles.scanInfo}>
                    <Text style={styles.scanCropName}>{scan.cropName}</Text>
                    <Text style={styles.scanDate}>{scan.date}</Text>
                  </View>
                  <View style={styles.scanResult}>
                    <Text
                      style={[styles.scanResultText, { color: scan.color }]}
                    >
                      {scan.result}
                    </Text>
                    <Text style={styles.scanConfidence}>
                      {scan.confidence}%
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </Animated.View>

        {/* Upload Queue */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600)}
          style={styles.uploadSection}
        >
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Upload Queue</Text>
              <Text style={styles.sectionSubtitle}>
                Videos pending upload
              </Text>
            </View>
            <View style={styles.queueBadge}>
              <Text style={styles.queueBadgeText}>{uploadQueue.length}</Text>
            </View>
          </View>

          <View style={styles.uploadList}>
            {uploadQueue.map((item) => (
              <View key={item.id} style={styles.uploadCard}>
                <View style={styles.uploadIconContainer}>
                  <Video size={20} color="#4CAF50" strokeWidth={1.5} />
                </View>
                <View style={styles.uploadInfo}>
                  <Text style={styles.uploadFileName}>{item.fileName}</Text>
                  <View style={styles.uploadMeta}>
                    <Text style={styles.uploadMetaText}>{item.size}</Text>
                    <View style={styles.dot} />
                    <Text style={styles.uploadMetaText}>{item.duration}</Text>
                  </View>
                </View>
                <View style={styles.uploadStatus}>
                  {item.status === "pending" ? (
                    <Upload size={16} color="#FF9800" strokeWidth={1.5} />
                  ) : (
                    <CircleAlert size={16} color="#4CAF50" strokeWidth={1.5} />
                  )}
                  <Text
                    style={[
                      styles.uploadStatusText,
                      {
                        color:
                          item.status === "pending" ? "#FF9800" : "#4CAF50",
                      },
                    ]}
                  >
                    {item.status === "pending" ? "Pending" : "Queued"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F0",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2E7D32",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F44336",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  weatherCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
  },
  weatherGradient: {
    padding: 20,
  },
  weatherMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  weatherTemp: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  weatherCondition: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginTop: 4,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weatherDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  weatherDetailText: {
    color: "#fff",
    fontSize: 12,
    opacity: 0.9,
  },
  scanSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  scanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  scanContent: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  scanSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  cropsSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  cropsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cropCard: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 4,
  },
  cropIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cropTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  cropCategory: {
    fontSize: 12,
    color: "#666",
  },
  scansSection: {
    marginBottom: 24,
  },
  scansList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  scanCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  scanIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scanInfo: {
    flex: 1,
  },
  scanCropName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  scanDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  scanResult: {
    alignItems: "flex-end",
  },
  scanResultText: {
    fontSize: 12,
    fontWeight: "600",
  },
  scanConfidence: {
    fontSize: 10,
    color: "#999",
    marginTop: 2,
  },
  uploadSection: {
    paddingHorizontal: 20,
  },
  queueBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FF9800",
    alignItems: "center",
    justifyContent: "center",
  },
  queueBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  uploadList: {
    gap: 12,
  },
  uploadCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadInfo: {
    flex: 1,
  },
  uploadFileName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  uploadMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  uploadMetaText: {
    fontSize: 11,
    color: "#999",
  },
  uploadStatus: {
    alignItems: "center",
    gap: 4,
  },
  uploadStatusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#999",
  },
});

export default HomeScreen;