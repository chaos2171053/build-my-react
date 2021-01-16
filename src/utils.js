export function isArray(ele) {
  return Object.prototype.toString.call(ele) === '[object Array]';
}
export function isObject(ele) {
  return Object.prototype.toString.call(ele) === '[object Object]';
}