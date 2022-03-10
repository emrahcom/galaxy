import { expressHandler } from '@ory/themes/css/express'
import express from 'express'

import { RouteRegistrator } from '../pkg'


export const registerStaticRoutes: RouteRegistrator = (app) => {
  app.get('/theme.css', expressHandler())
  app.use('/', express.static('public'))
  app.use('/', express.static('node_modules/normalize.css'))

  // galaxy redirections
  const url = require('url')

  app.get('/id/error', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/error?${query}` : `/error`)
  })
  app.get('/id/login', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/login?${query}` : `/login`)
  })
  app.get('/id/logout', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/logout?${query}` : `/logout`)
  })
  app.get('/id/recovery', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/recovery?${query}` : `/recovery`)
  })
  app.get('/id/registration', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/registration?${query}` : `/registration`)
  })
  app.get('/id/settings', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/settings?${query}` : `/settings`)
  })
  app.get('/id/verification', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/verification?${query}` : `/verification`)
  })
  app.get('/id/welcome', (req, res) => {
    const parsed = url.parse(req.url)
    const query = parsed.query
    res.redirect((query ? `/welcome?${query}` : `/welcome`)
  })
}
