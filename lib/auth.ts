import Cookies from 'js-cookie'

export function getToken() {
  return Cookies.get('micare_token')
}

export function setToken(token: string) {
  Cookies.set('micare_token', token, { expires: 1 })
}

export function removeToken() {
  Cookies.remove('micare_token')
}

export function isAuthenticated() {
  return !!getToken()
}
