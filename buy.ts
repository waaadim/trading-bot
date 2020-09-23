import * as asciichart from 'asciichart'
import {mergeMap, tap} from 'rxjs/operators'
import yargs from 'yargs'
import {buyCoins} from './src/buy-coins/buyCoins'
import {printReport} from './src/dashboard/dashboard'
import {dbConnect} from './src/db/dbConnect'
import {getUnsoldCoins} from './src/db/fetcher/getUnsoldCoins'
import {findInvestmentCandidates} from './src/find-coins/findInvestmentCandidates'

const args = yargs
  .usage('Usage: $0 --dryRun')
  .options({
    dryRun: {
      type: 'boolean',
      description: 'Do not buy or sell, only find.',
      alias: 'd'
    }
  })
  .help('help').alias('help', 'h')
  .argv

dbConnect().then(conn => {
  printReport().subscribe(
    it => console.log(it)
  )

  findInvestmentCandidates({unsoldCoins: getUnsoldCoins()}).pipe(
    tap(it => {
      args.dryRun && it.forEach(({symbol, prices, priceSwing}) => {
        console.log(`${symbol}: ${priceSwing}`)
        console.log(asciichart.plot(prices, {height: 10}))
      })
    }),
    mergeMap(it => args.dryRun ? [] : buyCoins(it)),
    tap(it => {console.log(it, 'done - buying')})
  ).subscribe({
    complete: () => console.log('done - finding')
  })
})