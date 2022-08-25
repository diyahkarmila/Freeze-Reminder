import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    Box,
    View,
    FormControl,
    Input,
    HStack,
    Button,
    Select,
    CheckIcon,
    WarningOutlineIcon,
    Pressable,
    Icon,
    Text,
    AlertDialog
} from "native-base";
import { MaterialIcons, AntDesign, Fontisto } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import axios from 'axios';
import { Picker } from "react-native-web";

function UbahSegar({ route }) {
    const navigation = useNavigation();
    const { id } = route.params;
    const accessToken = useSelector(state => state.auth.accessToken)
    const [listBahanMakanan, setListBahanMakanan] = useState([])
    const [bahanMakanan, setBahanMakanan] = useState('')
    const [jumlah, setJumlah] = useState('')
    const [kategori, setKategori] = useState('')
    const [penyimpanan, setPenyimpanan] = useState('')
    const [awalPenyimpanan, setAwalPenyimpanan] = useState('')
    const [durasiPenyimpanan, setDurasiPenyimpanan] = useState('')
    const [defaultJumlah, setDefaultJumlah] = useState(0)
    const [status, setStatus] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        title: "Error",
        body: "Error Body",
    });
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            const getMakanan = async () => {
                await axios({
                    method: 'GET',
                    url: 'https://diyahfreezer.herokuapp.com/makanan',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((res) => {
                    setListBahanMakanan(res.data.length > 0 ? res.data : [])
                })
            }

            const getPenyimpanan = async () => {
                await axios({
                    method: 'GET',
                    url: `https://diyahfreezer.herokuapp.com/penyimpanan/${id}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((res) => {
                    if (res?.data?.id) {
                        setBahanMakanan(res.data.makananId)
                        setKategori(res.data.makanan.kategori)
                        setPenyimpanan(res.data.penyimpanan)
                        setJumlah(res.data.jumlah.toString())
                        setAwalPenyimpanan(res.data.tanggalPenyimpanan.substring(0, 10))
                        setStatus(res.data.selesai)
                        setDefaultJumlah(res.data.jumlah)
                    }
                })
            }

            getMakanan()
            getPenyimpanan()
        }, [id])
    )

    useEffect(() => {
        const getKategori = async () => {
            await axios({
                method: 'GET',
                url: `https://diyahfreezer.herokuapp.com/makanan/${bahanMakanan}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }).then((res) => {
                setKategori(res.data.kategori)
            })
        }

        if (bahanMakanan !== '') {
            getKategori()
        }
    }, [bahanMakanan, penyimpanan])

    const handleJumlahEdit = (value) => {
        if (parseInt(value) > defaultJumlah) {
            setIsOpen(true);
            setErrorMessage({
                title: "Error",
                body: `Jumlah tidak boleh melebihi ${defaultJumlah}`,
            });
            setJumlah(defaultJumlah.toString())
        } else {
            setJumlah(value)
        }
    }

    const handleSubmit = async () => {
        if (parseInt(jumlah) == 0) setStatus(true)

        await axios({
            method: 'PATCH',
            url: `https://diyahfreezer.herokuapp.com/penyimpanan/${id}`,
            data: {
                makananId: parseInt(bahanMakanan),
                tanggalPenyimpanan: awalPenyimpanan,
                penyimpanan: penyimpanan,
                jumlah: parseInt(jumlah),
                selesai: JSON.parse(parseInt(jumlah) == 0 ? true : status)
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then((res) => {
            if (res?.data?.id) {
                if (parseInt(jumlah) == 0 && defaultJumlah != 0) {
                    setIsOpen(true)
                    setErrorMessage({
                        title: "Berhasil",
                        body: `Bahan makanan berhasil diolah dengan baik`,
                    })
                    setDefaultJumlah(0)
                } else {
                    navigation.navigate('ListBahan')
                }
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
        });
    }

    return (
        <Box safearea>
            {/* Inputan data */}
            <HStack
                marginTop={10}
                marginX={"3"}
                paddingY={"2.5"}
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Pressable onPress={() => navigation.navigate('ListBahan')}>
                    <Icon color="black" as={AntDesign} name="back" size="xl" />
                </Pressable>
            </HStack>
            <HStack>
                <View
                    alignContent={"center"}
                    marginTop={50}
                    width={350}
                    height={400}
                    bg={"coolGray.100"}
                >
                    <Box alignContent={"center"} marginLeft={7}>
                        <FormControl.Label>Bahan Makanan</FormControl.Label>
                        <Select
                            accessibilityLabel="Penyimpanan"
                            placeholder="Penyimpanan"
                            _selectedItem={{
                                bg: "teal.600",
                            }}
                            onValueChange={(value) => setBahanMakanan(value)}
                            selectedValue={bahanMakanan}
                        >
                            <Select.Item label="--Pilih Bahan Makanan --" isDisabled={true} />
                            {listBahanMakanan.length > 0 ? listBahanMakanan.map((val) => (
                                <Select.Item key={val.id} label={val.bahanMakanan} value={val.id} />
                            )) : (<></>)}
                        </Select>
                    </Box>

                    <Box alignContent={"center"} marginLeft={7}>
                        <FormControl.Label>Jumlah</FormControl.Label>
                        <Input
                            placeholder="0"
                            width={330}
                            height={41}
                            maxWidth="full"
                            marginBottom={1}
                            onChangeText={handleJumlahEdit}
                            value={jumlah}
                        ></Input>
                    </Box>

                    <Box alignContent={"center"} marginLeft={7}>
                        <FormControl.Label>Kategori</FormControl.Label>
                        <Input
                            placeholder="Kategori"
                            width={330}
                            height={41}
                            maxWidth="full"
                            marginBottom={1}
                            isDisabled={true}
                            value={kategori}
                        ></Input>
                    </Box>

                    <Box
                        width={330}
                        maxW="full"
                        alignContent={"center"}
                        marginLeft={7}
                        marginBottom={1}
                    >
                        <FormControl isRequired>
                            <FormControl.Label>Penyimpanan</FormControl.Label>
                            <Select
                                accessibilityLabel="Penyimpanan"
                                placeholder="Penyimpanan"
                                _selectedItem={{
                                    bg: "teal.600",
                                }}
                                selectedValue={penyimpanan}
                                onValueChange={(value) => setPenyimpanan(value)}
                            >
                                <Select.Item label="Freezer" value="Freezer" />
                                <Select.Item label="Chiller" value="Chiller" />
                            </Select>
                            {/* <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                Silahkan isi dengan benar!
                            </FormControl.ErrorMessage> */}
                        </FormControl>
                    </Box>
                    <Box alignContent={"center"} marginLeft={7}>
                        <FormControl.Label>Awal Penyimpanan</FormControl.Label>
                        <Input
                            placeholder="yyyy-mm-dd"
                            width={330}
                            height={41}
                            maxWidth="full"
                            marginBottom={1}
                            icon={
                                <Icon
                                    color="black"
                                    as={Fontisto}
                                    name="date"
                                    size="sm"
                                />
                            }
                            onChangeText={(value) => setAwalPenyimpanan(value)}
                            value={awalPenyimpanan}

                        ></Input>
                    </Box>
                    <Box
                        width={330}
                        maxW="full"
                        alignContent={"center"}
                        marginLeft={7}
                        marginBottom={1}
                    >
                        <FormControl isRequired>
                            <FormControl.Label>Status </FormControl.Label>
                            <Select
                                accessibilityLabel="Status"
                                placeholder="Status"
                                _selectedItem={{
                                    bg: "teal.600",
                                }}
                                selectedValue={status}
                                onValueChange={(value) => setStatus(value)}
                            >
                                <Select.Item label="Selesai" value={true} />
                                <Select.Item label="Masih Disimpan" value={false} />
                            </Select>
                            {/* <FormControl.ErrorMessage
                                leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                                Silahkan isi dengan benar!
                            </FormControl.ErrorMessage> */}
                        </FormControl>
                    </Box>
                    {/* Button Selesai */}
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
                            marginTop={20}
                        >
                            Selesai
                        </Button>
                    </Box>
                </View>
            </HStack>
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

export default UbahSegar;
