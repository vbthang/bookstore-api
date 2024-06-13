'use strict'

const rbac = require('./role.middleware')
const { AuthFailureError } = require('../core/error.response')
const { roleList } = require('../services/rbac.service')

/**
 * 
 * @param {string} action // read, delete, update
 * @param {*} resource // profile, balance,...
 */
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {

            rbac.setGrants(await roleList({
                userId: 999
            }))

            const rol_name = req.query.role;
            const permission = rbac.can(rol_name)[action](resource)
            if(!permission.granted) {
                throw new AuthFailureError('You dont have enough permissions...')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = {
    grantAccess
}