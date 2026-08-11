import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const HelpButton = ({title,icon,onPress,}) => {

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        styles.activeButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Ionicons name={icon} size={25} />

      <Text
        style={[
          styles.buttonText,
          styles.activeButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const HelpButtons = () => {
  const callWaiter = () => {
    console.log("Chamar Garcom!");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HelpButton
          title="Chamar Garcom"
          icon={ "Explore" ? "call" : "compass-outline"}
          onPress={callWaiter}
        />

        <HelpButton
          title="Solicitar Limpeza"
          icon={ "Home" ? "trash" : "trash-outline"}
        />

        <HelpButton
          title="Pedir Agua"
          icon={"Orders" ? "water" : "water-outline"}
        />
      </View>

      <View style={styles.container}>
        <HelpButton
          title="?"
          icon={ "Explore" ? "information-circle" : "information-circle-outline"}
        />

        <HelpButton 
          title="?"
          icon={ "Home" ? "information-circle" : "information-circle-outline"}
        />

        <HelpButton
          title="Pedir Conta"
          icon={"Orders" ? "receipt" : "receipt-outline"}
        />
      </View>
    </SafeAreaView>
  );
};

export default HelpButtons;

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
    marginTop:7,
    paddingBottom: 7,
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    borderTopColor: "#dddddd",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 0,
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
