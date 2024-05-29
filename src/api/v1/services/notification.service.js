'use strict'

const { NotFoundError } = require('../core/error.response')
const notificationModel = require('../models/notification.model')
const { convertToObjectIdMongodb } = require('../utils')

class NotificationService {
    static async pushNotiToSystem({
        type = 'SHOP-001',
        receivedId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content

        if(type === 'SHOP-001') {
            noti_content = `@@@ vừa mới thêm một sản phẩm: @@@@`
        } else if(type === 'PROMOTION-001') {
            noti_content = `@@@ vừa mới thêm một voucher: @@@@`
        }

        const newNoti = await notificationModel.create({
            noti_type: type,
            noti_content,
            noti_senderId: senderId,
            noti_receivedId: receivedId,
            noti_options: options
        })

        return newNoti
    } 

    static async listNotiByUser({
        userId = '1',
        type = 'ALL',
        isRead = 0
    }) {
        const match = { noti_receivedId: userId }

        if(type !== 'ALL') {
            match['noti_type'] = type
        }

        return await notificationModel.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: {
                        $concat: [
                            {
                                $substr: ['$noti_options.shop_name', 0, -1]
                            },
                            ' vừa mới thêm 1 sản phẩm mới ',
                            {
                                $substr: ['$noti_options.book_name', 0, -1] 
                            }
                        ]
                    },
                    createAt: 1,
                    noti_options: 1,
                }
            }
        ])
    }
}

module.exports = NotificationService