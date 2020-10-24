import qs from 'qs'
//import axios from 'axios'

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
  binary = 'binary'
}

export interface RequestOptions {
  url: string | RequestOptions,
  method?: Method,
  dataType?: DataType,
  headers?: object,
  responseProcessor?: () => boolean,
  params?: any,
  data?: any
}

function optionsBuilder (method:Method, requestOptions: RequestOptions | string, dataType?:DataType, headers?: object): RequestOptions {
  let options: RequestOptions = {
    method,
    url: requestOptions,
    dataType,
    headers,
    responseProcessor: () => true
  }

  if (typeof requestOptions === 'object') {
    options = (<any>Object).assign ({}, options, requestOptions)
  }

  return options
}

function HttpRequestDecorator (options: RequestOptions): (target: any, name: any) => void {
  console.log (options, 1)
  return (target:any, name:any) => {
    console.log (target, name)
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
