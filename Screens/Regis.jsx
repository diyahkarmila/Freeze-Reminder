import { useNavigation } from "@react-navigation/native";
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
import { AssetsLoader } from "../assets/AssetsLoader";
import * as SecureStore from 'expo-secure-store'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useRef, useState } from "react";
import { setAuth } from '../redux/actions'

function Regis() {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const [namaDepan, setNamaDepan] = useState('')
    const [namaBelakang, setNamaBelakang] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [jenisKelamin, setJenisKelamin] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        title: "Error",
        body: "Error Body",
    });
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);

    const handleSubmit = async () => {
        await axios({
            url: 'https://diyahfreezer.herokuapp.com/auth/signup',
            method: 'POST',
            data: {
                email,
                password,
                jenisKelamin,
                firstName: namaDepan,
                lastName: namaBelakang,
            }
        }).then(async (res) => {
            if (res?.data?.firstName) {
                setNamaDepan('')
                setNamaBelakang('')
                setEmail('')
                setPassword('')
                setJenisKelamin('')
                setIsOpen(true);
                setErrorMessage({
                    title: 'Berhasil Registrasi',
                    body: 'Anda telah berhasil melakukan registrasi akun. Silahkan kembali ke menu Login dan masuklah menggunakan akun yang barusan Anda buat'
                })
            }
        }).catch((err) => {
            const error = err.toJSON()

            if (error.status === 400) {
                setIsOpen(true);
                setErrorMessage({
                    title: "Error",
                    body: "Masukkan seluruh entri data untuk memasuki aplikasi",
                });
            }
        })
    }

    return (
        <Box safeArea>
            {/* Banner Foto */}
            <Box marginTop={50} justifyContent={"center"} alignItems="center">
                <Heading>Daftar</Heading>
            </Box>

            {/* Input Data */}
            <View alignContent={"center"} marginTop={50}>
                <Box alignContent={"center"} marginLeft={5}>
                    <FormControl.Label>Nama Depan</FormControl.Label>
                    <Input
                        placeholder="Nama Depan"
                        width={330}
                        height={50}
                        maxWidth="full"
                        marginBottom={4}
                        onChangeText={(value) => setNamaDepan(value)}
                        defaultValue={namaDepan}
                    ></Input>
                </Box>

                <Box alignContent={"center"} marginLeft={5}>
                    <FormControl.Label>Nama Belakang</FormControl.Label>
                    <Input
                        placeholder="Nama Belakang"
                        width={330}
                        height={50}
                        maxWidth="full"
                        marginBottom={4}
                        onChangeText={(value) => setNamaBelakang(value)}
                        defaultValue={namaBelakang}
                    ></Input>
                </Box>

                <Box alignContent={"center"} marginLeft={5}>
                    <FormControl isRequired>
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
                    </FormControl>
                </Box>

                <Box alignContent={"center"} marginLeft={5}>
                    <FormControl isRequired>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input
                            placeholder="Password"
                            width={330}
                            height={50}
                            maxWidth="full"
                            marginBottom={4}
                            secureTextEntry
                            onChangeText={(value) => setPassword(value)}
                            defaultValue={password}
                        ></Input>
                    </FormControl>
                </Box>

                <Box
                    width={330}
                    height={50}
                    maxWidth="full"
                    marginBottom={4}
                    alignContent={"center"}
                    marginLeft={5}
                >
                    <FormControl>
                        <FormControl.Label>Jenis Kelamin</FormControl.Label>
                        <Select
                            accessibilityLabel="Jenis Kelamin"
                            placeholder="Jenis Kelamin"
                            height={50}
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size={2} />,
                            }}
                            onValueChange={(value) => setJenisKelamin(value)}
                            defaultValue={jenisKelamin}
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
                        onPress={handleSubmit}
                        backgroundColor="warning.400"
                        width={"330"}
                        height={"50"}
                        alignItems={"center"}
                        marginLeft={5}
                        rounded={"md"}
                        shadow="3"
                        marginY={5}
                        marginTop={70}
                    >
                        Daftar
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

export default Regis;
