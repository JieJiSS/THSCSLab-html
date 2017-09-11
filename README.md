# THSCSLab-html

## 需要的API：

+ GET /blog?title=<title>
  根据title返回一个对应到相应标题文章的json，格式如下：
  
  ```javascript
  {
    "description": <%-文章简介，从Markdown渲染好的HTML，字符串，不应有script和object和iframe等危险标签%>,
    "post_date": <%=文章发布时间，字符串%>,
    "author": <%=文章作者，字符串%>,
    "main_html": <%-正文，从Markdown渲染好的HTML，字符串，不应有script和object和iframe等危险标签%>
  }
  ```
