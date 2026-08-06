import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ExploreButton = ({
  title,
  icon,
  active = false,
  onPress,
}) => {
  const color = active ? "#f28c00" : "#777777";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        active && styles.activeButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Ionicons name={icon} size={25} color={color} />

      <Text
        style={[
          styles.buttonText,
          active && styles.activeButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const ExploreButtons = ({
  navigation,
  activePage = "Home",
  navigationParams = {},
}) => {
  const openExplore = () => {
    navigation?.navigate("Restaurant", navigationParams);
  };

  const openHome = () => {
    navigation?.navigate("Home", navigationParams);
  };

  const openOrders = () => {
    console.log("A página de pedidos ainda não foi criada.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ExploreButton
          title="Explore"
          icon={activePage === "Explore" ? "compass" : "compass-outline"}
          active={activePage === "Explore"}
          onPress={openExplore}
        />

        <ExploreButton
          title="Home"
          icon={activePage === "Home" ? "home" : "home-outline"}
          active={activePage === "Home"}
          onPress={openHome}
        />

        <ExploreButton
          title="Orders"
          icon={activePage === "Orders" ? "receipt" : "receipt-outline"}
          active={activePage === "Orders"}
          onPress={openOrders}
        />
      </View>
    </SafeAreaView>
  );
};

export default ExploreButtons;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
  },

  container: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },

  button: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    marginHorizontal: 4,
    borderRadius: 12,
    gap: 3,
  },

  activeButton: {
    backgroundColor: "#fff7eb",
  },

  buttonPressed: {
    backgroundColor: "#fff3df",
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },

  buttonText: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },

  activeButtonText: {
    color: "#f28c00",
    fontWeight: "bold",
  },
});
