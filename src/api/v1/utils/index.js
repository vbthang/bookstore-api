'use strict'

const _ = require('lodash')

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields)
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUnderfinedObject = obj => {
  console.log(obj)
  Object.keys(obj).forEach( key => {
    if(obj[key] == null) delete obj[key]
  })
  console.log(obj)
  return obj
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUnderfinedObject
}