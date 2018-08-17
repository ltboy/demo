import axios from 'axios'
import { Observable } from 'rxjs'

const Ajax = req =>
  new Observable(o => {
    const source = axios.CancelToken.source()

    o.add(() => source.cancel('请求取消了'))

    axios({ ...req, cancelToken: source.token })
      .then(response => {
        o.next(response)
        o.complete('completed')
      })
      .catch(err => {
        o.error(err)
      })
  })

export default Ajax
