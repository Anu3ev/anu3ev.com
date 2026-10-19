export default defineNuxtRouteMiddleware((to) => {
  if (to.params.lang && to.params.lang !== 'ru') {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' })
  }
})
