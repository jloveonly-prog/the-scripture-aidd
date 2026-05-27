import { Hono } from 'hono'
import { HomePage } from '../views/home'

export const homeRouter = new Hono()

homeRouter.get('/', (c) => {
  return c.html(<HomePage />)
})
