// 简单的路由系统
import { ref } from 'vue'

export const currentRoute = ref(window.location.pathname)

export function navigateTo(path) {
  window.history.pushState({}, '', path)
  currentRoute.value = path
}

// 监听浏览器前进后退
window.addEventListener('popstate', () => {
  currentRoute.value = window.location.pathname
})

// 路由匹配函数
export function matchRoute(pattern) {
  const path = currentRoute.value
  
  if (pattern === '/') {
    return path === '/' || path === '/index.html'
  }
  
  if (pattern === '/download') {
    return path.startsWith('/download')
  }
  
  if (pattern === '/view') {
    return path.startsWith('/view')
  }
  
  return path === pattern
}

// 获取路由参数
export function getRouteParams() {
  const path = currentRoute.value
  const searchParams = new URLSearchParams(window.location.search)
  
  // 从路径中提取参数
  if (path.startsWith('/download/')) {
    const id = path.split('/download/')[1]
    return { id }
  }
  
  // 从查询参数中提取
  const params = {}
  for (const [key, value] of searchParams) {
    params[key] = value
  }
  
  return params
}