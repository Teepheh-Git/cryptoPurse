import React, {useEffect, useRef, useState} from 'react';
import {Animated, FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {MainLayout} from './'
import {getCoinMarket} from "../stores/market/marketActions";
import {connect} from "react-redux";
import {COLORS, constants, FONTS, icons, SIZES} from "../constants";
import {HeaderBar, TextButtons} from "../components";
import {LineChart} from "react-native-chart-kit";


const MarketTabs = constants.marketTabs.map((marketTab) => ({
    ...marketTab,
    ref: React.createRef()

}))

const TabIndicator = ({measureLayout, scrollX}) => {

    const inputRange = MarketTabs.map((_, i) => i * SIZES.width)

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure => measure.x)
    })


    return (
        <Animated.View

            style={{
                position: 'absolute',
                left: 0,
                height: '100%',
                width: (SIZES.width - (SIZES.radius * 2)) / 2,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.lightGray,
                transform: [{
                    translateX
                }]
            }}
            // stopped at 2:35:00

        />

    )

}

const Tabs = ({scrollX}) => {

    const [measureLayout, setMeasureLayout] = useState([])
    const containerRef = useRef()

    useEffect(() => {
        let ml = []
        MarketTabs.forEach(marketTab => {
            marketTab?.ref?.current?.measureLayout(
                containerRef.current,
                (x, y, width, height) => {
                    ml.push({
                        x, y, width, height
                    })

                    if (ml.length === MarketTabs.length) {
                        setMeasureLayout(ml)
                    }

                })


        })

    }, [containerRef.current])


    return (
        <View
            ref={containerRef}
            style={{
                flexDirection: 'row'
            }}>

            {/*Tab Indicator*/}
            {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX}/>}

            {/*Tabs*/}

            {MarketTabs.map((item, index) => {
                return (

                    <TouchableOpacity
                        key={`MarketTab-${index}`}
                        // onPress={}
                        style={{
                            flex: 1
                        }}>

                        <View
                            ref={item.ref}
                            style={{
                                paddingHorizontal: 15,
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 40
                            }}>

                            <Text style={{
                                color: COLORS.white,
                                ...FONTS.h3
                            }}>{item.title}</Text>


                        </View>


                    </TouchableOpacity>
                )

            })}

        </View>
    )

}

const Market = ({getCoinMarket, coins}) => {

    const scrollX = React.useRef(new Animated.Value(0)).current


    useEffect(() => {
        getCoinMarket()
    }, [])

    function renderTabBar() {
        return (
            <View style={{
                marginTop: SIZES.radius,
                marginHorizontal: SIZES.radius,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.gray
            }}>
                <Tabs

                    scrollX={scrollX}
                />

            </View>

        );
    }

    function renderButtons() {
        return (
            <View style={{
                flexDirection: 'row',
                marginTop: SIZES.radius,
                marginHorizontal: SIZES.radius
            }}>

                <TextButtons label={'USD'}/>
                <TextButtons
                    label={'% (7d)'}
                    containerStyle={{
                        marginLeft: SIZES.base
                    }}/>
                <TextButtons
                    label={'Top'}
                    containerStyle={{
                        marginLeft: SIZES.base

                    }}
                />

            </View>
        );
    }

    function renderList() {
        return (
            <Animated.FlatList
                data={MarketTabs}
                contentContainerStyle={{
                    marginTop: SIZES.padding
                }}
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment={'center'}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                onScroll={
                    Animated.event([

                        {nativeEvent: {contentOffset: {x: scrollX}}}
                    ], {
                        useNativeDriver: false
                    })

                }
                renderItem={({item, index}) => {
                    return (
                        <View style={{
                            flex: 1,
                            width: SIZES.width
                        }}>

                            <FlatList
                                data={coins}
                                keyExtractor={item => item.id}
                                renderItem={({item, index}) => {

                                    const priceColor = (item.price_change_percentage_7d_in_currency = 0) ? COLORS.lightGray3 : (item.price_change_percentage_7d_in_currency > 0) ? COLORS.lightGreen : COLORS.red;


                                    return (
                                        <View style={{
                                            flexDirection: 'row',
                                            paddingHorizontal: SIZES.padding,
                                            marginBottom: SIZES.radius
                                        }}>

                                            {/*Coins*/}
                                            <View style={{
                                                flex: 1.5,
                                                flexDirection: 'row',
                                                alignItems: 'center'
                                            }}>

                                                <Image
                                                    source={{
                                                        uri: item.image
                                                    }}
                                                    style={{
                                                        height: 20,
                                                        width: 20

                                                    }}
                                                />

                                                <Text style={{
                                                    marginLeft: SIZES.radius,
                                                    color: COLORS.white,
                                                    ...FONTS.h3

                                                }}>{item.name}</Text>

                                            </View>

                                            {/*Line Chart*/}

                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center'
                                            }}>

                                                <LineChart
                                                    withVerticalLabels={false}
                                                    withHorizontalLabels={false}
                                                    withDots={false}
                                                    withInnerLines={false}
                                                    withVerticalLines={false}
                                                    withOuterLines={false}
                                                    data={{
                                                        datasets: [
                                                            {
                                                                data: item.sparkline_in_7d.price
                                                            }
                                                        ]
                                                    }}
                                                    width={100}
                                                    height={60}
                                                    chartConfig={{
                                                        color: () => priceColor,
                                                    }}
                                                    bezier
                                                    style={{
                                                        paddingRight: 0
                                                    }}
                                                />
                                            </View>

                                            {/*Figures*/}

                                            <View style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',

                                            }}>


                                                <Text style={{
                                                    color: COLORS.white,
                                                    ...FONTS.h4
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


                                        </View>
                                    )
                                }}

                            />
                        </View>
                    )

                }}


            />

        );
    }

    return (
        <MainLayout>
            <View style={{
                flex: 1,
                backgroundColor: COLORS.black
            }}>

                {/*Header*/}
                <HeaderBar title={'Market'}/>


                {/*Tab Bar*/}
                {renderTabBar()}


                {/*Buttons*/}
                {renderButtons()}


                {/*Market List*/}
                {renderList()}


            </View>
        </MainLayout>
    )
}


function mapStateToProps(state) {
    return {
        coins: state.marketReducer.coins
    }
}


function mapDispatchToProps(dispatch) {
    return {
        getCoinMarket: (currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page) => {
            return dispatch(getCoinMarket(currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Market);
