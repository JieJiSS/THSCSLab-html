# THSCSLab-html

## 需要的API：

+ GET /blog/title/<title>
  后端阅读人数+1，同时根据title返回一个对应到相应标题文章的json，格式如下：
  
```javascript
{
    "err": null/错误描述字符串,
    "description": "文章简介，从Markdown渲染好的HTML，字符串，不应有script和object和iframe等危险标签",
    "post_date": "文章发布时间，字符串",
    "author": "文章作者，字符串",
    "main_html": "正文，从Markdown渲染好的HTML，字符串，不应有script和object和iframe等危险标签",
    "read": Number 被阅读次数,
    "vote": Number 被赞同次数
}
```


+ GET /blog/vote/<title>
  给指定title的文章投票，会附带用户Cookie，后端检验Cookie和IP地址防止重复投票。返回json说明操作是否成功：

```javascript
{
  "err": null/错误描述字符串,
  "vote": Number 操作成功后文章被赞同次数
}
```
