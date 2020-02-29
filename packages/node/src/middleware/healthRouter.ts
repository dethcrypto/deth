import Router from 'koa-router'

export function healthRouter () {
  const router = new Router()

  router.get('/health', async ctx => {
    ctx.body = { status: 'OK' }
  })

  return router
}
