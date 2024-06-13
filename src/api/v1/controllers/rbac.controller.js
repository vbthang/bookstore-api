'use strict'

const { SuccessResponse } = require('../core/success.response')
const { createResource, createRole, roleList, resourceList } = require('../services/rbac.service')

/**
 * @desc Create a new role
 * @param {string} name 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
    return new SuccessResponse({
        message: 'created role',
        metadata: await createRole(req.body)
    }).send(res)
}

const newResource = async (req, res, next) => {
    return new SuccessResponse({
        message: 'created role',
        metadata: await createResource(req.body)
    }).send(res)
}

const listRoles = async (req, res, next) => {
    return new SuccessResponse({
        message: 'get list role',
        metadata: await roleList(req.body)
    }).send(res)
}

const listResources = async (req, res, next) => {
    return new SuccessResponse({
        message: 'get list resource',
        metadata: await resourceList(req.body)
    }).send(res)
}

module.exports = {
    newRole,
    newResource,
    listRoles,
    listResources
}