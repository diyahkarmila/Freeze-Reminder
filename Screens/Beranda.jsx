import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    Avatar,
    Box,
    HStack,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    VStack,
    Badge,
    Fab,
    Icon,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import AssetsLoader from "../assets/AssetsLoader";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Beranda({ route }) {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken);
    const [namaBelakang, setNamaBelakang] = useState("");
    const [penyimpanan, setPenyimpanan] = useState([]);

    const treatAsUTC = (date) => {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    };

    const daysBetween = (startDate, endDate) => {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return parseInt(
            (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay
        );
    };

    const jumlahHari = (val, customEndDate = null) => {
        const tanggalAwal = new Date(val.tanggalPenyimpanan);
        let penambahanHari = 0;

        Promise.all(
            val.makanan.tipe.map((tipe) => {
                if (tipe.penyimpanan === val.penyimpanan) {
                    penambahanHari = tipe.durasi;
                }
            })
        );

        tanggalAwal.setDate(tanggalAwal.getDate() + penambahanHari);
        const jumlahHari = daysBetween(
            customEndDate ? customEndDate : new Date().toISOString(),
            tanggalAwal.toISOString()
        );
        return jumlahHari >= 0 ? jumlahHari + " Hari" : "Expired";
    };

    const pengaturanBackground = (val) => {
        const jumlahHariVal = jumlahHari(val).split(" ")[0];

        if (jumlahHariVal === "Expired") {
            return "danger.600";
        } else {
            const totalHari = parseInt(
                jumlahHari(
                    val,
                    new Date(val.tanggalPenyimpanan).toISOString()
                ).split(" ")[0]
            );

            8 > 10;
            if (totalHari / 2 < parseInt(jumlahHariVal)) {
                return "success.400";
            } else {
                return "warning.400";
            }
        }
    };

    // useEffect() -> Menjalankan Statement sebelum Page Diload
    // useFocusEffect() -> Menjalankan Statement sebelum Page Diload
    useFocusEffect(
        useCallback(() => {
            const getPenyimpanan = async () => {
                await axios({
                    url: "https://diyahfreezer.herokuapp.com/penyimpanan?status=false",
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                })
                    .catch((err) => {
                        console.error(err.toJSON());
                    })
                    .then((res) => {
                        setPenyimpanan(res.data);
                    });
            };
            getPenyimpanan();
        }, [])
    );

    useEffect(() => {
        const getNamaBelakang = async () => {
            await axios({
                url: "https://diyahfreezer.herokuapp.com/users",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .catch((err) => {
                    console.error(err);
                })
                .then((res) => {
                    setNamaBelakang(res.data.lastName);
                });
        };
        getNamaBelakang();
    }, []);

    return (
        <Box safeArea={true}>
            {/* Header beranda */}
            <ScrollView>
                <HStack
                    marginX={"3"}
                    paddingY={"2.5"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Image
                        source={AssetsLoader["Logo"]}
                        alt="logo"
                        size={"xs"}
                        resizeMode={"contain"}
                    />
                    <Pressable onPress={() => navigation.navigate("Profile")}>
                        <Avatar source={AssetsLoader["DefaultProfile"]} />
                    </Pressable>
                </HStack>

                {/* Greetings */}
                <Box marginX={"5"} marginTop={18}>
                    <Text fontSize={"3xl"}>Halo {namaBelakang}</Text>
                </Box>

                {/* Banner Beranda */}
                <Box alignItems="center" marginX={"3"}>
                    <HStack
                        marginTop={18}
                        paddingX={"4"}
                        paddingY={"2.5"}
                        alignItems={"center"}
                        space={2}
                        justifyContent="space-between"
                        height={173}
                        width={343}
                        maxWidth="full"
                        bg="warning.400"
                        rounded="md"
                        shadow={3}
                        position="relative"
                    >
                        <View
                            width="2/4"
                            height="full"
                            justifyContent="center"
                            alignContent={"flex-end"}
                            left={2}
                        >
                            <Text fontSize={"lg"} bold overflow={"hidden"}>
                                Ayo!!!
                            </Text>
                            <Text fontSize={"lg"} bold overflow={"hidden"}>
                                Mulai perhatikan
                            </Text>
                            <Text fontSize={"lg"} bold overflow={"hidden"}>
                                kesegaran bahan makanan mu
                            </Text>
                        </View>

                        <Image
                            source={AssetsLoader["Koki"]}
                            alt="koki"
                            width={154}
                            height={216}
                            resizeMode={"contain"}
                            position="absolute"
                            right={0}
                            top={-55}
                        />
                    </HStack>
                </Box>

                {/* List Bahan Makanan */}
                {penyimpanan.length > 0 &&
                    penyimpanan.map((val, index) => {
                        if (index < 4) {
                            return (
                                <Pressable
                                    key={val.id}
                                    onPress={() =>
                                        navigation.navigate("Bahan Makanan", {
                                            screen: "UbahSegar",
                                            params: {
                                                id: val.id,
                                            },
                                        })
                                    }
                                >
                                    <Box alignItems="center" marginX={"5"}>
                                        <HStack
                                            marginTop={18}
                                            paddingX={4}
                                            paddingY={2.5}
                                            alignItems={"center"}
                                            space={2}
                                            justifyContent="space-between"
                                            height={90}
                                            width={343}
                                            maxWidth="full"
                                            bg="lightText"
                                            rounded="md"
                                            shadow={3}
                                            position="relative"
                                        >
                                            <View width={"1/2"}>
                                                <Box
                                                    width={90}
                                                    height={90}
                                                    bg="warning.100"
                                                    right={4}
                                                    maxWidth="full"
                                                />
                                            </View>
                                            <View
                                                height="full"
                                                justifyContent="center"
                                                right={20}
                                            >
                                                <Text
                                                    fontSize={"sm"}
                                                    bold
                                                    overflow={"hidden"}
                                                >
                                                    {val.makanan.bahanMakanan}
                                                </Text>
                                                <Text
                                                    fontSize={"xs"}
                                                    overflow={"hidden"}
                                                >
                                                    {val.penyimpanan}
                                                </Text>
                                            </View>
                                            <View>
                                                <Box alignItems={"center"}>
                                                    <VStack>
                                                        <Badge
                                                            marginTop={"3"}
                                                            marginBottom={"12"}
                                                            marginLeft={-9}
                                                            alignItems={
                                                                "center"
                                                            }
                                                            alignContent={
                                                                "center"
                                                            }
                                                            color="muted.900"
                                                            borderWidth={1}
                                                            borderColor={
                                                                "muted.600"
                                                            }
                                                            rounded="full"
                                                            width="110"
                                                            height="18"
                                                            variant="outline"
                                                        >
                                                            <Text
                                                                fontSize={11}
                                                                marginTop={"-1"}
                                                                alignItems={
                                                                    "center"
                                                                }
                                                            >
                                                                {
                                                                    val.makanan
                                                                        .kategori
                                                                }
                                                            </Text>
                                                        </Badge>
                                                    </VStack>
                                                </Box>
                                                <View
                                                    flexDirection={"row"}
                                                    alignItems="center"
                                                    justifyContent={
                                                        "space-between"
                                                    }
                                                >
                                                    <Box
                                                        alignItems={"center"}
                                                        rounded={"full"}
                                                        width="50px"
                                                        marginTop="-42px"
                                                        height="11"
                                                        marginLeft={-9}
                                                        bg={pengaturanBackground(
                                                            val
                                                        )}
                                                    ></Box>
                                                    <Text
                                                        fontSize={"xs"}
                                                        marginBottom="2px"
                                                        marginTop={-10}
                                                        overflow={"hidden"}
                                                    >
                                                        {jumlahHari(val)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </HStack>
                                    </Box>
                                </Pressable>
                            );
                        }
                    })}
            </ScrollView>

            {/* Button Add Bahan */}
            {/* <Fab
                renderInPortal={true}
                shadow={2}
                size="sm"
                marginBottom={10}
                onPress={() => navigation.navigate("AddBahan")}
                backgroundColor={"warning.500"}
                icon={
                    <Icon color="white" as={AntDesign} name="plus" size="sm" />
                }
            /> */}
        </Box>
    );
}

export default Beranda;
