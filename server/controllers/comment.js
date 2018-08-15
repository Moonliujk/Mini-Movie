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
      await DB.query('INSERT INTO movie_comment(user, username, useravatar, content, movie_id, type) VALUES (?, ?, ?, ?, ?, ?)', [user, username, avatar, content, movieId, type])
    }

    ctx.state.data = {}
  },
  /**
  * 获取评论列表
  */
  list: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let movieId = +ctx.request.query.movieId

    if (!isNaN(movieId)) {
      commentList = await DB.query('select * from movie_comment where movie_comment.movie_id = ?', movieId)
      userCollectedComment = await DB.query('select * from collect_comment where collect_comment.user = ?', user)
    }

    ctx.state.data = commentList.map(item => {
      item.isSelfComment = item.user === user ? true : false
      /**
       * 判断当前用户所收藏的评论
       */
      item.isCollected = userCollectedComment.some((comment)=> {
        return comment.comment_id === item.id
      }) ? true : false
      return item
    })
    
  },
  /**
* 获取“我”发布的影评
*/
  me: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    let myCommentlist = await DB.query('SELECT movie_comment.username AS `username`, movie_comment.useravatar AS `avatar`, movie_comment.content AS `content`, movie_comment.type AS `type`, movies.title AS `title`, movies.id AS `movie_id` FROM movie_comment LEFT JOIN movies ON movies.id = movie_comment.movie_id WHERE movie_comment.user = ? ORDER BY movie_comment.create_time DESC', [user])

    ctx.state.data = myCommentlist

  },
  /**
   * 用户未登录时，获取的推荐影评
   */
  getOneCommentNotlogin: async ctx => {
    let movieId = +ctx.request.query.movieId
    let commentList = { movieId}

    if (!isNaN(movieId)) {
      // 将非语音评论列表返回
      commentList = await DB.query('select * from movie_comment where movie_comment.movie_id = ? AND movie_comment.type = "text"', movieId)
    }
    return ctx.state.data = commentList

    let length = commentList.length

    if (length > 0) {
      let randomNum = Math.floor(Math.random() * length)

      return ctx.state.data = commentList
    }

    return ctx.state.data = []
  },
  /**
   * 用户登陆后，推荐的影评
   */
  getOneCommentLogin: ctx => {
    return ctx.state.data = []
  },
}