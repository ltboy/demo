import Ajax from './ajax'
import {
  map,
  switchMap,
  shareReplay,
  tap
} from 'rxjs/operators'

import {
  timer
} from 'rxjs'

const url = 'https://jsonplaceholder.typicode.com/posts?userId='

const timer$ = timer(0, 2000)

const timer2$ = timer(0, 5000)

// 设置的缓存
// function _getData(id) {
//   if (!_getData.cache$) {
//     _getData.cache$ = Ajax({
//       url: url + id
//     }).pipe(
//       shareReplay(1)
//     )
//   }
//   return _getData.cache$
// }

export function _getData(id) {
  if (!_getData.cache$) {
    _getData.cache$ = timer2$.pipe(
      switchMap(() => Ajax({
        url: url + id
      })),
      shareReplay(1)
    )
  }
  return _getData.cache$
}



//  模拟每隔 n s请求一次
// export function getData(id) {
//   return timer$.pipe(   
//     switchMap(() => _getData(id)),
//     tap(()=>{console.log('wo lai qu zhi le')})
//   )
// }