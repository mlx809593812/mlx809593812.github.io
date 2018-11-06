---
layout: post
title:  "第三方登陆实践之基于OAuth的FACEBOOK Web Login（最新版）"
categories: 网络与信息安全
tags: 网络与信息安全 OAuth2.0 SpringSecurity
author: Jeffrey
---

* content
{:toc}

# Facebook 登录简介
Facebook 登录是在多个平台供用户创建帐户并登录应用的便捷方式。它可用于 iOS、Android、Web、Windows Phone、桌面应用和智能电视、物联网对象等设备。

Facebook 登录功能可打造以下体验：

 - 创建帐户 
Facebook登录让用户能够快速轻松地在应用内创建帐户，无需设置密码，避免今后忘记密码的麻烦。这一简单方便的体验可以产生更高的转化量。用户在一个平台上创建帐户后，通常只需轻轻一点就可以在所有其他平台上登录应用。获得有效的邮箱信息意味着您可以在今后联系相关用户，重新吸引他们使用应用。
   
 - 个性化 
  对于用户来说，个性化体验更具吸引力，因而能够产生更高的留存率。使用 Facebook登录功能，您可以获得难以通过注册表单收集或收集起来很麻烦的信息。即便只是将 Facebook 头像导入应用，也会加强用户对应用的归属感。
  
 - 社交 
 许多用户留存率高的应用都让用户能够与他们的好友建立联系，促进应用内体验的分享。通过 Facebook登录功能，您可以了解哪些应用用户相互之间也是 Facebook 好友，以便连接用户，创造价值。

众多在应用中部署了 Facebook 登录的开发者实现了卓越成效，包括应用登录人数大增，参与度提升，使用 Facebook 登录的用户数量持续增长。 
本文主要介绍利用 JavaScript SDK 部署网页版“Facebook 登录”，将Facebook登陆应用于Web网页。

# Facebook登陆实践
## 1.首先，登陆[Facebook开发者平台](https://developers.facebook.com/)注册账号。
官网链接已经给出，注册一个开发者账号即可。
## 2.然后，新建应用APP
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031100954343.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
创建好新应用后可以看到自己的应用编号和应用密钥，后面写代码需要用。
在APP基本设置里面，填写必要的信息，联系邮箱、应用域名、隐私权政策网址、商业用途和类别、以及Web网站的地址，如果是本地开发环境，可以这样填：http://localhost:XXXX/XXXX
隐私权政策网址当时试了几个URL都没成功，后来发现填这个是可以的：http://wp4fb.com/how-to-add-a-privacy-policy-to-your-apps/
## 3.在应用APP中的产品（PRODUCTS）添加Facebook登陆（Facebook Login）
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031101013384.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)

Facebook登陆设置里面，填写必要的信息，然后发布应用APP。
有一点需要注意，Facebook规定自2018 年 10 月 6 日起，所有应用都需要使用 HTTPS（HTTPS协议更加的安全）。即对跳转 URI 和 JavaScript SDK 强制使用 HTTPS。
如果你是在本地开发环境下工作，那么需要给localhost添加SSL证书并实现HTTPS，此篇就不会详细介绍了。
APP上线成功如下图所示。
<center><img src="https://img-blog.csdnimg.cn/20181031101022866.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70" width = 60% height = 60% /></center>

## 4.部署网页版Facebook 登录

通过采用 JavaScript 版 Facebook SDK 的“Facebook 登录”，用户可以使用 Facebook 登录信息登录您的网页。

实施登陆功能步骤
 - 输入跳转网址，让用户跳转到 successful-login 页面。
 - 检查登录状态，了解用户是否已登录您的应用。
 - 通过“登录”按钮或“登录”对话框让用户登录，并请求一系列数据权限。 让用户退出，允许用户离开应用。

①输入跳转网址
在应用面板中选择您的应用，然后前往产品 > Facebook 登录 > 设置。在 OAuth 客户端授权设置下的有效 OAuth 跳转网址字段中输入您的跳转网址以获得成功授权。

②检查登录状态
调用 FB.getLoginStatus检查登录状态，此函数会触发 Facebook 调用，获取登录状态，并调用包含结果的回调函数。

    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
提供给回调的 response 对象包括许多字段：

    {
        status: 'connected',
        authResponse: {
            accessToken: '...',
            expiresIn:'...',
            reauthorize_required_in:'...'
            signedRequest:'...',
            userID:'...'
        }
    }


status 表示应用用户的登录状态。status 可以是下列之一：  
 - connected — 用户登录了 Facebook 和您的应用。    
 - not_authorized — 用户登录了 Facebook，但未登录您的应用。  
 - unknown — 用户未登录    Facebook，所以无法知道他们是否登录了您的应用。或者已经调用 FB.logout()，因此无法连接至 Facebook。     
 - 如果状态为 connected，则响应对象将包括 authResponse，分为以下部分： 
accessToken —    包括应用用户的访问口令。
expiresIn — 表示口令到期且需要更新的 UNIX 时间。    
reauthorize_required_in - 登录过期和请求重新授权之前的时长（以秒为单位）。 
signedRequest —    经签名的参数，其中包括应用用户的信息。 userID — 应用用户的编号。

③让用户登录
提示用户登录的两种方式：
 - 使用“登录”按钮。 
 - 使用 JavaScript SDK 中的 FB.login()

FB.login(function(response){
  // Handle the response object, like in statusChangeCallback() in our demo
  // code.
});

④让用户退出
可以向按钮或链接添加 JavaScript SDK 函数 FB.logout，让用户可以退出应用

    FB.logout(function(response) {
       // Person is now logged out
    });

SpringBoot配置好了HTTPS,并实现HTTP访问自动转HTTPS访问，自己也通过OpenSSL给localhost 添加 SSL 证书，在本地开发环境中实现了HTTPS，但由于并非官方CA签发的证书，所以chrome依然认为本网址是不安全的，在这里点击继续前往localhost即可。
![在这里插入图片描述](https://img-blog.csdnimg.cn/2018103112172270.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
点击FACEBOOK登陆。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031121254231.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
完成登陆，重定向到网页地址，返回当前状态。We are connected.
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031121225591.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
登陆成功后就可以获取用户信息，可以是用户名、头像、朋友列表等等， 可以很容易地在HTML中的function getInfo()函数里面设置，本文只获取了response id。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031121308998.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)

## 5.源代码
Controller中添加Login Controller

    @RequestMapping("/login")
        public String login() {
            return "Facebook.html";
        }

HTML代码如下

    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <link rel="stylesheet" href="">
    </head>
    <body>
    <script>
        // initialize and setup facebook js sdk
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '279184756036492',
                cookie     : true,
                xfbml      : true,
                version    : 'v3.2'
            });
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    document.getElementById('status').innerHTML = 'We are connected.';
                    document.getElementById('login').style.visibility = 'hidden';
                } else if (response.status === 'not_authorized') {
                    document.getElementById('status').innerHTML = 'We are not logged in.'
                } else {
                    document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
                }
            });
        };
        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    
        // login with facebook with extra permissions
        function login() {
            FB.login(function(response) {
                if (response.status === 'connected') {
                    document.getElementById('status').innerHTML = 'We are connected.';
                    document.getElementById('login').style.visibility = 'hidden';
                } else if (response.status === 'not_authorized') {
                    document.getElementById('status').innerHTML = 'We are not logged in.'
                } else {
                    document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
                }
            }, {scope: 'email'});
        }
    
        // getting basic user info
        function getInfo() {
            FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
                document.getElementById('status').innerHTML = response.id;
            });
        }
    </script>
    
    <div id="status"></div>
    <button onclick="getInfo()">Get Info</button>
    <button onclick="login()" id="login">Login</button>
    </body>
    </html>
      
# 总结
本文主要介绍了利用 JavaScript SDK将Facebook登陆应用于Web网页，希望能对大家有所帮助~ 有问题欢迎留言交流，不足之处还请多多指正。




