import { useNavigation, StackActions } from "@react-navigation/native";
import { Box, Button, Text, Image, ZStack } from "native-base";
import * as SecureStore from 'expo-secure-store'
import AssetsLoader from "../assets/AssetsLoader";

function OnBoard3() {
    const navigation = useNavigation();
    const handleSelesai = async () => {
        await SecureStore.setItemAsync('isOpenedBefore', "true")
        navigation.reset({
            index: 0,
            routes: [{ name: 'onBoard' }]
        })
    }
    return (
        <Box safeArea>
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
                        source={AssetsLoader["OnBoarding3"]}
                        alt="onboarding3"
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
                    onPress={handleSelesai}
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
                    onPress={() => navigation.goBack()}
                    backgroundColor="warning.400"
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
export default OnBoard3;
