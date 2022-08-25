import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    Box,
    View,
    FormControl,
    Input,
    Heading,
    VStack,
    Fab,
    Text,
    Icon,
    Select,
    WarningOutlineIcon,
    Button,
    StackActions,
    icon,
} from "native-base";
import { AntDesign, CheckIcon, Fontisto } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Picker } from "react-native-web";

function AddBahan() {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const [listBahanMakanan, setListBahanMakanan] = useState([]);
    const [bahanMakanan, setBahanMakanan] = useState("");
    const [jumlah, setJumlah] = useState("");
    const [kategori, setKategori] = useState("");
    const [penyimpanan, setPenyimpanan] = useState("");
    const [awalPenyimpanan, setAwalPenyimpanan] = useState("");
    const [durasiPenyimpanan, setDurasiPenyimpanan] = useState("");

    useFocusEffect(
        useCallback(() => {
            const getMakanan = async () => {
                await axios({
                    method: "GET",
                    url: "https://diyahfreezer.herokuapp.com/makanan",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }).then((res) => {
                    // console.warn(res.data)
                    setListBahanMakanan(res.data.length > 0 ? res.data : []);
                });
            };

            getMakanan();
        }, [])
    );

    useEffect(() => {
        const getKategori = async () => {
            await axios({
                method: "GET",
                url: `https://diyahfreezer.herokuapp.com/makanan/${bahanMakanan}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((res) => {
                setKategori(res.data.kategori);
                Promise.all(
                    res.data.tipe.map((value, index) => {
                        if (penyimpanan === value.penyimpanan)
                            setDurasiPenyimpanan(
                                value.durasi.toString() + " Hari"
                            );
                    })
                );
            });
        };
        if (bahanMakanan !== "") {
            getKategori();
        }
    }, [bahanMakanan, penyimpanan]);

    const handleSubmit = async () => {
        await axios({
            method: "POST",
            url: `https://diyahfreezer.herokuapp.com/penyimpanan`,
            data: {
                makananId: parseInt(bahanMakanan),
                tanggalPenyimpanan: awalPenyimpanan,
                penyimpanan: penyimpanan,
                jumlah: parseInt(jumlah),
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
            .then((res) => {
                if (res?.data?.id) {
                    navigation.navigate("Beranda");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Box safearea>
            {/* Button Close */}
            <VStack>
                {/* <Fab
                    renderInPortal={true}
                    shadow={2}
                    size="sm"
                    marginX={150}
                    marginY={650}
                    onPress={() => navigation.navigate("ListBahan")}
                    backgroundColor={"warning.500"}
                    icon={
                        <Icon
                            color="white"
                            as={AntDesign}
                            name="close"
                            size="sm"
                        />
                    }
                /> */}

                {/* Inputan Data */}
                <View alignContent={"center"} marginTop={150}>
                    <Box
                        width={330}
                        maxW="full"
                        alignContent={"center"}
                        marginLeft={7}
                        marginBottom={1}
                    >
                        <FormControl.Label>Bahan Makanan</FormControl.Label>
                        <Select
                            accessibilityLabel="Bahan Makanan"
                            placeholder="Bahan Makanan"
                            _selectedItem={{
                                bg: "teal.600",
                            }}
                            onValueChange={(value) => setBahanMakanan(value)}
                            selectedValue={bahanMakanan}
                        >
                            <Select.Item
                                label="--Pilih Bahan Makanan --"
                                isDisabled={true}
                            />
                            {listBahanMakanan.length > 0 ? (
                                listBahanMakanan.map((val) => (
                                    <Select.Item
                                        key={val.id}
                                        label={val.bahanMakanan}
                                        value={val.id}
                                    />
                                ))
                            ) : (
                                <></>
                            )}
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
                            onChangeText={(value) => setJumlah(value)}
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
                            <FormControl.Label>Penyimpanan </FormControl.Label>
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

                    <Box alignContent={"center"} marginLeft={7}>
                        <FormControl.Label>
                            Durasi Penyimpanan
                        </FormControl.Label>
                        <Input
                            placeholder="Hari"
                            width={330}
                            height={41}
                            maxWidth="full"
                            marginBottom={4}
                            isDisabled={true}
                            value={durasiPenyimpanan}
                        ></Input>
                    </Box>

                    {/* Button Mulai */}
                    <Box>
                        <Button
                            onPress={handleSubmit}
                            backgroundColor="warning.400"
                            width={"330"}
                            height={"50"}
                            alignItems={"center"}
                            marginLeft={7}
                            rounded={"md"}
                            shadow="3"
                            marginY={2}
                        >
                            Selesai
                        </Button>
                    </Box>
                </View>
            </VStack>
        </Box>
    );
}

export default AddBahan;
