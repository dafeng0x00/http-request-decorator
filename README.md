# http-request-decorator
simple http request decorator   

# Usage 
Service.js
```js
import {API_STATUS_SUCCESS} from '@/constants/APIStatus'

export default class Service {
  responseHandler ({responseData: {code} /*restful data*/}) {
    if (typeof code == 'undefined' || code.toString () != API_STATUS_SUCCESS) {
      return false
    }
  }
}
```

UserService.js
```js
import Service from './Service'
import {Get, Post, Delete, Put} from '@ezfe/http-request-decorator'


export default class UserService extends Service {
  @Get ('/example/user/info')
  getInfo ({responseData:{code, result} /*restful data*/, reject, resolve, requestParam}) {
    return result
  }
}
```

example.js
```js
import UserService from '@/services/UserService'
const userService = new UserService ()
userService.getInfo ({userId: query('userId')})
  .then (info => console.log (info))
```
