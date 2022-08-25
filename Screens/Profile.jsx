import {
    Box,
    View,
    ZStack,
    Avatar,
    Fab,
    Icon,
    FormControl,
    Input,
    Select,
    CheckIcon,
    WarningOutlineIcon,
    Button,
    ScrollView,
    AlertDialog,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import AssetsLoader from "../assets/AssetsLoader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { setAuth } from "../redux/actions";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

function Profile() {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const dispatch = useDispatch();
    const [namaDepan, setNamaDepan] = useState("");
    const [namaBelakang, setNamaBelakang] = useState("");
    const [jenisKelamin, setJenisKelamin] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        title: "Error",
        body: "Error Body",
    });
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);

    useEffect(() => {
        const getProfile = async () => {
            await axios({
                url: "https://diyahfreezer.herokuapp.com/users",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((res) => {
                setNamaDepan(res.data.firstName);
                setNamaBelakang(res.data.lastName);
                setJenisKelamin(res.data.jenisKelamin);
            });
        };
        getProfile();
    }, []);

    const handleSubmit = async () => {
        await axios({
            method: "PATCH",
            url: `https://diyahfreezer.herokuapp.com/users`,
            data: {
                jenisKelamin,
                firstName: namaDepan,
                lastName: namaBelakang,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                if (res?.data?.firstName) {
                    setIsOpen(true);
                    setErrorMessage({
                        title: "Berhasil",
                        body: "Profile akun Anda sudah berhasil diubah!",
                    });
                }
            })
            .catch((err) => {
                const error = err.toJSON();

                if (error.status === 400) {
                    setIsOpen(true);
                    setErrorMessage({
                        title: "Error",
                        body: "Masukkan seluruh entri data untuk memasuki aplikasi",
                    });
                }
            });
    };

    const handleLogout = async () => {
        dispatch(setAuth(""));
        await SecureStore.deleteItemAsync("access_token");
        navigation.navigate("onBoard", {
            screen: "Login",
        });
        navigation.reset({
            index: 0,
            routes: [{ name: "onBoard" }],
        });
    };

    return (
        <Box safeArea={true}>
            <ScrollView>
                {/* Avatar */}
                <Box
                    bg={"coolGray.300"}
                    width="full"
                    height={220}
                    alignItems="center"
                >
                    <Avatar
                        alignContent={"center"}
                        marginTop={140}
                        marginX="3"
                        source={AssetsLoader["DefaultProfile"]}
                        alt="defaultprofile"
                        width={169}
                        height={169}
                        resizeMode={"contain"}
                        shadow={"3"}
                    />
                    <Box>
                        <Fab
                            renderInPortal={false}
                            shadow={2}
                            size="sm"
                            backgroundColor={"warning.500"}
                            marginX={-30}
                            marginRight={10}
                            marginLeft={10}
                            icon={
                                <Icon
                                    color="white"
                                    as={AntDesign}
                                    name="camera"
                                    size="sm"
                                />
                            }
                        />
                    </Box>
                </Box>

                {/* Input */}
                <View alignContent={"center"} marginTop={100}>
                    <Box alignContent={"center"} marginLeft={6}>
                        <FormControl.Label>Nama Depan</FormControl.Label>
                        <Input
                            placeholder="Nama Depan"
                            width={330}
                            height={50}
                            maxWidth="full"
                            marginBottom={4}
                            value={namaDepan}
                            onChangeText={(value) => setNamaDepan(value)}
                        ></Input>
                    </Box>
                    <Box alignContent={"center"} marginLeft={6}>
                        <FormControl.Label>Nama Belakang</FormControl.Label>
                        <Input
                            placeholder="Nama Belakang"
                            width={330}
                            height={50}
                            maxWidth="full"
                            marginBottom={4}
                            value={namaBelakang}
                            onChangeText={(value) => setNamaBelakang(value)}
                        ></Input>
                    </Box>

                    <Box
                        width={330}
                        height={50}
                        maxW="full"
                        alignContent={"center"}
                        marginLeft={6}
                    >
                        <FormControl isRequired>
                            <FormControl.Label>Jenis Kelamin</FormControl.Label>
                            <Select
                                accessibilityLabel="Jenis Kelamin"
                                placeholder="Jenis Kelamin"
                                height={50}
                                _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size={2} />,
                                }}
                                onValueChange={(value) =>
                                    setJenisKelamin(value)
                                }
                                selectedValue={jenisKelamin}
                            >
                                <Select.Item
                                    label="Laki-Laki"
                                    value="Laki-Laki"
                                />
                                <Select.Item
                                    label="Perempuan"
                                    value="Perempuan"
                                />
                            </Select>
                        </FormControl>
                    </Box>
                    <Box>
                        <Button
                            onPress={handleSubmit}
                            backgroundColor="warning.400"
                            width={"320"}
                            height={"50"}
                            alignItems={"center"}
                            marginLeft={7}
                            rounded={"md"}
                            shadow="3"
                            marginY={2}
                            marginTop={10}
                        >
                            Simpan
                        </Button>
                        <Button
                            onPress={handleLogout}
                            backgroundColor="danger.600"
                            width={"320"}
                            height={"50"}
                            alignItems={"center"}
                            marginLeft={7}
                            rounded={"md"}
                            shadow="3"
                            marginY={2}
                            marginTop={0}
                        >
                            Logout
                        </Button>
                    </Box>
                </View>
                <AlertDialog
                    leastDestructiveRef={cancelRef}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>
                            {errorMessage.title}
                        </AlertDialog.Header>
                        <AlertDialog.Body>{errorMessage.body}</AlertDialog.Body>
                    </AlertDialog.Content>
                </AlertDialog>
            </ScrollView>
        </Box>
    );
}
export default Profile;
