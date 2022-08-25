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

function Selesai() {
    const navigation = useNavigation();
    const accessToken = useSelector((state) => state.auth.accessToken)
    const [penyimpanan, setPenyimpanan] = useState([])

    useFocusEffect(
        useCallback(() => {
            const getPenyimpanan = async () => {
                await axios({
                    url: 'https://diyahfreezer.herokuapp.com/penyimpanan?status=true',
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
                {penyimpanan.length > 0 && penyimpanan.map((val, index) => (
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
                                </View>
                            </HStack>
                        </Box>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}

export default Selesai;
