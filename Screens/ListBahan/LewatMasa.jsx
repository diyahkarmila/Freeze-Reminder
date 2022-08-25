import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
    Box,
    HStack,
    ScrollView,
    View,
    Text,
    VStack,
    Badge,
    Icon,
    Input,
    Pressable,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import axios from "axios";

function LewatMasa() {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken)
    const [penyimpanan, setPenyimpanan] = useState([])
    const treatAsUTC = (date) => {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    const daysBetween = (startDate, endDate) => {
        var millisecondsPerDay = 24 * 60 * 60 * 1000;
        return parseInt((treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay);
    }

    const jumlahHari = (val, customEndDate = null) => {
        const tanggalAwal = new Date(val.tanggalPenyimpanan)
        let penambahanHari = 0

        Promise.all(
            val.makanan.tipe.map((tipe) => {
                if (tipe.penyimpanan === val.penyimpanan) {
                    penambahanHari = tipe.durasi
                }
            })
        )

        tanggalAwal.setDate(tanggalAwal.getDate() + penambahanHari)
        const jumlahHari = daysBetween(customEndDate ? customEndDate : new Date().toISOString(), tanggalAwal.toISOString())
        return jumlahHari >= 0 ? jumlahHari + ' Hari' : 'Expired'
    }

    const pengaturanBackground = (val) => {
        const jumlahHariVal = jumlahHari(val).split(' ')[0]
        if (jumlahHariVal === 'Expired') {
            return 'Lewat Masa'
        } else {
            const totalHari = parseInt(jumlahHari(val, new Date(val.tanggalPenyimpanan).toISOString()).split(' ')[0])

            if ((totalHari / 2) < parseInt(jumlahHariVal)) {
                return 'Segar'
            } else {
                return 'Segera Olah'
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            const getPenyimpanan = async () => {
                await axios({
                    url: 'https://diyahfreezer.herokuapp.com/penyimpanan?status=false',
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }).then((res) => {
                    setPenyimpanan(res.data)
                })
            }
            getPenyimpanan()
        }, [])
    );

    return (
        <View style={{ height: "100%" }}>
            {/* Search */}
            <VStack
                width={"350"}
                marginTop={"18"}
                space={"2"}
                marginLeft={"-6"}
            >
                <Input
                    placeholder="Cari"
                    width="full"
                    borderRadius="4"
                    fontSize="12"
                    marginX="10"
                    marginBottom={"2"}
                    InputRightElement={
                        <Icon
                            m="1"
                            ml="2"
                            size="4"
                            color="gray.400"
                            as={<MaterialIcons name="search" />}
                        />
                    }
                />
            </VStack>

            {/* List Bahan */}
            <ScrollView>
                {penyimpanan.length > 0 && penyimpanan.map((val, index) => {
                    if (pengaturanBackground(val) === 'Lewat Masa') {
                        return (

                            <Pressable key={val.id} onPress={() => navigation.navigate("Bahan Makanan", {
                                screen: 'UbahSegar',
                                params: {
                                    id: val.id
                                }
                            })}>
                                <Box alignItems="center" marginX={"5"} >
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
                                        <View height="full" justifyContent="center" right={20}>
                                            <Text fontSize={"sm"} bold overflow={"hidden"}>
                                                {val.makanan.bahanMakanan}
                                            </Text>
                                            <Text fontSize={"xs"} overflow={"hidden"}>
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
                                                        alignItems={"center"}
                                                        alignContent={"center"}
                                                        color="muted.900"
                                                        borderWidth={1}
                                                        borderColor={"muted.600"}
                                                        rounded="full"
                                                        width="110"
                                                        height="18"
                                                        variant="outline"
                                                    >
                                                        <Text
                                                            fontSize={11}
                                                            marginTop={"-1"}
                                                            alignItems={"center"}
                                                        >
                                                            {val.makanan.kategori}
                                                        </Text>
                                                    </Badge>
                                                </VStack>
                                            </Box>
                                            <View
                                                flexDirection={"row"}
                                                alignItems="center"
                                                justifyContent={"space-between"}
                                            >
                                                <Box
                                                    alignItems={"center"}
                                                    rounded={"full"}
                                                    width="50px"
                                                    marginTop="-42px"
                                                    height="11"
                                                    marginLeft={-9}
                                                    bg="danger.600"
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
                        )
                    }
                }
                )}
            </ScrollView>
        </View>
    );
}

export default LewatMasa;
