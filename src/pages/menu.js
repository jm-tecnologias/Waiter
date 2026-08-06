import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import bgImage from "../assets/bg1.jpg";
import ExploreButtons from "../components/bottom-explore-buttons";


const MenuItem = ({ item, isTablet, onPress }) => {
  // const handleAddItem = () => {
  //   console.log("Prato adicionado:", item.name);
  // };

  return (
    <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Abrir ${item}`}
        hitSlop={4}
        // style={({ pressed }) => [
        //   styles.addButton,
        //   isTablet && styles.addButtonTablet,
        //   pressed && styles.addButtonPressed,
        // ]}
        style={({ pressed }) => [
                // styles.itemContainer,
                // pressed && styles.itemPressed,
              ]}
      >
    <View
      style={[
        styles.itemContainer,
        isTablet && styles.itemContainerTablet,
      ]}
    >
      <Image
        source={{ uri: item.profile_pic_url }}
        style={[styles.itemImage, isTablet && styles.itemImageTablet]}
        resizeMode="cover"
      />

      <View style={styles.itemInformation}>
        <Text
          style={[styles.itemName, isTablet && styles.itemNameTablet]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.itemDescription,
            isTablet && styles.itemDescriptionTablet,
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <Text
          style={[styles.itemPrice, isTablet && styles.itemPriceTablet]}
        >
          {item.price.toFixed(2)} MZN
        </Text>
      </View>
        <Text
          style={[
            styles.addButtonText,
            isTablet && styles.addButtonTextTablet,
          ]}
        > 
          +
        </Text>
    </View>
    </Pressable>
  );
};

const Menu = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 768;
  const headerHeight = Math.min(
    Math.max(height * 0.3, 180),
    isTablet ? 360 : 300
  );
  const horizontalPadding = isTablet ? 32 : 16;


  const {menuPack,} = route.params ?? {};

  const navigationParams = {

  };

  const openItem = (itemPack) => {
    navigation.navigate("ItemDetails", {
      ...navigationParams,
      itemPack
    })
  }


  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Restaurant", navigationParams);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ImageBackground
        source={menuPack.profile_pic_url ? { uri: menuPack.profile_pic_url } : bgImage}
        resizeMode="cover"
        style={[styles.imageBackground, { height: headerHeight }]}
      >
        <View style={styles.imageOverlay} />

        <Pressable
          onPress={handleGoBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela anterior"
          hitSlop={12}
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
        <Text
          style={[
            styles.textTitle,
            {
              fontSize: isTablet ? 32 : 26,
            },
          ]}
        >
          {menuPack.name}
        </Text>

        <Text
          style={[
            styles.description,
            {
              fontSize: isTablet ? 19 : 16,
              lineHeight: isTablet ? 28 : 24,
            },
          ]}
        >
          {menuPack.description}
          {/* Escolha um dos pratos disponíveis e pressione o botão de adicionar
          para incluí-lo no seu pedido. */}
        </Text>

        <FlatList
          data={menuPack.items}
          renderItem={({ item }) => (
            <MenuItem item={item}
              isTablet={isTablet} 
              onPress={() => openItem(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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

export default Menu;

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

  textTitle: {
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 10,
  },

  description: {
    textAlign: "justify",
    fontWeight: "500",
    color: "#505050",
    marginBottom: 20,
  },

  listContent: {
    paddingBottom: 30,
  },

  itemContainer: {
    width: "100%",
    minHeight: 110,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dddddd",
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  itemContainerTablet: {
    minHeight: 135,
    borderRadius: 16,
    marginBottom: 16,
  },

  itemImage: {
    width: "27%",
    minWidth: 90,
    maxWidth: 130,
    backgroundColor: "#eeeeee",
  },

  itemImageTablet: {
    minWidth: 140,
    maxWidth: 180,
  },

  itemInformation: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 4,
  },

  itemNameTablet: {
    fontSize: 22,
    marginBottom: 6,
  },

  itemDescription: {
    fontSize: 14,
    color: "#606060",
    lineHeight: 19,
    marginBottom: 8,
  },

  itemDescriptionTablet: {
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 10,
  },

  itemPrice: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#e67e00",
  },

  itemPriceTablet: {
    fontSize: 20,
  },

  addButton: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f28c00",
    paddingHorizontal: 8,
  },

  addButtonTablet: {
    width: 70,
  },

  addButtonPressed: {
    backgroundColor: "#cc7600",
    opacity: 0.85,
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 34,
  },

  addButtonTextTablet: {
    fontSize: 38,
    lineHeight: 42,
  },
});
