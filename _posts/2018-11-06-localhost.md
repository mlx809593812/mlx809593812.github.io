---
layout: post
title:  "Spring Boot中实现HTTPS for localhost"
categories: 网络与信息安全
tags: HTTP HTTPS SpringSecurity 网络与信息安全 SSL
author: Jeffrey
---

* content
{:toc}

# Spring Boot中实现HTTPS for localhost
当今时代，几乎所有能访问的网站都是受HTTPS保护的，使用HTTPS保护您的服务器也就意味着您无法从非HTTPS的服务器发送请求到此服务器。
这对使用本地开发环境的开发人员来说是一个问题，因为这些本地开发环境都是运行在http://localhost下的。
本文主要介绍在Spring Boot项目中，localhost如何实现HTTPS。

# 创建安全套接层（SSL）证书
SSL 证书就是遵守 SSL 安全套接层协议的服务器数字证书，由浏览器中“受信任的根证书颁发机构”在验证服务器身份后颁发，具有网站身份验证和加密传输双重功能。可确保互联网连接安全，保护两个系统之间发送的任何敏感数据，防止网络犯罪分子读取和修改任何传输信息。
如果您能使用 https:// 来访问某个网站，就表示此网站是部署了SSL证书。一般来讲，如果此网站部署了SSL证书，则在需要加密的页面会自动从 http:// 变为 https:// ，如果没有变，你认为此页面应该加密，您也可以尝试直接手动在浏览器地址栏的http后面加上一个英文字母“ s ”后回车，如果能正常访问并出现安全锁，则表明此网站实际上是部署了SSL证书，只是此页面没有做 https:// 链接；如果不能访问，则表明此网站没有部署 SSL证书。
如果 SSL 证书不是由浏览器中“受信任的根证书颁发机构”颁发的，则浏览器会有安全警告。

## 获取SSL证书的途径
 - 通过OpenSSL生成证书
 - 通过keytool签名
 - 从SSL证书授权中心购买

前两种方法都试过了，网上也看到两篇很有用的博客——[localhost 添加 SSL 证书 ](https://www.jianshu.com/p/2e77699ca53a)、[Springboot配置使用ssl](https://blog.csdn.net/shouldnotappearcalm/article/details/78047047?utm_source=blogxgwz0)

## 通过OpenSSL生成证书

 1. 首先安装OpenSSL,默认目录安装即可。[下载地址](http://downloads.sourceforge.net/gnuwin32/openssl-0.9.8h-1-setup.exe)
 2. 新建配置文件localhost.cnf，文件内容如下 
        
        [dn]
        CN=localhost
        
        [req]
        distinguished_name = dn
        
        [EXT]
        subjectAltName=DNS:localhost
        keyUsage=digitalSignature
        extendedKeyUsage=serverAuth

   
 3. 以管理员身份进入命令行界面
假设 OpenSSL 的安装位置为 'C:\Program Files (x86)\GnuWin32'，使用cd命令进入 'C:\Program Files (x86)\GnuWin32\bin'
然后执行命令

> .\openssl req -x509 -out localhost.crt -keyout localhost.key -newkey  rsa:2048 -nodes -sha256  -subj '/CN=localhost' -extensions EXT -config {localhost.cnf文件目录}

证书就会生成成功，如下图所示。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031153129175.png)

 4. 此时再打开chrome浏览器，点击设置，找到证书管理，import刚才生成的证书即可。

![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031155211110.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)


![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031155222634.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)

## 通过keytool签名

keytool是一个证书管理工具，可以生成自签名证书,个人认为通过keytool生成更便捷一些。
1.在JDK中输入如下命令。

    keytool -genkey -alias tomcat -keyalg RSA -keystore tomcat.keystore
![在这里插入图片描述](https://img-blog.csdnimg.cn/20181031152935151.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70)
    
2.将tomcat.keystore拷贝到项目根目录下

3.配置application.yml

    server:
      port: 8443
      servlet:
        context-path: '/identity'
      ssl:
        key-store: tomcat.keystore
        key-store-password: 123456
        key-store-type: JKS
        key-alias: tomcat

此时启动项目就可以直接访问https://localhost:8443/，但尚未实现自动跳转到HTTPS。

4.在运行主类中加入如下代码，即可实现自动跳转。
此时你在浏览器输入http://localhost:8081/identity/login访问，会自动跳转到https://localhost:8443/identity/login

    @Bean
      public Connector connector(){
        Connector connector=new Connector("org.apache.coyote.http11.Http11NioProtocol");
        connector.setScheme("http");
        connector.setPort(8081);
        connector.setSecure(false);
        connector.setRedirectPort(8443);
        return connector;
      }
    
      @Bean
      public TomcatServletWebServerFactory tomcatServletWebServerFactory(Connector connector){
        TomcatServletWebServerFactory tomcat=new TomcatServletWebServerFactory(){
          @Override
          protected void postProcessContext(Context context) {
            SecurityConstraint securityConstraint=new SecurityConstraint();
            securityConstraint.setUserConstraint("CONFIDENTIAL");
            SecurityCollection collection=new SecurityCollection();
            collection.addPattern("/*");
            securityConstraint.addCollection(collection);
            context.addConstraint(securityConstraint);
          }
        };
        tomcat.addAdditionalTomcatConnectors(connector);
        return tomcat;
      }
# 总结
本文主要是结合个人实践，探讨了Spring Boot中实现HTTPS for localhost，以及获取SSL证书的两种方式。
希望能对大家有所帮助~ 有问题欢迎留言交流，不足之处还请多多指正。