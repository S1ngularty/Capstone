import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabNavigator from "./HomeTabNavigation";
import VideoScanningScreen from "../features/scan/screens/VideoScanning";
import VideoPreviewScreen from "../features/scan/screens/VideoPreview";

export type UserStackParamList = {
  HomeTabs: undefined;
  VideoScanning: undefined;
  VideoPreview: {
    videoUri: string;
  };
};

const UserStack = createNativeStackNavigator<UserStackParamList>();

export default function UserNavigation() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen component={HomeTabNavigator} name="HomeTabs" />
      <UserStack.Screen
        component={VideoScanningScreen}
        name="VideoScanning"
        options={{
          animation: "slide_from_left", // Optional: nice animation for scanner
        }}
      />
      <UserStack.Screen component={VideoPreviewScreen} name="VideoPreview" />
    </UserStack.Navigator>
  );
}
