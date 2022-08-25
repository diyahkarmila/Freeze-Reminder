import { useNavigation } from "@react-navigation/native";
import { Box, Button, Text, ZStack, Image } from "native-base";
import AssetsLoader from "../assets/AssetsLoader";
function OnBoard2() {
    const navigation = useNavigation();
    return (
        <Box safeArea={true}>
            {/* Banner Gambar */}
            <ZStack>
                <Box
                    bg={"warning.400"}
                    width="full"
                    height={470}
                    alignItems="center"
                >
                    <Image
                        alignContent={"center"}
                        marginTop={100}
                        marginX="3"
                        source={AssetsLoader["OnBoarding2"]}
                        alt="onboarding2"
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
                marginTop={520}
                marginBottom={76}
            >
                <Text fontSize={"md"} textAlign="center">
                    Membantu anda dalam mengklasifikasikan makanan sesuai dengan
                    tempat penyimpanan
                </Text>
            </Box>

            {/* Button Next */}
            <Box>
                <Button
                    onPress={() => navigation.navigate("OnBoard3")}
                    backgroundColor="warning.400"
                    width={"330"}
                    height={"50"}
                    alignItems={"center"}
                    marginLeft={7}
                    rounded={"md"}
                    shadow="3"
                    marginBottom={4}
                    marginTop={-8}
                >
                    Selanjutnya
                </Button>
                <Button
                    onPress={() => navigation.goBack("OnBoard1")}
                    backgroundColor={"warning.400"}
                    width={"330"}
                    height={"50"}
                    alignItems={"center"}
                    marginLeft={7}
                    rounded={"md"}
                    shadow="3"
                >
                    Kembali
                </Button>
            </Box>
        </Box>
    );
}
export default OnBoard2;
