// 指定小数点で丸める
export function roundTo(n, digits=5) {
  return Math.round((n + Number.EPSILON) * 10**digits) / 10**digits;
}
// 許容誤差内で等しいか判定
export function approxEqual(a, b, eps=1e-5) {
  return Math.abs(Number(a) - Number(b)) < eps;
}
// [min, max] の整数乱数
export function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}