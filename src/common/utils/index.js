import store from '@/store'
/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return store.state.sys.menuNav.indexOf(key) !== -1 || false
}