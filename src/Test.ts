import {Get} from './httpRequestDecorator'

class Test {
  @Get ({url: 'aaa'})
  testFunc () {
  }
}
