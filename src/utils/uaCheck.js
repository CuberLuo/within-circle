export const isAppClient = () => {
  const ua = navigator.userAgent
  // match函数返回包含匹配结果的数组
  return ua.includes(import.meta.env.VITE_APP_UA_FLAG)
}
