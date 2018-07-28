const DB = require('../utils/db')

module.exports = {

  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let type = ctx.request.body.type

    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO movie_comment(user, username, avatar, content, movie_id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, movieId, type])
    }

    ctx.state.data = {}
  },
  /**
  * 获取评论列表
  */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let movietId = +ctx.request.query.movieId

    if (!isNaN(movietId)) {
      list = await DB.query('select * from movie_comment where movie_comment.movie_id = ?', movietId)
    } else {
      ctx.state.data = []
    }

    ctx.state.data = list.map(item => {
      item.isSelfComment = item.user === user ? true : false
      return item
    })
    
  },
}