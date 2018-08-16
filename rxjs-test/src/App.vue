<template>
  <div>
    <div>这是一个测试</div>
    <p>vue+axios+rxjs</p>
    <button @click="update$.next()">点击</button>
    <ul v-if="array.length>0">
      <li v-for="(item, i) in array" :key="i">
        <p>{{item.title}}</p>
        <p>{{item.userId}}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { Subject } from 'rxjs'
import { _getData } from './service'
import { mergeMap, take, tap } from 'rxjs/operators'
export default {
  data() {
    return {
      id: 1,
      array: [],
      update$: new Subject(),
    }
  },
  methods: {
    getDataOnce() {
      return _getData(this.id).pipe(take(1))
    },
  },
  created() {
    this.update$.pipe(
      tap(()=>{console.log(112312)}),
      mergeMap(() => this.getDataOnce())
      )
    // let obs = _getData(this.id).subscribe(val => {
    //   console.log(12)
    //   this.array = val.data
    // })
    // _getData(this.id).pipe(take(1)).subscribe((val)=>{
    //   this.array = val.data
    //   console.log('-----12-----')
    // })
    this.update$.subscribe(()=>{console.log(21132)})
  },
}
</script>
