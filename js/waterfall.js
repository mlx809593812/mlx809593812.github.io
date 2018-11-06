/* jshint asi:true */
//先等图片都加载完成
//再执行布局函数

/**
 * 执行主函数
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function() {

  /**
     * 内容JSON
     */
  var demoContent = [
      {
          demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83575754',
          img_link: 'https://img-blog.csdnimg.cn/20181031101022866.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70',
          code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83575754',
          title: '第三方登陆实践之基于OAuth的FACEBOOK Web Login（最新版）',
          core_tech: 'JavaScript',
          description: '通过采用 JavaScript 版 Facebook SDK 的“Facebook 登录”，用户可以使用 Facebook 登录信息登录您的网页。'
      },
    {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83659602',
      img_link: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3933725988,2716048691&fm=26&gp=0.jpg',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83659602',
      title: 'Facebook第三方登录实践2.0（不使用Facebook官方SDK）',
      core_tech: 'Spring Boot',
      description: 'Facebook第三方登录实践2.0（不使用Facebook官方SDK）'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83588421',
      img_link: 'https://img-blog.csdnimg.cn/20181031184900796.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83588421',
      title: '深入理解OAuth2.0&基于OAuth2.0第三方登录之GitHub实践',
      core_tech: 'Spring Boot、Spring Security',
      description: '深入理解OAuth2.0&基于OAuth2.0第三方登录之GitHub实践'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83348549',
      img_link: 'https://img-blog.csdn.net/20181024180030661?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83348549',
      title: '深入理解GraphQL',
      core_tech: 'GraphQL',
      description: '深入理解GraphQL'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83309002',
      img_link: 'https://img-blog.csdn.net/20181023162446951?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83309002',
      title: '深入理解React&Redux',
      core_tech: 'React Redux',
      description: '深入理解React&Redux'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83621655',
      img_link: 'https://upload-images.jianshu.io/upload_images/7678690-100791ad494ebd3e.png',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83621655',
      title: '深入理解Cookie、Session、Token',
      core_tech: 'Spring Security 网络与信息安全',
      description: '深入理解Cookie、Session、Token'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83584043',
      img_link: 'https://img-blog.csdnimg.cn/20181031143108687.jpg',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83584043',
      title: '深入理解HTTPS（梳理总结版）',
      core_tech: 'Spring Security 网络与信息安全',
      description: '深入理解HTTPS（梳理总结版）'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83749119',
      img_link: 'https://img-blog.csdnimg.cn/2018110513552275.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83749119',
      title: '深入理解XSS攻击与防御',
      core_tech: 'Spring Security 网络与信息安全',
      description: '深入理解XSS攻击与防御'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83625050',
      img_link: 'https://img-blog.csdnimg.cn/20181101180157431.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==,size_16,color_FFFFFF,t_70',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83625050',
      title: '深入理解CSRF攻击与防御',
      core_tech: 'Spring Security 网络与信息安全',
      description: '深入理解CSRF攻击与防御'
    }, {
      demo_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83585951',
      img_link: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2375791968,2477761375&fm=11&gp=0.jpg',
      code_link: 'https://blog.csdn.net/Jeffrey20170812/article/details/83585951',
      title: 'Spring Boot中实现HTTPS for localhost',
      core_tech: 'Spring Security 网络与信息安全',
      description: 'Spring Boot中实现HTTPS for localhost'
    }
  ];

  contentInit(demoContent) //内容初始化
  waitImgsLoad() //等待图片加载，并执行布局初始化
}());

/**
 * 内容初始化
 * @return {[type]} [description]
 */
function contentInit(content) {
  // var htmlArr = [];
  // for (var i = 0; i < content.length; i++) {
  //     htmlArr.push('<div class="grid-item">')
  //     htmlArr.push('<a class="a-img" href="'+content[i].demo_link+'">')
  //     htmlArr.push('<img src="'+content[i].img_link+'">')
  //     htmlArr.push('</a>')
  //     htmlArr.push('<h3 class="demo-title">')
  //     htmlArr.push('<a href="'+content[i].demo_link+'">'+content[i].title+'</a>')
  //     htmlArr.push('</h3>')
  //     htmlArr.push('<p>主要技术：'+content[i].core_tech+'</p>')
  //     htmlArr.push('<p>'+content[i].description)
  //     htmlArr.push('<a href="'+content[i].code_link+'">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>')
  //     htmlArr.push('</p>')
  //     htmlArr.push('</div>')
  // }
  // var htmlStr = htmlArr.join('')
  var htmlStr = ''
  for (var i = 0; i < content.length; i++) {
    htmlStr += '<div class="grid-item">' + '   <a class="a-img" href="' + content[i].demo_link + '">' + '       <img src="' + content[i].img_link + '">' + '   </a>' + '   <h3 class="demo-title">' + '       <a href="' + content[i].demo_link + '">' + content[i].title + '</a>' + '   </h3>' + '   <p>主要技术：' + content[i].core_tech + '</p>' + '   <p>' + content[i].description + '       <a href="' + content[i].code_link + '">源代码 <i class="fa fa-code" aria-hidden="true"></i></a>' + '   </p>' + '</div>'
  }
  var grid = document.querySelector('.grid')
  grid.insertAdjacentHTML('afterbegin', htmlStr)
}

/**
 * 等待图片加载
 * @return {[type]} [description]
 */
function waitImgsLoad() {
  var imgs = document.querySelectorAll('.grid img')
  var totalImgs = imgs.length
  var count = 0
  //console.log(imgs)
  for (var i = 0; i < totalImgs; i++) {
    if (imgs[i].complete) {
      //console.log('complete');
      count++
    } else {
      imgs[i].onload = function() {
        // alert('onload')
        count++
        //console.log('onload' + count)
        if (count == totalImgs) {
          //console.log('onload---bbbbbbbb')
          initGrid()
        }
      }
    }
  }
  if (count == totalImgs) {
    //console.log('---bbbbbbbb')
    initGrid()
  }
}

/**
 * 初始化栅格布局
 * @return {[type]} [description]
 */
function initGrid() {
  var msnry = new Masonry('.grid', {
    // options
    itemSelector: '.grid-item',
    columnWidth: 250,
    isFitWidth: true,
    gutter: 20
  })
}
