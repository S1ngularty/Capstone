import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTabNavigator from "./HomeTabNavigation";

const UserStack = createNativeStackNavigator();

export default function UserNavigation() {
  return (
    <UserStack.Navigator screenOptions={{ headerShown: false }}>
      <UserStack.Screen component={HomeTabNavigator} name="HomeTabs" />
    </UserStack.Navigator>
  );
}
