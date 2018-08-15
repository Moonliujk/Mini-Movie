const DB = require('../utils/db')

module.exports = {

  /**
   * 收藏评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentId = +ctx.request.body.commentId

    if (!isNaN(commentId)) {
      await DB.query('INSERT INTO collect_comment(user, comment_id) VALUES (?, ?)', [user, commentId])
    }
  },
  /**
  * 获取收藏列表
  */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let list = await DB.query('SELECT collect_comment.comment_id AS `id`, movie_comment.username AS `username`, movie_comment.useravatar AS `avatar`, movie_comment.content AS `content`, movie_comment.type AS `type`, movies.title AS `title`, movies.id AS `movie_id` FROM movie_comment LEFT JOIN collect_comment ON collect_comment.comment_id = movie_comment.id LEFT JOIN movies ON movies.id = movie_comment.movie_id WHERE collect_comment.user = ? ORDER BY collect_comment.create_time DESC' , [user])

    // 将数据库返回的数据组装成页面呈现所需的格式

    let ret = []
    let id = 0

    list.forEach(item => {
      item.isCollected = true
      
      ret.push(item)
    })

    ctx.state.data = ret
  },
  /**
   * 删除收藏
   */
  remove: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentId = +ctx.request.body.commentId

    if (!isNaN(commentId)) {
      await DB.query('DELETE FROM collect_comment WHERE collect_comment.user = ? AND collect_comment.comment_id = ?', [user, commentId])
    }
  },
}