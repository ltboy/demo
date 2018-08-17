<template>
  <div>
    <div>这是一个测试</div>
    <p>vue+axios+rxjs</p>
    <button @click="forceReload">点击</button>
    <p v-if="showNote"  @click="update$.next()">有更新了！~~~~~~~~</p>
    <ul v-if="array.length>0">
      <li v-for="(item, i) in array" :key="i">
        <p>{{item.id}}</p>
        <p>{{item.joke}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { Subject, merge } from 'rxjs'
import { _getData, reload } from './service'
import { mergeMap, take, tap, skip, mapTo, switchMap } from 'rxjs/operators'
export default {
  data() {
    return {
      id: 1,
      array: [],
      update$: new Subject(),
      showNote: false,
      forceReload$: new Subject(),
    }
  },
  methods: {
    getDataOnce() {
      return _getData(this.id).pipe(take(1))
    },
    forceReload() {
      reload()
      this.forceReload$.next()
    },
    getNotifications() {
      return _getData().pipe(skip(1))
    },
  },
  created() {
    const update$ = merge(this.update$, this.forceReload$).pipe(mergeMap(() => this.getDataOnce()))

    const initialJokes$ = this.getDataOnce()

    const jokes$ = merge(update$, initialJokes$)
    jokes$.subscribe(val => {
      this.array = val.data.value
    })

    const reload$ = this.forceReload$.pipe(switchMap(() => this.getNotifications()))

    const show$ = merge(this.getNotifications(), reload$).pipe(mapTo(true))
    const hide$ = this.update$.pipe(mapTo(false))
    const showNote = merge(show$, hide$)
    showNote.subscribe(val => (this.showNote = val))
  },
}
</script>
