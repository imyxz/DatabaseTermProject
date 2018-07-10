//express-template https://github.com/imyxz/express-template
const Database = require('./database');
let Config
const Router = require('./router')
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const ConfigLoader = require('./configLoader');
const hotSwapping = require('./hotSwapping');
const ExpressAsyncWrapper = require('./ExpressAsyncWrapper');
const Errors = require('./Utils/Errors');
(async function (){
  Config = ConfigLoader()
  //expose to global to convenient for require module
  global._require = hotSwapping._require
  global.watchRequire = hotSwapping.watchRequire
  const RouterBaseDir = path.resolve(__dirname, 'Route')
  console.info("Loading Models....")
  const DB = await Database(Config);
  console.info("Done!\n")
  const context = {
    Model: DB.models,
    Defination: DB.definations,
    Sequelize: DB.sequelize,
    Config,
    Wrapper: ExpressAsyncWrapper,
    Errors
  }
  console.info("Loading Routes....")
  let [router, routerTree] = await Router(RouterBaseDir, context)
  console.info(routerTree)
  console.info("Done!\n")
  let app = express()
  app.use('/', router)
  app.listen(Config.server.port, () => {
    console.info(`Server started at http://localhost:${Config.server.port}${Config.server.prefix || '/'}`)
  })
})()
