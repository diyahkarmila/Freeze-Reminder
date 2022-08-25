import { useNavigation } from "@react-navigation/native";
import { Box, Button, Image, ZStack, Text } from "native-base";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AssetsLoader from "../assets/AssetsLoader";

function OnBoard1() {
    const navigation = useNavigation();
    return (
        <Box safeArea>
            {/* Banner Gambar */}
            <ZStack>
                <Box
                    bg={"warning.400"}
                    width="full"
                    height={470}
                    alignItems="center"
                    flex={"1"}
                >
                    <Image
                        alignContent={"center"}
                        marginTop={100}
                        marginX="3"
                        source={AssetsLoader["OnBoarding1"]}
                        alt="onboarding1"
                        width={375}
                        height={296}
                        resizeMode={"contain"}
                    />
                </Box>
            </ZStack>

            {/* Teks Panduan */}
            <Box
                marginX={"5"}
                alignContent="flex-end"
                marginTop={550}
                marginBottom={76}
            >
                <Text fontSize={"md"} textAlign="center">
                    Membantu anda untuk mempertahankan kesegaran bahan makanan
                </Text>
            </Box>

            {/* Button Next */}
            <Box>
                <Button
                    onPress={() => navigation.navigate("OnBoard2")}
                    backgroundColor={"warning.400"}
                    width={"330"}
                    height={"50"}
                    marginLeft={"7"}
                    alignItems={"center"}
                    rounded={"md"}
                    shadow="3"
                >
                    Selanjutnya
                </Button>
            </Box>
        </Box>
    );
}
export default OnBoard1;
