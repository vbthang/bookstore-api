'use strict'

const { SuccessResponse } = require('../core/success.response')

const dataProfiles = [
    {
        usr_id: 1,
        usr_name: 'CR7',
        usr_avt: 'image.com/user/1'
    },
    {
        usr_id: 2,
        usr_name: 'Messi',
        usr_avt: 'image.com/user/2'
    },
    {
        usr_id: 3,
        usr_name: 'Neymar',
        usr_avt: 'image.com/user/3'
    },
    {
        usr_id: 4,
        usr_name: 'Mbappe',
        usr_avt: 'image.com/user/4'
    },
    {
        usr_id: 5,
        usr_name: 'Salah',
        usr_avt: 'image.com/user/5'
    },
    {
        usr_id: 6,
        usr_name: 'Kane',
        usr_avt: 'image.com/user/6'
    },
    {
        usr_id: 7,
        usr_name: 'Lewandowski',
        usr_avt: 'image.com/user/7'
    },
    {
        usr_id: 8,
        usr_name: 'De Bruyne',
        usr_avt: 'image.com/user/8'
    },
    {
        usr_id: 9,
        usr_name: 'Kante',
        usr_avt: 'image.com/user/9'
    },
    {
        usr_id: 10,
        usr_name: 'Ramos',
        usr_avt: 'image.com/user/10'
    }
]

class ProfileController {
    // admin
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'view all profiles',
            metadata: dataProfiles
        }).send(res)
    }

    // shop
    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'view own profile',
            metadata: dataProfiles[0]
        }).send(res)
    }
}

module.exports = new ProfileController()