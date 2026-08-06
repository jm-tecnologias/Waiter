import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";


const InitPage = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [permission, requestPermission] = useCameraPermissions();

  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState(
    "Posicione o QR Code da mesa dentro da moldura.",
  );

  const scannerSize = Math.min(width * 0.72, 320);

  const TABLE_TOKEN ="qQ0SnGSPoKZDhlYIWH2H0VmiJ73CdGBP";

const API_URL = "http://127.0.0.1:8000";


const processQRCode = async (qrData) => {
  try {
    setIsProcessing(true);
    setMessage("A identificar o restaurante e a mesa...");

    const qrContent =
      typeof qrData === "string"
        ? JSON.parse(qrData)
        : qrData;

    if (
      !qrContent?.restaurant_id ||
      !qrContent?.table_name ||
      !qrContent?.table_token
    ) {
      throw new Error("Dados da mesa inválidos ou incompletos.");
    }

    navigation.replace("Home", {
      restaurantId: qrContent.restaurant_id,
      restaurantName: qrContent.restaurant_name ?? "Restaurante",
      tableName: qrContent.table_name,
      tableToken: qrContent.table_token,
    });
  } catch (error) {
    console.error("Erro ao processar QR Code:", error);

    setMessage(
      "Este QR Code não pertence a uma mesa válida. Tente novamente.",
    );

    setScanned(false);
    setIsProcessing(false);
  }
};

const handleBarcodeScanned = ({ data }) => {
  if (scanned || isProcessing) {
    return;
  }

  setScanned(true);
  processQRCode(data);
};

const handleSimulateScan = async () => {
  if (scanned || isProcessing) {
    return;
  }

  try {
    setScanned(true);
    setIsProcessing(true);
    setMessage("A consultar os dados da mesa...");

    const response = await fetch(
      `${API_URL}/public/tables/${TABLE_TOKEN}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `Falha ao consultar a mesa: HTTP ${response.status}`,
      );
    }


    const tableData = await response.json();

    await processQRCode(tableData);
  } catch (error) {
    console.error("Erro ao simular leitura:", error);

    setMessage(
      "Não foi possível consultar a mesa. Verifique a ligação com a API.",
    );

    setScanned(false);
    setIsProcessing(false);
  }
};
  const SimulationButton = () =>
    __DEV__ ? (
      <Pressable
        onPress={handleSimulateScan}
        accessibilityRole="button"
        accessibilityLabel="Simular leitura do QR Code"
        style={({ pressed }) => [
          styles.testButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.testButtonText}>Simular QR Code</Text>
      </Pressable>
    ) : null;

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#f28c00" />
        <Text style={styles.loadingText}>
          A verificar permissão da câmara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <StatusBar style="dark" />

        <View style={styles.permissionIcon}>
          <Text style={styles.permissionIconText}>▣</Text>
        </View>

        <Text style={styles.permissionTitle}>Permissão da câmara</Text>

        <Text style={styles.permissionDescription}>
          Para identificar o restaurante e a mesa, permita que a aplicação
          utilize a câmara do dispositivo.
        </Text>

        <Pressable
          onPress={requestPermission}
          accessibilityRole="button"
          accessibilityLabel="Permitir acesso à câmara"
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>Permitir câmara</Text>
        </Pressable>

        <SimulationButton />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.appName}>JM Restaurant</Text>
        <Text style={styles.title}>Digitalize o QR Code</Text>

        <Text style={styles.subtitle}>
          Faça o scan do código disponível na sua mesa para consultar o
          restaurante, os menus e efetuar pedidos.
        </Text>
      </View>

      <View style={styles.cameraSection}>
        <View
          style={[
            styles.scannerContainer,
            {
              width: scannerSize,
              height: scannerSize,
            },
          ]}
        >
          <CameraView
            style={StyleSheet.absoluteFillObject}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          <View pointerEvents="none" style={styles.cameraOverlay} />
          <View pointerEvents="none" style={styles.cornerTopLeft} />
          <View pointerEvents="none" style={styles.cornerTopRight} />
          <View pointerEvents="none" style={styles.cornerBottomLeft} />
          <View pointerEvents="none" style={styles.cornerBottomRight} />

          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.processingText}>A processar...</Text>
            </View>
          )}
        </View>

        <Text style={styles.instructionText}>{message}</Text>

        <SimulationButton />

        {scanned && !isProcessing && (
          <Pressable
            onPress={handleScanAgain}
            accessibilityRole="button"
            accessibilityLabel="Digitalizar novamente"
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              Digitalizar novamente
            </Text>
          </Pressable>
        )}

        {Platform.OS === "web" && (
          <Text style={styles.webHint}>
            No navegador, permita o acesso à câmara ou use o botão de simulação.
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Como funciona?</Text>
        <Text style={styles.footerText}>
          1. Localize o QR Code colocado na mesa.
        </Text>
        <Text style={styles.footerText}>2. Aponte a câmara para o código.</Text>
        <Text style={styles.footerText}>
          3. Aguarde a abertura automática do menu.
        </Text>
      </View>
    </View>
  );
};

export default InitPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#606060",
    textAlign: "center",
  },

  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 28,
  },

  permissionIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff3df",
    marginBottom: 24,
  },

  permissionIconText: {
    fontSize: 42,
    color: "#f28c00",
  },

  permissionTitle: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#202020",
    textAlign: "center",
    marginBottom: 12,
  },

  permissionDescription: {
    maxWidth: 420,
    fontSize: 16,
    lineHeight: 24,
    color: "#606060",
    textAlign: "center",
    marginBottom: 28,
  },

  primaryButton: {
    minWidth: 220,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f28c00",
    borderRadius: 14,
    paddingHorizontal: 24,
  },

  primaryButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  buttonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  header: {
    backgroundColor: "#f28c00",
    paddingTop: 52,
    paddingBottom: 34,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  appName: {
    fontSize: 15,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.85)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 14,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },

  subtitle: {
    maxWidth: 600,
    fontSize: 16,
    lineHeight: 23,
    color: "#ffffff",
  },

  cameraSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  scannerContainer: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#111111",
    borderRadius: 24,
    borderWidth: 4,
    borderColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },

  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  cornerTopLeft: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 42,
    height: 42,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#f28c00",
    borderTopLeftRadius: 8,
  },

  cornerTopRight: {
    position: "absolute",
    top: 18,
    right: 18,
    width: 42,
    height: 42,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: "#f28c00",
    borderTopRightRadius: 8,
  },

  cornerBottomLeft: {
    position: "absolute",
    bottom: 18,
    left: 18,
    width: 42,
    height: 42,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: "#f28c00",
    borderBottomLeftRadius: 8,
  },

  cornerBottomRight: {
    position: "absolute",
    right: 18,
    bottom: 18,
    width: 42,
    height: 42,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: "#f28c00",
    borderBottomRightRadius: 8,
  },

  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.65)",
  },

  processingText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
  },

  instructionText: {
    maxWidth: 400,
    minHeight: 48,
    marginTop: 18,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "500",
    color: "#505050",
    textAlign: "center",
  },

  secondaryButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#f28c00",
    paddingHorizontal: 24,
    marginTop: 10,
  },

  secondaryButtonText: {
    color: "#f28c00",
    fontSize: 16,
    fontWeight: "bold",
  },

  footer: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 30,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 10,
  },

  footerText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#606060",
  },

  testButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202020",
    borderRadius: 12,
    paddingHorizontal: 24,
    marginTop: 12,
  },

  testButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  webHint: {
    maxWidth: 420,
    marginTop: 12,
    color: "#777777",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
