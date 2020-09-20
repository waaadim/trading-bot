import * as asciichart from 'asciichart'
import {of} from 'rxjs'
import {marbles} from 'rxjs-marbles'
import {config} from '../config/config'
import {calculateHowManyOfEachCoinsToBuy, getFundsToInvest} from './buyCoins'

describe(calculateHowManyOfEachCoinsToBuy, function () {
  it('returns how much to buy', function () {
    const symbolsToBuy = ['a', 'b']
    const coinPrices = {
      'a': 1,
      'b': 2,
      'c': 3
    }
    expect(calculateHowManyOfEachCoinsToBuy({
      fundsToInvest: 6,
      coinsToBuy: symbolsToBuy,
      coinPrices
    }))
      .toEqual({
        a: 3,
        b: 1
      })
  })
  it('returns empty object if not enough funds', function () {
    const symbolsToBuy = ['a', 'b']
    const coinPrices = {
      'a': 2,
      'b': 2,
      'c': 1
    }
    expect(calculateHowManyOfEachCoinsToBuy({
      fundsToInvest: 1,
      coinsToBuy: symbolsToBuy,
      coinPrices
    }))
      .toEqual({})
  })
  it('returns empty object if there are no symbols to buy', function () {
    const symbolsToBuy: any = []
    const coinPrices = {
      'a': 2,
      'b': 2,
      'c': 1
    }
    expect(calculateHowManyOfEachCoinsToBuy({
      fundsToInvest: 1,
      coinsToBuy: symbolsToBuy,
      coinPrices
    }))
      .toEqual({})
  })
})

jest.mock('../binance/binance', () => ({
    getBalanceForCoin: jest.fn(() => of(0.5))
  })
)

describe(getFundsToInvest, function () {
  it('returns amount to invest', marbles(m => {
    m.expect(getFundsToInvest(config.percentToInvest)).toBeObservable('(a|)', {
      a: 0.003
    })
  }))
})

describe('config - buying coins', function () {
  it('make sure the investemts are spread enough', function () {
    let i = 0, amount = 12000, percent = 0.006
    while (true) {
      if (amount < 1000) {
        break
      }
      amount -= amount * percent
      i += 1
    }
    // console.log(i, amount)
    expect(i > 365).toBeTruthy()
  })
})
