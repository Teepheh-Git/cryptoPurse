import axios from 'axios';


export const GET_HOLDINGS_BEGIN = "GET_HOLDINGS_BEGIN"
export const GET_HOLDINGS_SUCCESS = "GET_HOLDINGS_SUCCESS"
export const GET_HOLDINGS_FAILURE = "GET_HOLDINGS_FAILURE"


export const GET_COIN_MARKET_BEGIN = "GET_COIN_MARKET_BEGIN"
export const GET_COIN_MARKET_SUCCESS = "GET_COIN_MARKET_SUCCESS"
export const GET_COIN_MARKET_FAILURE = "GET_COIN_MARKET_FAILURE"


// Holdings / my holdings to

export const getHoldingsBegin = () => ({
    type: GET_HOLDINGS_BEGIN
})

export const getHoldingsSuccess = (myHoldings) => ({
    type: GET_HOLDINGS_SUCCESS,
    payload: {myHoldings}
});
export const getHoldingsFailure = (error) => ({
    type: GET_HOLDINGS_FAILURE,


    payload: {error}
})

export function getHoldings(holdings = [], currency = "usd", orderBy = "market_cap_desc", sparkline = true, priceChangePerc = "7d", perPage = 10, page = 1) {
    return dispatch => {
        dispatch(getHoldingsBegin())


        let ids = holdings.map((item) => {
            return item.id
        }).join(',')

        let apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=${orderBy}&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePerc}&ids=${ids}`

        return axios({
            url: apiUrl,
            method: `GET`,
            headers: {
                Accept: "application/json"
            }
        }).then((response) => {
            if (response.status === 200) {
                // massage data
                let myHoldings = response.data.map((item) => {

                    //    retrieve our current holdings to  get the current quantity
                    let coin = holdings.find(a => a.id === item.id)

                    //    price from seven days ago

                    let price7d = item.current_price / (1 + item.price_change_percentage_7d_in_currency * 0.01)


                    return {
                        id: item.id,
                        symbol: item.symbol,
                    }

                })
            } else {
                dispatch(getHoldingsFailure(response.data))
            }
        }).catch(error => {
            dispatch(getHoldingsFailure(error))
        })

    }

}

//Coin market