import Ajax from './ajax'
import { map, switchMap, shareReplay, tap, takeUntil } from 'rxjs/operators'

import { timer, Subject, Observable } from 'rxjs'

const url = 'https://api.icndb.com/jokes/random/5?limitTo=[nerdy]'

let timer2$ = timer(0, 20000)

let reload$ = new Subject()
let cache$ = undefined

export function _getData(id) {
  if (!cache$) {
    cache$ = timer2$.pipe(
      switchMap(() => Ajax({ url })),
      takeUntil(reload$),
      shareReplay(1)
    )
  }
  return cache$
}
export function reload() {
  reload$.next()
  cache$ = null
}
