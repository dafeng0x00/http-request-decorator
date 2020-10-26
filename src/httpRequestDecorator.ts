import qs from 'qs'
import axios from 'axios'

export enum Method {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

export enum DataType {
  formData = 'form-data',
  formUrlEncode = 'x-www-form-urlencoded',
  raw = 'raw',
  binary = 'binary',
  json = 'josn'
}

export interface RequestOptions {
  url: string,
  method?: Method,
  dataType?: DataType,
  headers?: object,
  responseHandler ?: (responseData: any) => boolean,
  params?: any,
  data?: any
}

function optionsBuilder (method:Method, requestOptions: RequestOptions | string, dataType?:DataType, headers?: object): RequestOptions {
  let options: RequestOptions = {
    method,
    url: '',
    dataType,
    headers,
    responseHandler: () => true
  }

  if (typeof requestOptions === 'object') {
    options = (<any>Object).assign ({}, options, requestOptions)
  } else if (typeof requestOptions === 'string') {
    options.url = requestOptions
  }

  if (typeof options.url !== 'string' || options.url.trim () == '') {
    throw new Error ('invalid url')
  }

  if (!method) {
    options.method = Method.get
  }

  if (!dataType) {
    options.dataType = DataType.formData
  }

  return options
}

function requestParamBuilder (options: RequestOptions, requestParam: any): RequestOptions {
  if (typeof requestParam !== 'undefined' && typeof requestParam !== 'object') {
    throw new Error ('request param must be object')
  }

  if (options.method == Method.get) {
    options.params = {
      ...requestParam
    }
  } else if (options.method == Method.post || options.method == Method.put  ||
    options.method == Method.delete) {
    if (options.dataType === DataType.formData) {
      options.data = qs.stringify (requestParam)
    }

    if (options.dataType === DataType.json) {
      options.data = {...requestParam}
    }
  }

  return options
}

function HttpRequestDecorator (options: RequestOptions): (target: any, name: string, decorator: any) => void {
  return (target: any, name: string, decorator: any) => {
    const handler = decorator.value
    decorator.value = (requestParam: any) => {
      return new Promise ((resolve, reject) => {
        axios.request (requestParamBuilder (options, requestParam))
          .then (response => {
            const params = {
              resolve,
              reject,
              response,
              data: response.data,
              responseData: response.data
            }

            if (typeof options.responseHandler === 'function' &&
                options.responseHandler (params.data) === false ) {
                reject (params.data)
            }

            const result = handler.call (target, params)
            if (typeof result !== 'undefined') {
              resolve (result)
            }
          })
          .catch (reject)
      })
    }
  }
}

export function Get (options: RequestOptions | string, headers?: object) {
  return HttpRequestDecorator (optionsBuilder (Method.get, options, undefined, headers))
}

export function Post (options: RequestOptions | string, dataType?: DataType, headers?: object) {
  return HttpRequestDecorator (optionsBuilder (Method.post, options, dataType, headers))
}

export function Put (options: RequestOptions | string, dataType?: DataType, headers?: object) {
  return HttpRequestDecorator (optionsBuilder (Method.put, options, dataType, headers))
}

export function Delete (options: RequestOptions | string, dataType?: DataType, headers?: object) {
  return HttpRequestDecorator (optionsBuilder (Method.delete, options, dataType, headers))
}

export default HttpRequestDecorator
