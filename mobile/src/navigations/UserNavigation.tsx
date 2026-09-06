import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabNavigator from "./HomeTabNavigation";
import VideoScanningScreen from "../features/scan/screens/VideoScanning";

const UserStack = createNativeStackNavigator();

export default function UserNavigation() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen component={HomeTabNavigator} name="HomeTabs" />
      <UserStack.Screen component={VideoScanningScreen} name="VideoScanning" />
    </UserStack.Navigator>
  );
}
