import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import InitPage from "./src/pages/initPage";
import Home from "./src/pages/home";
import Restaurant from "./src/pages/restaurant";
import Menu from "./src/pages/menu";
import ItemDetails from "./src/pages/item-details";
import DynamicForm from "./src/pages/DynamicForm";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />

      <Stack.Navigator
        initialRouteName="InitPage"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="DynamicForm" component={DynamicForm} />
        <Stack.Screen name="InitPage" component={InitPage} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="ItemDetails" component={ItemDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
