import {map, tap} from 'rxjs/operators'
import {buyCoins} from './src/buy-coins/buyCoins'
import {printReport} from './src/dashboard/dashboard'
import {dbConnect} from './src/db/dbConnect'
import {findInvestmentCandidates} from './src/find-coins/findInvestmentCandidates'

initApp().then(conn => {
  runApp()
})

async function initApp() {
  await dbConnect()
}

function runApp() {
  findInvestmentCandidates().pipe(
    // map(it => buyCoins(it)),
    tap(it => {console.log(it)})
  ).subscribe()

  printReport().subscribe(
    it => console.log(it)
  )
}
