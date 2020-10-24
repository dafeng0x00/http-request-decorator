//import qs from 'qs'
//import axios from 'axios'
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
})(DataType || (DataType = {}));
function optionsBuilder(method, requestOptions, dataType, headers) {
    let options = {
        method,
        url: requestOptions,
        dataType,
        headers,
        responseProcessor: () => true
    };
    if (typeof requestOptions === 'object') {
        options = Object.assign({}, options, requestOptions);
    }
    return options;
}
function HttpRequestDecorator(options) {
    console.log(options, 1);
    return (target, name) => {
        console.log(target, name);
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
