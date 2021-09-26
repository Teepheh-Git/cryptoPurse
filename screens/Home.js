import React, {useCallback, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {MainLayout} from './'
import {BalanceInfo, Chart, IconTextButton} from "../components";
import {connect} from "react-redux"

import {getCoinMarket, getHoldings} from "../stores/market/marketActions";
import {useFocusEffect} from "@react-navigation/native";
import {COLORS, dummyData, FONTS, icons, SIZES} from "../constants";

const Home = ({getHoldings, getCoinMarket, myHoldings, coins}) => {

    const [selectedCoin, setSelectedCoin] = useState(null)


    useFocusEffect(
        useCallback(() => {
            getHoldings(holdings = dummyData.holdings)
            getCoinMarket()
        }, [])
    )

    let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0)

    let valueChange = myHoldings.reduce((a, b) => a + (b.holding_value_change_7d || 0), 0)

    let percChange = valueChange / (totalWallet - valueChange) * 100


    function renderWalletInfoSections() {
        return (
            <View style={{
                paddingHorizontal: SIZES.padding,
                borderBottomLeftRadius: 25,
                borderBottomRightRadius: 25,
                backgroundColor: COLORS.gray
            }}>

                {/*balance info*/}
                <BalanceInfo
                    title={"Your Wallet"}
                    displayAmount={totalWallet}
                    changePct={percChange}
                    containerStyle={{
                        marginTop: 50
                    }}
                />

                {/*buttons*/}
                <View style={{flexDirection: 'row', marginTop: 30, marginBottom: -15, paddingHorizontal: SIZES.radius}}>

                    <IconTextButton
                        label={"Transfer"}
                        icon={icons.send}
                        onPress={() => console.log('transfer')}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                            marginRight: SIZES.radius,
                        }}
                    />
                    <IconTextButton
                        label={"Withdraw"}
                        icon={icons.withdraw}
                        onPress={() => console.log('withdraw')}
                        containerStyle={{
                            flex: 1,
                            height: 40,
                            marginRight: SIZES.radius,
                        }}
                    />
                </View>

            </View>

        );
    }


    return (
        <MainLayout>
            <View style={{flex: 1, backgroundColor: COLORS.black}}>

                {/*header*/}
                {renderWalletInfoSections()}

                {/*chart*/}
                <Chart
                    chartPrices={
                        selectedCoin ? selectedCoin?.sparkline_in_7d?.price : coins[0]?.sparkline_in_7d?.price
                    }
                    containerStyle={{
                        marginTop: SIZES.padding * 2,
                    }}

                />

                {/*top currency*/}

                <FlatList
                    data={coins}
                    keyExtractor={item => item.id}
                    containerStyle={{
                        marginTop: 30,
                        paddingHorizontal: SIZES.padding
                    }}
                    ListHeaderComponent={
                        <View style={{marginBottom: SIZES.radius,}}>

                            <Text style={{
                                color: COLORS.white, ...FONTS.h3, fontSize: 18
                            }}>Top Cryptocurrency</Text>

                        </View>
                    }
                    renderItem={({item}) => {
                        console.log('price_change_percentage_7d_in_currency')
                        console.log(item.price_change_percentage_7d_in_currency)
                        // console.log(item.current_price)


                        const priceColor = (item.price_change_percentage_7d_in_currency = 0) ? COLORS.lightGray3 : (item.price_change_percentage_7d_in_currency > 0) ? COLORS.lightGreen : COLORS.red;

                        return (
                            <TouchableOpacity
                                onPress={() => setSelectedCoin(item)}
                                style={{
                                    height: 55, flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                {/*Logo*/}
                                <View style={{
                                    width: 35
                                }}>

                                    <Image
                                        source={{uri: item.image}}
                                        style={{
                                            height: 20,
                                            width: 20,
                                        }}/>

                                </View>

                                {/*Name*/}

                                <View style={{
                                    flex: 1,
                                }}>
                                    <Text style={{color: COLORS.white, ...FONTS.h3}}
                                    >{item.name}</Text>


                                </View>
                                {/*Figures*/}
                                <View style={{}}>
                                    <Text style={{
                                        textAlign: 'right',
                                        color: COLORS.white, ...FONTS.h4
                                    }}>$ {item.current_price}</Text>

                                    <View style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}>

                                        {
                                            item.price_change_percentage_7d_in_currency !== 0 &&
                                            <Image
                                                source={icons.upArrow}
                                                style={{
                                                    height: 10,
                                                    width: 10,
                                                    tintColor: priceColor,
                                                    transform: item.price_change_percentage_7d_in_currency > 0 ? [{rotate: '45deg'}] : [{rotate: '125deg'}]
                                                }}/>

                                        }

                                        <Text style={{
                                            marginLeft: 5,
                                            color: priceColor, ...FONTS.body5,
                                            lineHeight: 15
                                        }}>{item.price_change_percentage_7d_in_currency.toFixed(2)}%</Text>

                                    </View>
                                </View>

                            </TouchableOpacity>
                        )
                    }}


                    ListFooterComponent={
                        <View style={{
                            marginBottom: 50
                        }}/>


                    }


                />

            </View>
        </MainLayout>
    )
}


function mapStateToProps(state) {
    return {
        myHoldings: state.marketReducer.myHoldings,
        coins: state.marketReducer.coins

    }
}


function mapDispatchToProps(dispatch) {
    return {
        getHoldings: (holdings, currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page) => {
            return dispatch(getHoldings(holdings, currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page))
        },
        getCoinMarket: (currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page) => {
            return dispatch(getCoinMarket(currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
