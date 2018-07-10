const DB = require('../utils/db')

module.exports = {
  list: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movies;")
  },
  detail: async ctx => {
    movieId = + ctx.params.id

    if (!isNaN(movieId)) {
      ctx.state.data = (await DB.query('select * from movies where movies.id = ?', [movieId]))[0]  // 返回数组的第一个元素
    } else {
      ctx.state.data = {}
    }
  }
}