import { StatusBar } from "expo-status-bar";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


import bgImage from "../assets/bg1.jpg";
import ExploreButtons from "../components/bottom-explore-buttons";


const Item = ({ title, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir ${title}`}
      style={({ pressed }) => [
        styles.itemContainer,
        pressed && styles.itemPressed,
      ]}
    >
      <Text style={styles.itemText}>{title}</Text>
    </Pressable>
  );
};

const Restaurant = ({ navigation, route }) => {
  
  const { width, height } = useWindowDimensions();
  const {tableToken,clientName,restaurantPack} = route.params ?? {};
  const navigationParams = {
    tableToken,
    clientName,
  };

  const openMenu = (menuPack) => {
    navigation.navigate("Menu", {
      ...navigationParams,
      menuPack,
    });
  };

  const headerHeight = Math.min(Math.max(height * 0.3, 180), 300);
  const isTablet = width >= 768;


  





  return (
    <View style={styles.screen}>
      <StatusBar style="light" />

      <ImageBackground
        source={restaurantPack.profile_pic_url ? { uri: restaurantPack.profile_pic_url } : bgImage}
        resizeMode="cover"
        style={[styles.imageBackground, { height: headerHeight }]}
      >
        <View style={styles.imageOverlay} />

        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar para a tela anterior"
          hitSlop={10}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed,
          ]}
        >
          <Text style={styles.backButtonIcon}>‹</Text>
        </Pressable>
      </ImageBackground>

      <View
        style={[
          styles.contentContainer,
          {
            marginTop: -30,
            paddingHorizontal: isTablet ? 32 : 16,
          },
        ]}
      >
        <Text style={[styles.textTitle, { fontSize: isTablet ? 32 : 26 }]}>
          {restaurantPack.name}
          {/* Vida Louca &amp; Vibes */}
        </Text>

        <Text style={[styles.description, { fontSize: isTablet ? 19 : 16 }]}>
          {restaurantPack.description}

        </Text>

        <Text style={[styles.textSubTitle, { fontSize: isTablet ? 26 : 22 }]}>
          Menu
        </Text>

        <FlatList
          data={restaurantPack.menus}
          renderItem={({ item }) => (
            <Item
              title={item.name}
              onPress={() => openMenu(item)}
            />
            
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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

export default Restaurant;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  imageBackground: {
    width: "100%",
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
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
    lineHeight: 24,
    marginBottom: 20,
  },

  textSubTitle: {
    fontWeight: "bold",
    color: "#202020",
    marginBottom: 10,
  },

  listContent: {
    paddingBottom: 30,
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

  itemPressed: {
    opacity: 0.65,
  },

  itemText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#303030",
  },
});
