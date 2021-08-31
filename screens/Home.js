import React from 'react';
import {
    View,
    Text
} from 'react-native';
import {MainLayout} from './'
import {BalanceInfo} from "../components";
import {connect} from "react-redux"

import {getHoldings, getCoinMarket} from "../stores/market/marketActions";
import {useFocusEffect} from "@react-navigation/native";
import {SIZES, COLORS, FONTS, dummyData, icons} from "../constants";

const Home = ({getHoldings, getCoinMarket, myHoldings, coins}) => {


    useFocusEffect(
        React.useCallback(() => {
            getHoldings(holdings = dummyData.holdings)
            getCoinMarket()
        }, [])
    )

    let totalWallet = myHoldings.reduce((a, b) => a + (b.total || 0), 0)


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
                    changePct={2.30}
                    containerStyle={{
                        marginTop: 50
                    }}

                />


            </View>

        );
    }

    return (
        <MainLayout>
            <View style={{flex: 1, backgroundColor: COLORS.black}}>

                {/*header*/}
                {renderWalletInfoSections()}

                {/*chart*/}


                {/*top currency*/}
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
        getHoldings: (holdings, currency, coinList, orderBy,
                      sparkline, priceChangePerc, perPage, page) => {
            return dispatch(getHoldings(holdings, currency, coinList, orderBy,
                sparkline, priceChangePerc, perPage, page))
        },
        getCoinMarket: (currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page) => {
            return dispatch(getCoinMarket(currency, coinList, orderBy, sparkline, priceChangePerc, perPage, page))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
