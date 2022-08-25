import React from "react";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { Box, HStack, Pressable, Icon, Text } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Selesai from "./Selesai";
import Segar from "./Segar";
import SegeraOlah from "./SegeraOlah";
import LewatMasa from "./LewatMasa";

const renderScene = SceneMap({
    first: Segar,
    second: SegeraOlah,
    third: LewatMasa,
    four: Selesai
});

function ListBahan() {
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "first", title: "Segar" },
        { key: "second", title: "Segera Olah" },
        { key: "third", title: "Lewat Masa" },
        { key: "four", title: "Selesai" }
    ]);
    return (
        <Box safeArea style={{ flex: 1, backgroundColor: "white" }}>
            {/* Icon Back */}
            <HStack
                marginTop={4}
                marginX={"3"}
                paddingY={"2.5"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Pressable onPress={() => navigation.navigate("BerandaScreen")}>
                    <Icon color="black" as={AntDesign} name="back" size="xl" />
                </Pressable>

                <Pressable onPress={() => navigation.navigate("AddBahan")}>
                    <Icon color="black" as={AntDesign} name="plus" size="xl" />
                </Pressable>
            </HStack>
            {/* Tab Screen */}

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                style={{ backgroundColor: "white" }}
                initialLayout={{
                    width: Dimensions.get("window").width,
                }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        renderLabel={({ route, color }) => (
                            <Text style={{ color: "black", margin: 8 }}>
                                {route.title}
                            </Text>
                        )}
                        indicatorStyle={{
                            backgroundColor: "#FFA451",
                        }}
                        style={{ backgroundColor: "white" }}
                    />
                )}
                lazy={true}
            />
        </Box>
    );
}

export default ListBahan;
