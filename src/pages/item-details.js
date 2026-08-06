import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  ImageBackground,
  useWindowDimensions,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";

import imageBg from "../assets/bg1.jpg";
import ExploreButtons from "../components/bottom-explore-buttons";

/**
 * Representa cada ingrediente do prato.
 */
const Item = ({ title }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{title}</Text>
    </View>
  );
};

/**
 * Página que apresenta os detalhes de um prato.
 */
const ItemDetails = ({ navigation, route }) => {
  /*
   * Obtém o prato enviado pela página anterior.
   *
   * Exemplo:
   * navigation.navigate("ItemDetails", {
   *   itemPack: item,
   * });
   */
  const { itemPack } = route.params ?? {};

  /*
   * Estado que guarda a observação escrita pelo cliente.
   */
  const [observation, setObservation] = useState("");

  /*
   * Estado que controla a quantidade do prato.
   */
  const [quantity, setQuantity] = useState(1);

  /*
   * Valores que devem continuar a ser enviados
   * durante a navegação entre páginas.
   */
  const navigationParams = {
    ...(route.params ?? {}),
  };

  /*
   * Obtém a largura e a altura atual da janela.
   */
  const { width, height } = useWindowDimensions();

  /*
   * Considera tablet quando a largura é igual
   * ou superior a 768 pixels.
   */
  const isTablet = width >= 768;

  /*
   * Calcula uma altura responsiva para a imagem.
   */
  const headerHeight = Math.min(
    Math.max(height * 0.3, 180),
    isTablet ? 360 : 300,
  );

  /*
   * Define espaçamento lateral conforme o dispositivo.
   */
  const horizontalPadding = isTablet ? 32 : 16;

  /*
   * Retorna à página anterior.
   *
   * Caso não exista uma página anterior,
   * navega diretamente para Menu.
   */
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Menu", navigationParams);
  };

  /*
   * Diminui a quantidade.
   *
   * Math.max impede que a quantidade fique abaixo de 1.
   */
  const decreaseQuantity = () => {
    setQuantity((currentQuantity) =>
      Math.max(1, currentQuantity - 1),
    );
  };

  /*
   * Aumenta a quantidade em uma unidade.
   */
  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  /*
   * Cria o objeto que representa o prato
   * que será adicionado ao pedido.
   */
  const handleAddItem = () => {
    const orderItem = {
      item: itemPack,
      itemId: itemPack.id,
      itemName: itemPack.name,
      unitPrice: Number(itemPack.price),
      quantity,
      observation: observation.trim(),
      total: Number(itemPack.price) * quantity,
    };

    console.log("Prato adicionado ao pedido:", orderItem);

    /*
     * Aqui pode guardar o prato no AsyncStorage,
     * num Context, Redux ou enviar para a API.
     *
     * Exemplo de navegação:
     *
     * navigation.navigate("Order", {
     *   ...navigationParams,
     *   orderItem,
     * });
     */
  };

  /*
   * Evita erros caso a página seja aberta
   * sem receber itemPack.
   */
  if (!itemPack) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar style="dark" />

        <Text style={styles.errorTitle}>
          Prato não encontrado
        </Text>

        <Text style={styles.errorDescription}>
          Não foi possível carregar os dados do prato.
        </Text>

        <Pressable
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={({ pressed }) => [
            styles.errorButton,
            pressed && styles.errorButtonPressed,
          ]}
        >
          <Text style={styles.errorButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  /*
   * Converte o preço para número.
   *
   * Caso o preço não seja válido, usa zero.
   */
  const itemPrice = Number(itemPack.price) || 0;

  /*
   * Calcula o preço total conforme a quantidade.
   */
  const totalPrice = itemPrice * quantity;

  /*
   * Garante que ingredients seja sempre um array.
   */
  const ingredients = Array.isArray(itemPack.ingredients)
    ? itemPack.ingredients
    : [];

//       const ingre = [
//     {
//       id: 1,
//       name: "Tomate",
//       description: "Tamate verde miudo ",
//     },
//     {
//       id: 2,
//       name: "Cebola",
//       description: "Cebola fresca",
//     },
//     {
//       id: 3,
//       name: "paprica",
//       description: "Sem notas",
//     },
//     {
//       id: 1,
//       name: "Tomate",
//       description: "Tamate verde miudo ",
//     },
//     {
//       id: 2,
//       name: "Cebola",
//       description: "Cebola fresca",
//     },
//     {
//       id: 3,
//       name: "paprica",
//       description: "Sem notas",
//     },
//     {
//       id: 1,
//       name: "Tomate",
//       description: "Tamate verde miudo ",
//     },
//     {
//       id: 2,
//       name: "Cebola",
//       description: "Cebola fresca",
//     },
//     {
//       id: 3,
//       name: "paprica",
//       description: "Sem notas",
//     },
//   ];

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ImageBackground
        source={
          itemPack.profile_pic_url
            ? { uri: itemPack.profile_pic_url }
            : imageBg
        }
        resizeMode="cover"
        style={[
          styles.imageBackground,
          {
            height: headerHeight,
          },
        ]}
      >
        <View style={styles.imageOverlay} />

        <Pressable
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar à tela anterior"
          hitSlop={15}
          style={({ pressed }) => [
            styles.backButton,
            isTablet && styles.backButtonTablet,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text
            style={[
              styles.backButtonIcon,
              isTablet && styles.backButtonIconTablet,
            ]}
          >
            ‹
          </Text>
        </Pressable>
      </ImageBackground>

      <View
        style={[
          styles.contentContainer,
          {
            marginTop: -30,
            paddingHorizontal: horizontalPadding,
          },
        ]}
      >
        <FlatList
          data={ingredients}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? index.toString()
          }
          renderItem={({ item }) => (
            <Item
              title={
                item.description
                  ? `${item.name}: ${item.description}`
                  : item.name
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.pageContent}
          ListHeaderComponent={
            <View>
              <Text
                style={[
                  styles.textTitle,
                  {
                    fontSize: isTablet ? 32 : 26,
                  },
                ]}
              >
                {itemPack.name}
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    fontSize: isTablet ? 19 : 16,
                  },
                ]}
              >
                {itemPack.description ||
                  "Este prato não possui descrição."}
              </Text>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>
                  Preço unitário
                </Text>

                <Text
                  style={[
                    styles.priceValue,
                    {
                      fontSize: isTablet ? 24 : 20,
                    },
                  ]}
                >
                  {itemPrice.toFixed(2)} MZN
                </Text>
              </View>

              <Text
                style={[
                  styles.textSubTitle,
                  {
                    fontSize: isTablet ? 26 : 22,
                  },
                ]}
              >
                Ingredientes
              </Text>

              {ingredients.length === 0 && (
                <Text style={styles.emptyIngredientsText}>
                  Nenhum ingrediente informado.
                </Text>
              )}
            </View>
          }
          ListFooterComponent={
            <View style={styles.orderSection}>
              <Text
                style={[
                  styles.observationLabel,
                  {
                    fontSize: isTablet ? 20 : 16,
                  },
                ]}
              >
                Observação ao pedir o prato
              </Text>

              <TextInput
                value={observation}
                onChangeText={setObservation}
                placeholder="Ex.: sem cebola, pouco sal ou molho separado..."
                placeholderTextColor="#909090"
                multiline
                numberOfLines={4}
                maxLength={250}
                textAlignVertical="top"
                returnKeyType="default"
                accessibilityLabel="Observação do pedido"
                style={[
                  styles.observationInput,
                  {
                    fontSize: isTablet ? 18 : 16,
                    minHeight: isTablet ? 130 : 100,
                  },
                ]}
              />

              <Text style={styles.characterCounter}>
                {observation.length}/250
              </Text>

              <View
                style={[
                  styles.orderActions,
                  isTablet && styles.orderActionsTablet,
                ]}
              >
                <View style={styles.quantityContainer}>
                  <Pressable
                    onPress={decreaseQuantity}
                    disabled={quantity === 1}
                    accessibilityRole="button"
                    accessibilityLabel="Diminuir quantidade"
                    style={({ pressed }) => [
                      styles.quantityButton,
                      quantity === 1 &&
                        styles.quantityButtonDisabled,
                      pressed &&
                        quantity > 1 &&
                        styles.quantityButtonPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.quantityButtonText,
                        quantity === 1 &&
                          styles.quantityButtonTextDisabled,
                      ]}
                    >
                      −
                    </Text>
                  </Pressable>

                  <View style={styles.quantityValueContainer}>
                    <Text style={styles.quantityValue}>
                      {quantity}
                    </Text>
                  </View>

                  <Pressable
                    onPress={increaseQuantity}
                    accessibilityRole="button"
                    accessibilityLabel="Aumentar quantidade"
                    style={({ pressed }) => [
                      styles.quantityButton,
                      pressed && styles.quantityButtonPressed,
                    ]}
                  >
                    <Text style={styles.quantityButtonText}>
                      +
                    </Text>
                  </Pressable>
                </View>

                <Pressable
                  onPress={handleAddItem}
                  accessibilityRole="button"
                  accessibilityLabel={`Adicionar ${quantity} unidades de ${itemPack.name} ao pedido`}
                  style={({ pressed }) => [
                    styles.addButton,
                    isTablet && styles.addButtonTablet,
                    pressed && styles.addButtonPressed,
                  ]}
                >
                  <Text style={styles.addButtonText}>
                    + Adicionar
                  </Text>

                  <Text style={styles.addButtonPrice}>
                    {totalPrice.toFixed(2)} MZN
                  </Text>
                </Pressable>
              </View>
            </View>
          }
        />
      </View>

      <ExploreButtons
        navigation={navigation}
        activePage="Explore"
        navigationParams={navigationParams}
      />
    </View>
  );
};

export default ItemDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  imageBackground: {
    width: "100%",
    justifyContent: "flex-start",
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.28)",
  },

  backButton: {
    position: "absolute",
    top: 30,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,

    elevation: 6,
  },

  backButtonTablet: {
    top: 50,
    left: 28,
    width: 54,
    height: 54,
    borderRadius: 27,
  },

  backButtonPressed: {
    opacity: 0.75,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  backButtonIcon: {
    color: "#202020",
    fontSize: 34,
    lineHeight: 36,
    marginTop: -4,
  },

  backButtonIconTablet: {
    fontSize: 46,
    lineHeight: 48,
  },

  contentContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    overflow: "hidden",
  },

  pageContent: {
    paddingBottom: 130,
  },

  textTitle: {
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 10,
  },

  description: {
    color: "#505050",
    fontWeight: "500",
    lineHeight: 24,
    textAlign: "justify",
    marginBottom: 20,
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },

  priceLabel: {
    color: "#606060",
    fontSize: 15,
    fontWeight: "600",
  },

  priceValue: {
    color: "#202020",
    fontWeight: "bold",
  },

  textSubTitle: {
    color: "#202020",
    fontWeight: "bold",
    marginBottom: 10,
  },

  emptyIngredientsText: {
    color: "#777777",
    fontSize: 15,
    fontStyle: "italic",
    marginBottom: 18,
  },

  itemContainer: {
    minHeight: 56,
    justifyContent: "center",
    backgroundColor: "#eeeeee",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },

  itemText: {
    color: "#303030",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },

  orderSection: {
    marginTop: 20,
    marginBottom: 20,
  },

  observationLabel: {
    color: "#202020",
    fontWeight: "700",
    marginBottom: 10,
  },

  observationInput: {
    width: "100%",
    color: "#202020",
    lineHeight: 22,
    backgroundColor: "#f4f4f4",
    borderWidth: 1,
    borderColor: "#dddddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  characterCounter: {
    alignSelf: "flex-end",
    color: "#808080",
    fontSize: 12,
    marginTop: 6,
    marginBottom: 18,
  },

  orderActions: {
    width: "100%",
    gap: 14,
  },

  orderActionsTablet: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    height: 54,
    backgroundColor: "#f1f1f1",
    borderRadius: 14,
    overflow: "hidden",
  },

  quantityButton: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
  },

  quantityButtonPressed: {
    opacity: 0.7,
    transform: [
      {
        scale: 0.95,
      },
    ],
  },

  quantityButtonDisabled: {
    backgroundColor: "#f5f5f5",
  },

  quantityButtonText: {
    color: "#202020",
    fontSize: 26,
    fontWeight: "700",
  },

  quantityButtonTextDisabled: {
    color: "#bdbdbd",
  },

  quantityValueContainer: {
    minWidth: 58,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },

  quantityValue: {
    color: "#202020",
    fontSize: 19,
    fontWeight: "700",
  },

  addButton: {
    flex: 1,
    minHeight: 58,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202020",
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 10,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,

    elevation: 5,
  },

  addButtonTablet: {
    maxWidth: 320,
  },

  addButtonPressed: {
    opacity: 0.82,
    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },

  addButtonPrice: {
    color: "#dddddd",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },

  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },

  errorTitle: {
    color: "#202020",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  errorDescription: {
    color: "#606060",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },

  errorButton: {
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202020",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  errorButtonPressed: {
    opacity: 0.8,
  },

  errorButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});