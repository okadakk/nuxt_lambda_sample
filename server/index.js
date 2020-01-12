const awsServerlessExpress = require('aws-serverless-express')
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')

// Import and Set Nuxt.js options
const environment = process.env.NODE_ENV || 'local'
config.dev = environment === 'local'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '0.0.0.0',
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  // Health Check
  app.get('/health_check', function(req, res) {
    res.send('Health Check 200!');
  });

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  if (config.dev) {
    app.listen(port, host);
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    });
  }

  return app
}

if (config.dev) {
  start();
}

let server = undefined;
const binaryMimeTypes = [
  'application/javascript',
  'application/json',
  'application/octet-stream',
  'application/xml',
  'font/eot',
  'font/opentype',
  'font/otf',
  'image/x-icon',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'text/comma-separated-values',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/text',
  'text/xml'
]

exports.handler = (event, context) => {
  start().then((app) => {
    if (server === undefined) {
      server = awsServerlessExpress.createServer(app, null, binaryMimeTypes)
    }
    awsServerlessExpress.proxy(server, event, context)
  })
}
