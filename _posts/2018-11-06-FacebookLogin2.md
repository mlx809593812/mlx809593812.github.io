---
layout: post
title:  "Facebook第三方登录实践2.0（不使用Facebook官方SDK"
categories: 网络与信息安全 
tags: 网络与信息安全 OAuth2.0 SpringSecurity
author: Jeffrey
---

* content
{:toc}
# Facebook第三方登录实践2.0
实施“Facebook 登录”最简单快捷的方法是使用 JavaScript 版、iOS 版和 Android 版 Facebook 官方 SDK，但简单快捷的同时也多了很多限制。
本文主要介绍，在不使用Facebook官方SDK的情况下，如何实现Facebook第三方登录，以及深入理解实现OAuth2.0授权认证过程中关键步骤的深层原理。

# 如何实现Facebook第三方登录
## 核心代码实现
关于Facebook 第三方登录的介绍，以及使用Facebook官方SDK实现第三方登陆的具体方法，在[我之前写的一篇博文](https://blog.csdn.net/Jeffrey20170812/article/details/83575754)中已经很详细的介绍过了，实现第三方登陆的前三个步骤都是一样的，建议对Facebook第三方登陆暂时还不太熟悉的读者先去读一下。
Facebook 官方 SDK内置了很多函数，比如说登陆、退出、检查用户登陆状态等等，调用起来很方便。如果不使用Facebook官方SDK，这些功能都得靠自己用代码实现，确实没有使用SDK方便快捷。
由于篇幅原因，相似内容类似于注册开发者账号、填写必要信息、上线APP这类的，本文就不再赘述。
在引入必要的依赖之后，就可以做开发了。
在这里再做个小提醒，如果你用Java代码也可以实现整个OAuth2.0认证授权的流程，但代码会很繁琐（前期我踩过这个坑...），学会巧妙地使用配置文件application.yml，代码会更加简洁直观。因为Spring已经整合好了整个Oauth2.0流程，可以减少了很多本不需要的代码。
配置文件application.yml内容如下：


    security:
            oauth2:
              client:
                registration:
                  facebook:
                    client-id: 279184756036492(Your client_id)
                    client-Secret: XXXXX(Your client_Secret)
                    authorizationGrantType: authorization_code
                    redirect_uri_template: "{baseUrl}/login/oauth2/code/{registrationId}"
                    clientName: facebook-client
                provider:
                  facebook:
                    token-uri: https://graph.facebook.com/oauth/access_token
                    authorization-uri: https://www.facebook.com/v3.2/dialog/oauth
                    user-info-uri: https://graph.facebook.com/me
        server:
          port: 8443
          ssl:
              key-store: tomcat.keystore
              key-store-password: XXXXX（Your key-store-password）
              key-store-type: JKS
              key-alias: tomcat
        logging:
          level:
            org.springframework.security: DEBUG

除此之外你还需要重写WebSecurityConfigurerAdapter内的configure方法。WebSecurity web和HttpSecurity http都需要Override。
web相关的配置如何修改要根据具体的业务而定，在此具体的逻辑代码就不展示了，HttpSecurity Configuration的配置代码如下所示：

    @Override
      public void configure(HttpSecurity http) throws Exception {
        http.csrf().disable();
    
        http.authorizeRequests()
            .antMatchers("/secured/**")
            .authenticated()
            .antMatchers("/", "/custom_login", "/unsecured/**")
            .permitAll()
            .anyRequest()
            .authenticated()
            .and()
            .oauth2Login();
      }
重点是.auth2Login()设置，后面还可以加很多配置，例如目前Sping会有系统默认的登陆界面，如果你想修改可以.oauth2Login().loginPage("在此加上你想要的登陆界面")即可，更多的配置可以自行到官网查阅（[HttpSecurity Configuration](https://docs.spring.io/spring-security/site/docs/4.2.4.RELEASE/apidocs/org/springframework/security/config/annotation/web/builders/HttpSecurity.html)、[Java Configuration](https://docs.spring.io/spring-security/site/docs/current/reference/html/jc.html)）。
有一点需要注意，Facebook规定自2018 年 10 月 6 日起，所有应用都需要使用 HTTPS（HTTPS协议更加的安全）。即对跳转 URI 和 JavaScript SDK 强制使用 HTTPS。
如果你是在本地开发环境下工作，那么需要给localhost添加SSL证书并实现HTTPS，具体方法可以参考[我之前写过的另一篇博文。](https://blog.csdn.net/Jeffrey20170812/article/details/83585951)这篇博文用两种方法实现了给localhost创建安全套接层（SSL）证书，后端Spring Boot提供的API也实现了HTTP到HTTPS的自动跳转，内容写的很详细。
另外还有一点需要注意，配置完成后，登陆界面会提供调用Facebook登陆授权的API，在oauth2.client.provider这里设置的。
> authorization-uri: https://www.facebook.com/v3.2/dialog/oauth

这块具体的深层原理，本文后端会详细介绍。需要注意的点是，Facebook作为外网，浏览器有代理可以正常打开，但后端Spring Boot启动的localhost  server 无法正常CALL这个API。（意思就是浏览器可以打开外网，但后端server无法发送get post请求，这就无法完成交换code、state、access_token等等好多重要的事情）
所以需要给整个server端加一个代理，加代理有很多方法，可以直接在
application.yml或者application.properties里面设置，也可以直接加在后端Spring Boot启动类@SpringBootApplication的main函数中。
具体代码如下：

    System.setProperty("https.proxyHost", "Your proxy host (不需要加http)");
    System.setProperty("https.proxyPort", "Your proxy port"); 


# 深入理解实现Facebook授权认证过程

## 用户视角中的第三方登陆流程
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181102175947577.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
我们先从用户的视角走一遍第三方认证的流程。
1.启动Spring Boot后端，会进去Spring框架默认的登陆界面，没有添加任何的UI效果，facebook-client就是本文通过上面的配置文件生成的（图中其余的链接是另外的项目，与本项目无关），facebook-client会提供调用Facebook登陆授权的API。

点击会跳转到authorization-uri：https://www.facebook.com/v3.2/dialog/oauth，并携带很多必须参数：
 1. client_id。可在应用面板中找到的应用APP编号。
 2. redirect_uri。希望将登录的用户重定向回的网址，也就是在Facebook开发者页面里面设置的有效 OAuth 跳转网址。
3. state。您的应用创建的字符串值，用于维持请求和回调之间的状态。

 security.oauth2.client.registration.facebook里面至少要填这些参数。

2.点击之后进入登陆界面
![在这里插入图片描述](https://img-blog.csdnimg.cn/2018110217593598.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
3.用户在这里输入用户名和密码（因为本人之前有登陆，浏览器记录了缓存了一些等信息，所以只输入密码即可。）
输入完成会自动跳回到本地（也就是之前填的redirect_uri信息）。
此时本地的server端，就可以得到第三方Facebook提供的此用户信息。
![第三方Facebook提供的此用户信息](https://img-blog.csdnimg.cn/20181102180017367.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
本地server端有了这些信息，就可以去注册一个新的账号，并拿着Facebook提供的此用户信息填写表单存入自家DB里面。（信息可以是姓名、年龄、头像、甚至是联系人信息等等很多，Facebook开发者平台可以申请获取用户那些信息，其中邮箱和姓名等信息不需要申请，直接可以获取。）
有了这些信息，server端就可以重新渲染前端界面，这在用户的视角来看，第三方登陆就已经完成了。

## 实际被忽视的授权认证关键步骤
然而事情并不像看起来那么简单，在用户填写好信息点击登陆按钮，到跳转到redirect_uri本地server端页面，还发生了非常多的事情。
从上面图片中，右边的Network Preserve log里面可以看到，整个过程经理了很多次的网络通信。
原理类似于下图，Client是我本地跑起来的server端，Facebook在此充当OAuth2 Provider。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031171709429.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)

但实际上，真正的过程有些细微差异。经过我仔细研究，大致流程如下：
1.用户点击Facebook账号登陆，本地的server端带着很多Facebook App的信息（client_id={app-id}&redirect_uri={redirect-uri}&state={state-param}等等） 去重定向到Facebook登陆界面，同时也是开发者平台上线的应用APP登陆界面。
2.在登陆界面用户输入好账号密码后 点击登陆。
此时用户时实际上登陆了两者（开发者平台上线了的登录应用和Facebook）
3.登陆成功后，会跳转回redirect_uri（在此是本地server端启动的localhost地址）并且带着state参数 code参数等等。
4.此时本地server端会按照application.yml配置文件设置的，带着code、state等参数去访问token-uri: https://graph.facebook.com/oauth/access_token
获取access_token。（只有同时带着state和code参数，才能换取到access_token，有了access_token就可以去访问用户在Facebook的数据了）
5.Facebook端接收到请求，会生成access_token，但不会传回本地的server端，而是存在了JESSIONID映射到的位置，非常好了保证了access_token的安全，而且有一定的时效性。JESSIONID传回本地的server端后会存入Cookie中。
6.然后本地Server端下次就可以带着Cookie去访问用户在Facebook的资源。

以上简化流程中的3、4、5步，在用户的视角里是看不到的。但这几步才是OAuth2.0授权认证的关键所在，每一次通信的Request URL都很长，带了很多参数信息，完成了很多事情。
例如下图就是本地server端自动带着code和state参数去获取access_token的一个HTTP GET请求。
![单个HTTP GET请求](https://img-blog.csdnimg.cn/20181102190414488.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)

# 总结
本文主要介绍了在不使用Facebook官方SDK的情况下，如何实现Facebook第三方登录，以及深入理解实现OAuth2.0授权认证过程中的关键步骤。
希望能对大家有所帮助~ 有问题欢迎留言交流，不足之处还请多多指正。