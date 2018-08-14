# 微信小程序——Mini Movie

## 项目概览

- <a href="#presentation">成品展示</a>
- <a href="#how-to-use">如何使用</a>
- <a href="#front-end-page">前端实现</a>
- <a href="#back-end-structure">后端实现</a>

## 成品展示<a id="presentation"/>

本项目为Udacity微信小程序纳米学位课程项目。主要页面包括**推荐电影页面、电影列表展示、电影详情、编辑影评、 影评列表，收藏影评页面等**。

| 效果图 |
| :---: |
| <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/presentation_1.gif" width="250px">  <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/presentation_2.gif" width="250px">  <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/presentation_3.gif" width="250px"> |

## 如何使用<a id="how-to-use"/>

由于项目并未正式上线，故在手机端需打开调试模式。使用者需将项目及配套资源下载到本地，将 [data.sql](https://github.com/Moonliujk/Mini-Movie/blob/master/data.sql) 导入数据库然后进行使用。**注意：该小程序暂不支持全面屏**

## 前端实现<a id="front-end-page"/>
<table>
  <thead>
    <tr>
      <th>界面展示</th>
      <th>功能介绍</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/index_page.PNG" width="250px">
        <br/>
        <b>入口界面</b>
      </td>
      <td>
        <ul>
          <li>用户可通过单击 <code>热门电影</code> 进入 <b>电影列表</b> 界面</li>
          <li>用户可通过单击 <code>我的收藏</code> 进入 <b>收藏影评</b> 界面</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/my_collected.PNG" width="250px">
        <br/>
        <b>我的收藏</b>
      </td>
      <td>
        <ul>
          <li>用户可通过单击收藏按钮，收藏/取消收藏相应的影评</li>
          <li>用户可通过单击任意影评查看影评详情</li>
          <li>用户可通过单击电影名，进入到相关电影的 <b>评论界面</b></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/my_collected.PNG" width="250px">
        <br/>
        <b>收藏影评界面</b>
      </td>
      <td>
        <ul>
          <li>用户可通过单击收藏按钮，收藏/取消收藏相应的影评</li>
          <li>用户可通过单击任意影评查看影评详情</li>
          <li>用户可通过电影名，进入到相关电影的 <b>评论界面</b></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/movie_list.PNG" width="250px">
        <br/>
        <b>电影列表界面</b>
      </td>
      <td>
        <ul>
          <li>用户可通过左右滑动，浏览全部电影及概览</li>
          <li>用户可通过单击任意电影卡片下方的 <code>电影详情</code>，进入到相应 <b>电影详情界面</b></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/movie_detail.PNG" width="250px">
        <br/>
        <b>电影详情界面</b>
      </td>
      <td>
        <ul>
          <li>用户可在详情界面查看电影的详细信息（电影类别、评分及简介等）</li>
          <li>用户可通过单击 <code>播放图标</code>，播放电影的预告片</li>
          <li>用户可以通过单击 <code>查看影评</code>，进入 <b>影评列表页面</b></li>
          <li>用户可以通过单击 <code>编辑影评</code>，进入 <b>编辑评论页面</b></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/movie_comment.PNG" width="250px">
        <br/>
        <b>编辑影评界面</b>
      </td>
      <td>
        <ul>
          <li>用户可选择：<b>语音评论</b> 或者 <b>文字评论</b>，发表自己的影评</li>
          <li>添加语音评论：用户通过按住 <code>录音图片</code> 开始录音，进度条提示剩余时间（最大录音时长1min），松开图标即可停止录音</li>
          <li>添加文字评论：用户单击底部 <b>转为文字评论</b>，即可切换到文字评论界面，通过键盘输入即可编辑文字影评</li>
          <li>预览评论及发表：用户单击底部 <code>预览评论</code>，即可查看正在编辑的影评，确认无误后即可
            单击 <code>发表评论</code> 将评论发表，也可单击 <code>重新编辑</code> 再次编辑影评</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <img src="https://github.com/Moonliujk/imageBaseForArticle/raw/master/wmp-mini_movie/movie_comment_list.gif" width="250px">
        <br/>
        <b>影评列表界面</b>
      </td>
      <td>
        <ul>
          <li>用户可查看全部影评，对于感兴趣的影评进行相关操作（收藏/取消收藏）</li>
          <li>通过单击影评，用户可查看该影评的详情</li>
          <li>当文字评论大于5条时，页面底部会出现 <code>弹幕列表</code> 按钮，用户单击后会将所有文字评论以弹幕的形式显示</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## 后端实现<a id="back-end-structure"/>

这一部分主要借助小程序提供的wafer2 SDK 实现对于数据库资源的请求访问，主要的**数据表**结构如下：

**movies 电影资源**

| 键名 | key | 类型 |
| :---: | :---: | :---: |
| id | id | int(11) —— 自增键 |
| 电影名 | title | varchar(255) |
| 评分 | score | varchar(255) |
| 年份 | year | varchar(255) |
| 海报 | image | varchar(255) |
| 缩略图 | thumbnail | varchar(255) |
| 预告片 | video | varchar(255) |
| 电影类别 | category | varchar(255) |
| 简介 | description | TEXT CHARACTER |
| 创建时间 | create_time | datetime —— 自动生成 |

**movie_comment 影评资源**

| 键名 | key | 类型 |
| :---: | :---: | :---: |
| id | id | int(11) —— 自增键 |
| 用户 | user | varchar(255) |
| 用户名 | username | varchar(255) |
| 用户头像 | useravatar | varchar(255) |
| 用户评论 | content | utf8mb4_unicode_ci |
| 电影id | movie_id | int(11) —— 与 `movies` 表中的 id 关联 |
| 评论类别 | type | varchar(255) |
| 创建时间 | create_time | datetime —— 自动生成 |

**collect_comment 收藏评论资源**

| 键名 | key | 类型 |
| :---: | :---: | :---: |
| id | id | int(11) —— 自增键 |
| 用户 | user | varchar(255) |
| 评论id | comment_id | int(11) —— 与 `movie_comment` 中的 id 关联 |
| 创建时间 | create_time | datetime —— 自动生成 |


