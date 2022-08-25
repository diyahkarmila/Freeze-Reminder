import { useNavigation, StackActions } from "@react-navigation/native";
import {
    Box,
    Button,
    Text,
    ZStack,
    Avatar,
    Input,
    View,
    Select,
    CheckIcon,
    FormControl,
    WarningOutlineIcon,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AssetsLoader from "../assets/AssetsLoader";

function DataDiri() {
    const navigation = useNavigation();
    return (
        <Box safeArea>
            {/* Banner Foto */}
            <ZStack>
                <Box
                    bg={"warning.400"}
                    width="full"
                    height={470}
                    alignItems="center"
                >
                    <Avatar
                        alignContent={"center"}
                        marginTop={100}
                        marginX="3"
                        source={AssetsLoader["DefaultProfile"]}
                        alt="defaultprofile"
                        width={240}
                        height={240}
                        resizeMode={"contain"}
                        shadow={"3"}
                    />
                </Box>
            </ZStack>

            {/* Input Data */}
            <View alignContent={"center"} marginTop={490}>
                <Box alignContent={"center"} marginLeft={7}>
                    <FormControl.Label>Nama</FormControl.Label>
                    <Input
                        placeholder="Nama"
                        width={330}
                        height={50}
                        maxWidth="full"
                        marginBottom={4}
                    ></Input>
                </Box>

                <Box
                    width={330}
                    maxW="full"
                    alignContent={"center"}
                    marginLeft={7}
                >
                    <FormControl isRequired isInvalid>
                        <FormControl.Label>Jenis Kelamin</FormControl.Label>
                        <Select
                            accessibilityLabel="Jenis Kelamin"
                            placeholder="Jenis Kelamin"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size={2} />,
                            }}
                        >
                            <Select.Item label="Laki-Laki" value="Laki-Laki" />
                            <Select.Item label="Perempuan" value="Perempuan" />
                        </Select>
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}
                        >
                            Silahkan isi dengan benar!
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Box>

                {/* Button Mulai */}
                <Box>
                    <Button
                        onPress={() => {
                            navigation.dispatch(StackActions.replace("Main"));
                        }}
                        backgroundColor="warning.400"
                        width={"330"}
                        height={"50"}
                        alignItems={"center"}
                        marginLeft={7}
                        rounded={"md"}
                        shadow="3"
                        marginY={5}
                    >
                        Mulai
                    </Button>
                </Box>
            </View>
        </Box>
    );
}

export default DataDiri;
