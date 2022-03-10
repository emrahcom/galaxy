import { expressHandler } from '@ory/themes/css/express'
import express from 'express'

import { RouteRegistrator } from '../pkg'

export const registerStaticRoutes: RouteRegistrator = (app) => {
  app.get('/theme.css', expressHandler())
  app.use('/', express.static('public'))
  app.use('/', express.static('node_modules/normalize.css'))

  // galaxy redirections
  app.get('/id/login', (_, res) => res.redirect('/login'))
  app.get('/id/logout', (_, res) => res.redirect('/logout'))
  app.get('/id/recovery', (_, res) => res.redirect('/recovery'))
  app.get('/id/registration', (_, res) => res.redirect('/registration'))
  app.get('/id/settings', (_, res) => res.redirect('/settings'))
  app.get('/id/verification', (_, res) => res.redirect('/verification'))
}
