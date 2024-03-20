export const getServerUrl = () => {
  // const url = 'http://localhost:1029'
  // const url = 'https://api.within-circle.techvip.site'
  const url = import.meta.env.VITE_SOCKET_SERVER
  return url
}
