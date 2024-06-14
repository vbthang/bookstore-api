'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = id => new Types.ObjectId(id)

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

const updateNestedObjectParser = obj => {
  const final = {}
  Object.keys(obj).forEach(k => {
    if( typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k])
      Object.keys(response).forEach( a => {
        final[`${k}.${a}`] = response[a]
      });
    } else {
      final[k] = obj[k]
    }
  })
  console.log(obj)
}

const replacePlaceholder = (template, params) => {
  Object.keys(params).forEach(k => {
    const placeholder = `{{${k}}}`
    template = template.replace(new RegExp(placeholder, 'g'), params[k])
  })

  return template
}

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUnderfinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
  replacePlaceholder
}