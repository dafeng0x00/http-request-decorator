import qs from 'qs';
import axios from 'axios';
export var Method;
(function (Method) {
    Method["get"] = "get";
    Method["post"] = "post";
    Method["put"] = "put";
    Method["delete"] = "delete";
})(Method || (Method = {}));
export var DataType;
(function (DataType) {
    DataType["formData"] = "form-data";
    DataType["formUrlEncode"] = "x-www-form-urlencoded";
    DataType["raw"] = "raw";
    DataType["binary"] = "binary";
    DataType["json"] = "json";
    DataType["path"] = "path";
})(DataType || (DataType = {}));
function optionsBuilder(method, requestOptions, dataType, headers) {
    let options = {
        method,
        url: '',
        dataType,
        headers
    };
    if (typeof requestOptions === 'object') {
        options = Object.assign({}, options, requestOptions);
    }
    else if (typeof requestOptions === 'string') {
        options.url = requestOptions;
    }
    if (typeof options.url !== 'string' || options.url.trim() == '') {
        throw new Error('invalid url');
    }
    if (!method) {
        options.method = Method.get;
    }
    if (!dataType && !options.dataType) {
        options.dataType = DataType.formData;
    }
    return options;
}
function requestParamBuilder(options, requestParam) {
    if (typeof requestParam !== 'undefined' && typeof requestParam !== 'object') {
        throw new Error('request params must be object');
    }
    if (options.method == Method.get) {
        if (options.dataType === DataType.path && Array.isArray(requestParam)) {
            const extraPath = requestParam.join('/');
            options.url = options.url + (options.url.substr(options.url.length - 1, 1) != "/" ? "/" : "") + extraPath;
        }
        else {
            options.params = {
                ...requestParam
            };
        }
    }
    else if (options.method == Method.post || options.method == Method.put ||
        options.method == Method.delete) {
        if (options.dataType === DataType.formData) {
            options.data = qs.stringify(requestParam);
        }
        if (options.dataType === DataType.json) {
            options.data = { ...requestParam };
        }
    }
    return options;
}
function HttpRequestDecorator(options) {
    return (target, name, decorator) => {
        const handler = decorator.value;
        decorator.value = (requestParam) => {
            return new Promise((resolve, reject) => {
                axios.request(requestParamBuilder(options, requestParam))
                    .then(response => {
                    const params = {
                        resolve,
                        reject,
                        response,
                        data: response.data,
                        responseData: response.data,
                        requestParam
                    };
                    const responseHandler = options.responseHandler || target['responseHandler'];
                    if (typeof responseHandler === 'function' &&
                        responseHandler.call(target, { responseData: params.data, requestParam }) === false) {
                        reject(params.data);
                    }
                    const result = handler.call(target, params);
                    if (typeof result !== 'undefined') {
                        resolve(result);
                    }
                })
                    .catch(reject);
            });
        };
    };
}
export function Get(options, headers) {
    return HttpRequestDecorator(optionsBuilder(Method.get, options, undefined, headers));
}
export function Post(options, dataType, headers) {
    return HttpRequestDecorator(optionsBuilder(Method.post, options, dataType, headers));
}
export function Put(options, dataType, headers) {
    return HttpRequestDecorator(optionsBuilder(Method.put, options, dataType, headers));
}
export function Delete(options, dataType, headers) {
    return HttpRequestDecorator(optionsBuilder(Method.delete, options, dataType, headers));
}
export default HttpRequestDecorator;
