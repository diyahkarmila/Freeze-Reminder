import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import {
    Box,
    View,
    FormControl,
    Input,
    ZStack,
    Text,
    Select,
    CheckIcon,
    WarningOutlineIcon,
    Button,
    StackActions,
    icon,
    Image,
    Heading,
    AlertDialog,
} from "native-base";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../redux/actions";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

function Login() {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken); // State Global
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        title: "Error",
        body: "Error Body",
    });
    const onClose = () => setIsOpen(false)
    const cancelRef = useRef(null)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const handleSubmit = async () => {
        await axios({
            url: "https://diyahfreezer.herokuapp.com/auth/signin",
            method: "POST",
            data: {
                email: email,
                password: password,
            },
        }).then(async (res) => {
            if (res?.data?.access_token) {
                await SecureStore.setItemAsync(
                    "access_token",
                    res.data.access_token
                );
                dispatch(setAuth(res.data.access_token))
            }
        }).catch((err) => {
            const error = err.toJSON();

            if (error.status === 403) {
                setIsOpen(true);
                setErrorMessage({
                    title: "Unauthorized",
                    body: "Email address atau password yang Anda masukkan salah!",
                });
            } else if (error.status === 400) {
                setIsOpen(true);
                setErrorMessage({
                    title: "Error",
                    body: "Masukkan seluruh entri data untuk memasuki aplikasi",
                });
            }
        })
    }

    useFocusEffect(
        useCallback(() => {
            const checkOpenedBefore = async () => {
                const isOpenedBefore = await SecureStore.getItemAsync(
                    "isOpenedBefore"
                );

                if (isOpenedBefore === null || isOpenedBefore !== "true") {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: "onBoard",
                                state: {
                                    routes: [
                                        {
                                            name: "OnBoard1",
                                        },
                                    ],
                                },
                            },
                        ],
                    });
                }
            };

            checkOpenedBefore();
        }, [])
    );

    useEffect(() => {
        getAccessTokenFromStorage = async () => {
            const access_token_storage = await SecureStore.getItemAsync(
                "access_token"
            );
            if (access_token_storage) dispatch(setAuth(access_token_storage));
        };
        getAccessTokenFromStorage();
    }, []);

    useEffect(() => {
        const checkLogin = async () => {
            await axios({
                url: "https://diyahfreezer.herokuapp.com/users/",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).catch(async (err) => {
                if (err?.response?.statusText === "Unauthorized") {
                    await SecureStore.deleteItemAsync("access_token");
                    dispatch(setAuth(""));
                }
            }).then(async (res) => {
                if (res?.data?.id) {
                    registerForPushNotificationsAsync().then(async (token) => {
                        await axios({
                            url: "https://diyahfreezer.herokuapp.com/auth/set-token",
                            method: "POST",
                            data: {
                                fcmToken: token
                            },
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }).catch(async (err) => {
                            if (err?.response?.statusText === "Unauthorized") {
                                await SecureStore.deleteItemAsync("access_token");
                                dispatch(setAuth(""));
                            }
                        }).then(async (res) => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: "Main" }],
                            });
                        })
                    });

                }
            });
        };
        checkLogin();
    }, [accessToken]);

    const registerForPushNotificationsAsync = async () => {
        let token;

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
    }

    return (
        <Box safeArea>
            {/* Banner Foto */}
            <Box marginTop={50} justifyContent={"center"} alignItems="center">
                <Heading>Masuk</Heading>
            </Box>

            {/* Input Data */}
            <View alignContent={"center"} marginTop={50}>
                <Box alignContent={"center"} marginLeft={5}>
                    <FormControl.Label>Email</FormControl.Label>
                    <Input
                        placeholder="Email"
                        width={330}
                        height={50}
                        maxWidth="full"
                        marginBottom={4}
                        onChangeText={(value) => setEmail(value)}
                        defaultValue={email}
                    ></Input>
                </Box>

                <Box alignContent={"center"} marginLeft={5}>
                    <FormControl.Label>Password</FormControl.Label>
                    <Input
                        placeholder="Password"
                        width={330}
                        height={50}
                        maxWidth="full"
                        marginBottom={2}
                        secureTextEntry
                        onChangeText={(value) => {
                            setPassword(value);
                        }}
                        value={password}
                    ></Input>
                </Box>
                <View style={{ textAlign: "end", paddingRight: 17 }}>
                    <Text
                        style={{ fontSize: 11, color: "rgb(115, 115, 115)" }}
                        onPress={() => navigation.navigate("Regis")}
                        marginLeft="7"
                        marginTop={"4"}
                    >
                        Belum Punya Akun? Buat Akun!
                    </Text>
                </View>

                {/* Button Mulai */}
                <Box>
                    <Button
                        // onPress={() => navigation.navigate("Main")}
                        onPress={() => {
                            handleSubmit();
                        }}
                        backgroundColor="warning.400"
                        width={"330"}
                        height={"50"}
                        alignItems={"center"}
                        marginLeft={5}
                        rounded={"md"}
                        shadow="3"
                        marginY={5}
                    >
                        Masuk
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
        </Box>
    );
}

export default Login;
