'use strict'

const { NotFoundError } = require('../core/error.response')
const Comment = require('../models/comment.model')
const { convertToObjectIdMongodb } = require('../utils')
const { findBook } = require('../models/repositories/book.repo')

class CommentService {
    static async createComment({
        bookId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_bookId: bookId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })
        
        let rightValue
        if(parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) {
                throw new NotFoundError('Parent comment not found')
            } 

            rightValue = parentComment.comment_right
            // update
            await Comment.updateMany({
                comment_bookId: convertToObjectIdMongodb(bookId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: {comment_right: 2}
            })

            await Comment.updateMany({
                comment_bookId: convertToObjectIdMongodb(bookId),
                comment_left: {$gt: rightValue}
            }, {
                $inc: {comment_left: 2}
            })
        } else {
            const maxRightValue = await Comment.findOne({
                comment_bookId: convertToObjectIdMongodb(bookId),
            }, 'comment_right', {sort: {comment_right: -1}})
            
            if(maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()

        return comment
    }

    static async getCommentsByParentId({
        bookId,
        parentCommendId = null,
        limit = 50,
        offset = 0 //skip
    }) {
        if(parentCommendId) {
            const parent = await Comment.findById(parentCommendId)
            if(!parent) throw new NotFoundError('Not found comment for product')
        
            const comments = await Comment.find({
                comment_bookId: convertToObjectIdMongodb(bookId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await Comment.find({
            comment_bookId: convertToObjectIdMongodb(bookId),
            comment_parentId: parentCommendId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static async deleteComments({
        commentId,
        bookId
    }) {
        // Check the book exists in the db
        const foundBook = await findBook({
            book_id: bookId
        })
        if(!foundBook) throw new NotFoundError('Book not found!')

        const comment = await Comment.findById(commentId)
        if(!comment) throw new NotFoundError('Comment not found!')

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        // Cal width
        const width = rightValue - leftValue + 1
        // Del comment in width
        await Comment.deleteMany({
            comment_bookId: convertToObjectIdMongodb(bookId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })
        // Update value left right for rest
        await Comment.updateMany({
            comment_bookId: convertToObjectIdMongodb(bookId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: {comment_left: -width}
        })

        await Comment.updateMany({
            comment_bookId: convertToObjectIdMongodb(bookId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: {comment_right: -width}
        })

        return true
    }
}

module.exports = CommentService