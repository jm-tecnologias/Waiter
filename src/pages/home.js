import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ExploreButtons from "../components/bottom-explore-buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HelpButtons from "../components/help-buttons";

const Home = ({ navigation, route }) => {
  const API_URL = "http://127.0.0.1:8000";
  const { restaurantId, restaurantName, tableName, tableToken } =
    route.params ?? {};

  const [clientName, setClientName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleClientNameChange = (value) => {
    setClientName(value);

    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const navigationParams = {
    restaurantId,
    restaurantName,
    tableName,
    tableToken,
    clientName: clientName.trim(),
  };

  const openRestaurant = async () => {
    Keyboard.dismiss();

    const normalizedClientName = clientName.trim();

    if (!normalizedClientName) {
      setErrorMessage("Introduza o nome do cliente.");
      return;
    }

    if (normalizedClientName.length < 2) {
      setErrorMessage("O nome do cliente deve ter pelo menos 2 caracteres.");
      return;
    }

    if (!tableToken) {
      setErrorMessage("Não foi possível identificar o token da mesa.");
      return;
    }

    setErrorMessage("");


    
    const response = await fetch(
      `${API_URL}/public/restaurant-data/${restaurantId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(`Error: HTTP ${response.status}`);
    }
    const restaurantPack = await response.json();

    navigation.navigate("Restaurant", {
      tableToken,
      clientName:normalizedClientName,
      restaurantPack,
    });
  };


  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        <View style={styles.tableInformation}>
          <Text style={styles.welcomeText}>Bem-vindo</Text>

          <Text style={styles.tableText}>
            {tableName ?? "Mesa não identificada"}
          </Text>

          <Text style={styles.description}>
            O restaurante e a mesa foram identificados com sucesso. Introduza o
            seu nome para consultar o menu e efetuar o pedido.
          </Text>
        </View>

        <View style={styles.restaurantCard}>
          <View style={styles.restaurantInformation}>
            <Text style={styles.restaurantLabel}>
              {restaurantName ? "Restaurante" : "Restaurante não identificado"}
            </Text>

            <Text style={styles.restaurantName}>
              {restaurantName ?? "Restaurante não identificado"}
            </Text>

            <Text style={styles.restaurantDetails}>
              Mesa: {tableName ?? "Não disponível"}
            </Text>

            {__DEV__ && (
              <Text style={styles.restaurantDetails} numberOfLines={1}>
                Token: {tableToken ?? "Não disponível"}
              </Text>
            )}

            <Text style={styles.inputLabel}>Nome do cliente</Text>

            <TextInput
              value={clientName}
              onChangeText={handleClientNameChange}
              placeholder="Introduza o seu nome"
              placeholderTextColor="#999999"
              style={[
                styles.clientNameInput,
                errorMessage ? styles.clientNameInputError : null,
              ]}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="done"
              maxLength={80}
              // onSubmitEditing={openRestaurant}
              accessibilityLabel="Nome do cliente"
            />

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>

          <Pressable
            onPress={openRestaurant}
            accessibilityRole="button"
            accessibilityLabel="Abrir restaurante"
            style={({ pressed }) => [
              styles.openButton,
              pressed && styles.openButtonPressed,
            ]}
          >
            <Text style={styles.openButtonText}>Abrir</Text>
          </Pressable>
        </View>
        
        <HelpButtons
        // activePage="Orders"
      />
      </View>

      <ExploreButtons
        navigation={navigation}
        activePage="Home"
        navigationParams={navigationParams}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 50,
  },

  tableInformation: {
    backgroundColor: "#fff7eb",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffd9a3",
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e67e00",
    marginBottom: 4,
  },

  tableText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#606060",
  },

  restaurantCard: {
    minHeight: 220,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dddddd",
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  restaurantInformation: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  restaurantLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e67e00",
    marginBottom: 5,
    textTransform: "uppercase",
  },

  restaurantName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 8,
  },

  restaurantDetails: {
    fontSize: 14,
    lineHeight: 21,
    color: "#606060",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#404040",
    marginTop: 14,
    marginBottom: 6,
  },

  clientNameInput: {
    width: "100%",
    minHeight: 48,
    backgroundColor: "#f7f7f7",
    borderWidth: 1,
    borderColor: "#d5d5d5",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#202020",
  },

  clientNameInputError: {
    borderColor: "#d93025",
    backgroundColor: "#fff8f7",
  },

  errorText: {
    color: "#d93025",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },

  openButton: {
    width: 78,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f28c00",
  },

  openButtonPressed: {
    opacity: 0.75,
  },

  openButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
