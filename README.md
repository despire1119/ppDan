前端
=============
-------------

*web*
-------------

- 跨域有哪些方式？（原理是什么，需要如何配置）
  - 同源策略：域名、协议、端口均相同
######1.	jsonp
    jsonP：json with padding
    利用script标签可以跨域链接资源的特性（动态添加）
    发起的都是get请求

	基本原理：本质是脚本注入。不使用XMLHTTPRequest对象发送请求，而是在dom中动态插入seript标签，并在响应中返回要执行的script代码。

	优点：配置、使用简单；通过回调函数的方式处理逻辑。

	缺点：
	1.	安全系数低；
	2.	与后端交互的报文明文传递，易被抓包；
	3.	只能发送get请求；报文字节长度有限制；
	4.	不能注册success、error等事件监听函数，不能很容易的确定JSONP请求是否失败
######2.	配置nginx反向代理
    nginx通过proxy_pass_http配置代理站点，upstream实现负载均衡
	
	nginx实现跨域有两种方式：
	1.	本地起nginx服务，将本地对应端口映射到目标域名。（localhost:xxxx => www.xxx.com/xxx.xxx.xx.xx:xxxx)
	2.	服务端 nginx+cors,本地cors（在cors跨域方式中说明）
######3.	CORS
	Cross-Origin Resource Sharing（CORS）。现代浏览器跨域协议。
	使用：
		服务器nginx配置：

	    Access-Control-Allow-Origin: *
    	Access-Control-Allow-Methods: POST, GET, OPTIONS
    	Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
    	Access-Control-Max-Age: 86400
		Access-Control-Allow-Credentials: true

		前端Ajax设置：

		"withCredentials": true
	优点：
	1.	支持所有简单、复杂http请求（通过服务端配置实现）
	2.	不同域通过沙盒脚本的方法跨域，确保安全的跨域数据传输
	3.	CORS使用XMLHTTPRequest等API容器发送请求，减少http请求的风险来源
######4.	websocket
	无状态协议，通过session和cookie保持与客户端的对话。区别http协议，websocket持续打开服务器与客户端的数据通道，使得服务器和客户端可以同时向对方发送数据。

	HTML5的新协议。它实现浏览器与服务器全双工通信(socket长连接概念了解一下)。同时允许跨域通信。
######5.	iframe，window.domain,window.postMessage()
	不常用，了解即可。这几种支持跨子域，也就是同域名不同端口，或同跟域名不同n级域名的跨域访问。
	
	
- 从输入一个url到浏览器页面展示都经历了哪些过程？
  1.	浏览器拿到url,一次查看自己的缓存、系统缓存、路由器缓存，如果缓存中有，读缓存，没有进行下一步
  2.	解析域名（DNS解析），获取相应的ip地址
  3.	浏览器向服务器发起tcp连接，三次握手
  4.	握手成功，向服务器发起http请求，请求数据包
  5.	服务器处理请求，返回数据（或错误信息、或重定向新的url地址）
  6.	浏览器收到http响应
  7.	浏览器读取数据包，解析html
  8.	生成dom树，解析css样式，js
  9.	处理异步交互

- 移动端wap内嵌app时如何与app交互
  	（你怕是在逗我？）与客户端约定接口，js调用............
######
  	1.	老套路： 
	  	Hybird(混合式移动应用)：app端定义包含js方法的对象，在webview中注入到wap加载的js文件顶层。（目前华为音乐就是这么干的。jsinterface这个东西就是app注入进来的）
	2.	框架级：
		react-native;	weex;	微信小程序；
		不展开，大概了解一下。
	3.	装逼用：
		pwa（Progressive Web App），完全脱离app框架。由前端生成包括app图标在内的整个app项目。
- 登录鉴权有哪些方式
  1.	HTTP Basic Authentication
  2.	session-cookie
  3.	Token 验证
  4.	OAuth(开放授权)

- 简单说说Vue的生命周期/双向绑定/虚拟Dom
  生命周期：
  1.	beforeCreate > created
		######这两个之间，初始化事件，数据的观测，结束后data绑定
  2.	created > beforeMount
		######判断对象是否有el，有就继续，没有就终止（el为实例提供挂载元素。值可以是 CSS 选择符，或实际 HTML 元素，或返回 HTML 元素的函数，具体是干嘛使的，说实话我不太清楚）
  3.	mounted
    	######挂载结束
  4.	beforeUpdate > updated
    	######更新数据
  5.	beforeDestroy > destroyed
    	######销毁
  
######一句话概括：
	vue生命周期分为：实例化前后，挂载前后，更新前后及销毁前后。（2.0展开说明）

- 闭包是什么（这个一般会直接上题让你解）
	######能够读取其他函数内部变量的函数
	#####不装逼的解释闭包：
	######一个 ***持有并使用*** 外部环境变量的函数就是闭包
	######javascript中闭包的体现源自作用域链的概念，其本质有两点：
	1.	词法作用域（按照书写时的样子，内部函数可以访问函数外部的变量）
	2.	函数当做值传递（将函数当做参数传递给别的函数，或当做一个值return）
	######当函数被当做参数返回时，返回的函数就相当于一个通道，这个通道可以访问函数词法作用域中的变量，所以本来执行完毕要被销毁的外层函数的作用域被保留下来。这个作用域无法直接访问，但可以通过返回的函数来调用。这就形成了闭包。

- 前端有哪些存储和传递数据的手段
  1. loaclStorage
   >+ 以键值对(Key-Value)的方式存储，永久存储，永不失效，除非手动删除。
   >+ 大小5M
   >+ 常用API——getItem //取记录、setIten//设置记录、removeItem//移除记录、key//取key所对应的值、clear//清除记录
   >+ 存储内容——数组，图片，json，样式，脚本（只要是能序列化成字符串的内容都可以存储）
  2. sessionStorage
  >+ 关闭页面后即被清空
  3. cookie
  4. application cache
  >+ 使用方法如下
    ```
    <!DOCTYPE HTML>
      <html manifest="demo.appcache">
        ...
    </html>
    ```
  >+ Manifest 文件：
  ```
  manifest 文件是简单的文本文件，它告知浏览器被缓存的内容（以及不缓存的内容）。

  manifest 文件可分为三个部分：

  1. CACHE MANIFEST - 在此标题下列出的文件将在首次下载后进行缓存

  2. NETWORK - 在此标题下列出的文件需要与服务器的连接，且不会被缓存

  3. FALLBACK - 在此标题下列出的文件规定当页面无法访问时的回退页面（比如 404 页面）
  ```
  >+ 完整demo  
 localStorage只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份localStorage数据。  
 sessionStorage比localStorage更严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下。  
 localStorage是永久存储，除非手动删除。  
 sessionStorage当会话结束（当前页面关闭的时候，自动销毁）  
 cookie的数据会在每一次发送http请求的时候，同时发送给服务器而localStorage、sessionStorage不会。
  ```

- http1.0和2.0的区别
	1.	单连接多路复用。（区别于http1.1的多tcp连接处理并发）
	2.	压缩请求头（header）
	3.	web server请求
- React（NG）与Vue的异同
	#####相似：
	1. 虚拟Dom，操作虚拟dom的本质是操作内存中的js，性能上优于操作实体dom
	2. 相似的设计思想：组件，传参，数据状态管理和通信
	#####区别：
	1. 
	2. vue是标准的mvvm架构，react思想是单向数据流（flux架构）
	3. 


*网络、浏览器方向*
-------------
>+ Tcp/Ip 三次握手  
  第一次握手：Server 猜测Client可能要建立TCP请求，但不确定，因为也可能是Client乱发了一个数据包给自己  
  第二次握手：通过ack=J+1，Client知道Server是支持TCP的，且理解了自己要建立TCP连接的意图  
  第三次握手：通过ack=K+1，Server知道Client是支持TCP的，且确实是要建立TCP连接

>+ http1.0和2.0的区别
  1.0利用文本与服务器交互，2.0的基本协议单位是二进制流
  http2可多路复用，只需一次三次握手，复用多次 
  压缩了消息头，http1的消息头很冗余
  http2会主动将资源推送给客户端，例如把js和css文件主动推送给客户端而不用客户端解析HTML后请求再响应。
  http2增加了数据安全传输及客户端和服务器端的身份验证，只适用于HTTPS

>+ 浏览器调试和优化工具
  chrome控制台
	Fiddler
  除此之外一无所知
*html方向*
-------------

>+ 视频、音频控件
  audio video？
>+ 滚动条
  overflow scroll?
>+ 文件传输
  
>+ canvas基础

*css方向*
-------------
>+ 定位（position）
  
>+ 元素级别及特性（display）

>+ 浮动（太老了现在应该不问了）
  好的
>+ 伪类
  
>+ 作用域、优先级
  !important > 祖传行内 > # > . > tagname > 伪类 > *
>+ flex
  interesting
>+ scss/less/stylus等预编辑器的优缺点（异同点）
  都挺好用
>+ hack方式
  	<!--[if !IE]>
    请原地爆炸
    <![endif]-->

>+ *css3/4 新特性*
  flex、animate、shadow、border等
*js基础*
-------------
>+ 基本类型和引用类型 
  string number boolean null undefind
  object
>+ 原型对象和原型链
  每个构造函数都有一个原型对象(prototype)
  原型对象都包含一个指向构造函数的指针(constructor)
  实例都包含一个指向原型对象的内部指针(proto)
  在JavaScript中，每个对象都拥有一个原型对象，而指向该原型对象的内部指针则是__proto__,通过它可以从中继承原型对象的属性，原型是JavaScript中的基因链接，有了这个，才能知道这个对象的祖祖辈辈。从对象中的__proto__可以访问到他所继承的原型对象。
  说实话我不是很懂他在说什么
>+ 继承
  1.prototype实现继承
  2.构造函数
  3.实例继承

>+ 构造函数
  new 操作符配合使用
>+ 作用域(链)
  当我们在局部作用域中，访问一个变量时，系统首先会在当前作用域中寻找变量var的声明语句，如找到则直接使用。反之，则继续向上一级作用域中寻找var的声明语句，如找到则直接使用，反之，继续向上一级作用域中去寻找…直到全局作用域，如找到则直接使用，如未找到则直接在全局作用域中声明该变量，我们把这种链式查询关系就称之为为作用域链！
>+ 闭包
  同上
>+ this指针
  this关键字只与函数的执行环境有关，而与声明环境没有关系。
>+ xmlHTTPRequest
  是一个 API，它为客户端提供了在客户端和服务器之间传输数据的功能。它提供了一个通过 URL 来获取数据的简单方式，并且不会使整个页面刷新。
  ajax的实现原理
>+ 垃圾回收机制
  why?
  JavaScript程序每次创建字符串、数组或对象时，解释器都必须分配内存来存储那个实体。只要像这样动态地分配了内存，最终都要释放这些内存以便他们能够被再用，否则，JavaScript的解释器将会消耗完系统中所有可用的内存，造成系统崩溃。
  wtf?
  垃圾回收机制是浏览器的被动技能，大概有两种：
  1.标记清除
    当变量离开环境，我理解是离开可能引用到他的作用域，就会被标记为“离开环境”
  2.引用计数
    当声明了一个变量并将一个引用类型赋值给该变量时，则这个值的引用次数就是1
    相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数就减1。当这个引用次数变成0时，则说明没有办法再访问这个值了，因而就可以将其所占的内存空间给收回来。


*js进阶*
-------------
> ##### node.js
  作为一个小前端，我对nodejs几乎一无所知
>- npm会玩？
>- node_modules干啥的？
>- node相对于其他后端语言的优势？
>- 基础指令？
>- 搭建服务？
>- 写爬虫？）

> ##### websocket
  HTTP 协议是一种无状态的、无连接的、单向的应用层协议
  然而websocket很持久

>- 长连接实现的原理
  可能是嗑药了

> ##### wap替代app的方式
  hybrid cordova

>- pwa
  Progressive Web App
  像原生应用一样可靠流程牛逼的webapp

>- flutter
  google的移动端框架

>- 等
  都很牛逼

*框架方向*
-------------
>- Vue，Ng，React双向绑定的实现机制
vue
  Object.defineProperty()定义的数据set、get函数
ng
  1.0通过触发$digest loop循环遍历
  2.0+ng2以上不同于angularJs，遍历的过程可根据组件树自根而下，遍历有可能发生变动的部分，不必遍历所有数据
react
  实不相瞒一无所知

>- Vue，React的虚拟Dom原理，虚拟Dom的优势
  虚拟DOM是在DOM的基础上建立了一个抽象层，对数据和状态所做的任何改动，都会被自动且高效的同步到虚拟DOM，最后再批量同步到DOM中。
>- VueX，Redux原理，用来做什么
>- Vue的优势（你为什么选择Vue）
>- Vue的指令，组件，计算属性分别是干啥的
>- Vue生命周期
  同上
>- Webpack做了什么
  1.管理依赖
  2.合并代码
  3.集成插件