import React from 'react';
import {View, Animated} from "react-native";

import {connect} from 'react-redux';
import {COLORS, FONTS, icons, SIZES} from "../constants";
import {setTradeModalVisibility} from "../stores/tab/tabActions";
import {IconTextButton} from "../components";


const MainLayout = ({children, isTradeModalVisible}) => {

    const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;


    React.useEffect(() => {
        if (isTradeModalVisible) {
            Animated.timing(modalAnimatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false
            }).start();
        } else {
            Animated.timing(modalAnimatedValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false
            }).start();
        }
    }, [isTradeModalVisible])

    const modalY = modalAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [SIZES.height, SIZES.height - 380]
    })


    return (
        <View style={{
            flex: 1,

        }}>
            {children}


            {/*Dim Background*/}
            {isTradeModalVisible &&
            <Animated.View
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: COLORS.transparentBlack

                }}

            />}


            {/*modal*/}

            <Animated.View style={{
                position: 'absolute',
                left: 0,
                top: modalY,
                width: "100%",
                padding: SIZES.padding,
                backgroundColor: COLORS.primary
            }}>

                <IconTextButton
                    label="Transfer"
                    icon={icons.send}
                    onPress={() => console.warn("transfer")}
                />

                <IconTextButton
                    label="Withdraw"
                    icon={icons.withdraw}
                    containerStyle={{
                        marginTop: SIZES.base
                    }}
                    onPress={() => console.warn("withdraw")}
                />


            </Animated.View>
        </View>
    );
};


function mapStateToProps(state) {
    return {
        isTradeModalVisible: state.tabReducer.isTradeModalVisible
    }
}


function mapDispatchToProps(dispatch) {
    return {}
}


export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
