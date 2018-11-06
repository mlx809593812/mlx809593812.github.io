---
layout: post
title:  "深入理解React&Redux"
categories: 前端技术栈
tags: React Redux
author: Jeffrey
---

* content
{:toc}
# React
## React是什么
React是一个帮助你构建页面UI的前端框架，React的组件就相当于MVC里面的View。
React.js可以提供View层面的解决方案，但不能解决我们所有的问题，需要结合其他的库，例如Redux、Router等,本文后半段会重点介绍React&Redux。

## 为什么需要React
HTML结合JavaScript写的前端代码，没有任何的可复用性。想要复用，往往只能把整段JavaScript代码复制过去。
React可以帮助我们解决**前端结构的复用性问题**，整个页面可以由这样的不同的组件组合、嵌套构成。

## React如何实现组件可复用
React.js 中一切皆组件，用 React.js 写的其实就是 React.js 组件。在编写 React.js 组件的时候，需要继承 React.js 的组件父类Component。
Component类中有一个render()方法，并且返回JSX。（所谓的 JSX 可以理解为就是 JavaScript 对象）
 **JSX是什么**
React.js 可以用 JSX 来描述你的组件长什么样的。一个组件类必须要继承 React.js 的组件父类Component并且实现一个 render 方法，这个 render 方法必须要返回一个 JSX 元素。
在 JSX 当中可以插入 JavaScript 的表达式，表达式返回的结果会相应地渲染到页面上。表达式用 {} 包裹。{} 内可以放任何 JavaScript 的代码，包括变量、表达式计算、函数执行等等。 
![Alt](https://huzidaha.github.io/static/assets/img/posts/44B5EC06-EAEB-4BA2-B3DC-325703E4BA45.png)
JSX 在编译的时候会变成相应的 JavaScript 对象描述。
render 会把这些代码返回的内容如实地渲染到页面上，非常的灵活。
ReactDOM.render 功能就是把组件渲染并且构造 DOM 树，然后插入到页面上某个特定的元素上，重新渲染页面。
**组件编写完成后，各个组件之间就可以进行组合嵌套了。**
组件可以和组件组合在一起，组件内部可以使用别的组件。
举例：如下代码分别为Header 组件和Index组件，都继承于React.js 的组件父类Component。
如果想要在Index组件里面嵌套使用Header组件，那我们可以直接在Index组件render()方法内return的JSX里面使用 Header标签。就像是一个普通的标签一样。
React.js 会在Index组件中把 嵌套的Header 组件中render 方法表示的 JSX 内容渲染出来。
需注意一点：自定义的组件都必须要用大写字母开头，普通的HTML标签都用小写字母开头。
```javascript
class Header extends Component {
  render () {
    return (
      <h1>This is Header</h1>
    )
  }
}
class Index extends Component {
  render () {
    return (
      <div>
        <Header />
      </div>
    )
  }
}
```
上面很简单的例子，而实际应用中的组件复用会比较复杂。
在React中组件的显示形态和行为可以由数据状态（state）和配置参数（props）共同决定。
**数据状态state:**
每个组件都可以有自己的状态，React.js中state 的主要作用是用于组件保存、控制、修改自己的可变状态。state 中状态可以通过 this.setState 方法进行更新，setState 会导致组件的重新渲染。
**配置参数props:**
组件可以在内部通过 this.props 获取到配置参数，组件可以根据 props 的不同来确定自己的显示形态，达到可配置的效果。除非外部组件主动传入新的 props，否则组件的 props 永远保持不变。
*简而言之state 是让组件控制自己的状态，props 是让外部对组件进行配置。*
当我们要改变组件的状态的时候，不能直接用 this.state = xxx 这种方式来修改，如果这样做 React.js 就没办法知道你修改了组件的状态，它也就没有办法更新页面。一定要使用 React.js 提供的 setState 方法，它接受一个对象或者函数作为参数。setState 方法由组件父类 Component 所提供。当我们调用这个函数的时候，React.js 会更新组件的状态 state ，并且重新调用 render 方法，然后再把 render 方法所渲染的最新的内容显示到页面上。

以上便是React实现前端组件复用的简单应用，细心的同学读到这里，应该就能大致理解React基本原理。由于原理浅显易懂以及篇幅原因，在此不再详细举例。

# Redux
React 架构的最重要作用：管理 Store 与 View 之间的关系。

 - MobX：响应式（Reactive）管理，state 是可变对象，适合中小型项目
 - Redux：函数式（Functional）管理，state 是不可变对象，适合大型项目

MobX 架构的核心是观察者模式。Store 是被观察者（observable），组件是观察者（observer）。
一旦Store有变化，会立刻被组件观察到，从而引发重新渲染。
接下来本文主要介绍React&Redux架构模式。
## Redxu是什么
Redux是一种新型的前端“架构模式”，Redux可以应用到 React 和 Vue，甚至跟 jQuery 结合都没有问题。而 React-redux 就是把 Redux 这种架构模式和 React.js 结合起来的一个库，就是 Redux 架构在 React.js 中的体现。
Redux的设计思想：
 1. Web应用是一个状态机，视图与状态一一对应
 2. 所有的状态，保存在一个对象里面。

在标准的MVC框架中，数据可以在UI组件和存储之间双向流动，而Redux严格限制了数据只能在一个方向上流动。 见下图：
 ![在这里插入图片描述](https://img-blog.csdn.net/20181023154002614?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
在Redux中，所有的数据（比如state）被保存在一个被称为store的容器中 → 在一个应用程序中只能有一个。store本质上是一个状态树，保存了所有对象的状态。任何UI组件都可以直接从store访问特定对象的状态。要通过本地或远程组件更改状态，需要分发一个action。分发在这里意味着将可执行信息发送到store。当一个store接收到一个action，它将把这个action代理给相关的reducer。reducer是一个纯函数，它可以查看之前的状态，执行一个action并且返回一个新的状态。

## 有了React 为什么需要React
React不能解决我们所有的问题，不是Web应用的完整解决方案，React没有涉及1.代码结构 2.组件之间的高效通信。 
在React中，没有 state 的组件叫无状态组件（stateless component），设置了 state 的叫做有状态组件（stateful component）。状态会带来管理的复杂性，尤其是管理被多个组件所依赖或影响的状态。
React 只提供了一种通信手段：传参。对于大应用，很不方便。
如果我们只采用React，当某个状态被多个组件依赖或者影响的时候，就把该状态提升到这些组件的最近公共父组件中去管理，用 props 传递数据或者函数来管理这种依赖或着影响的行为。即找到通信双方最近的共同父组件，通过它的state，使得子组件的状态保持同步。
然而这并不是一个很好的解决方案，一旦发生了状态提升，你就需要修改原来保存这个状态的组件的代码，也要把整个数据传递路径经过的组件都修改一遍，好让数据能够一层层地传递下去。这样对代码的组织管理维护带来很大的问题。
Redux 规定了更好的代码结构，实现了 一个 State 对应一个 View。只要 State 相同，View 就相同。你知道 State，就知道 View 是什么样，反之亦然。而且Redux可以很好的实现组件之间高效的通信，可以更加条理清晰地管理组件的state。

##  Redux如何实现
**Store**
Store就是存储所有状态数据的地方，类似于一个容器，整个应用只能有一个Store
Redux提供createStore()这个函数来生成Store

    import { createStore } from 'redux';
    const store = createStore(fn);
**State**
Store对象包含所有数据，如果要得到某个时点的数据，就要对Store生成快照。 这种时点的数据集合叫做State
当前时刻的State可以通过store.getState()拿到

    import { createStore } from 'redux';
    const store = createStore(fn);
    const state = store.getState();
**Action**
State的变化必须是View导致的，Action就是View发出的通知，表示State应该要发生变化了。
Action 是一个对象。其中的type属性是必须的，表示 Action 的名称，其他属性可以自由设置。
Action 描述当前发生的事情。改变 State 的唯一办法，就是使用 Action。它会运送数据到 Store。

**Action Creator**
View 要发送多少种消息，就会有多少种 Action。 如果都手写，会很麻烦。可以定义一个函数来生成 Action，这个函数就叫 Action Creator。

**Store.dispatch()**
Store.dispatch()是 View 发出 Action 的唯一方法。

**Reducer**
Store 收到 Action 以后，必须给出一个新的 State，这样 View 才会发生变化。这种 State 的计算过程就叫做 Reducer。
Reducer 是一个纯函数，它接受 Action 和当前 State 作为参数，返回一个新的 State。

**纯函数**
Reducer 函数最重要的特征是，它是一个纯函数。也就是说，只要是同样的输入，必定得到同样的输出。
由于 Reducer 是纯函数，就可以保证同样的State，必定得到同样的 View。但也正因为这一点，Reducer 函数里面不能改变 State，必须返回一个全新的对象，这样的好处是，任何时候，与某个 View 对应的 State 总是一个不变的对象。

**store.subscribe()**
Store 允许使用store.subscribe方法设置监听函数，一旦 State 发生变化，就自动执行这个函数。

    import { createStore } from 'redux';
    const store = createStore(reducer);
    store.subscribe(listener);

只要把 View 的更新函数（对于 React 项目，就是组件的render方法或setState方法）放入listen，就会实现 View 的自动渲染。
store.subscribe方法返回一个函数，调用这个函数就可以解除监听。

**combineReducers**
Redux 提供了一个combineReducers方法，用于 Reducer 的拆分。
combineReducers()做的就是产生一个整体的 Reducer 函数。该函数根据 State 的 key 去执行相应的子 Reducer，并将返回结果合并成一个大的 State 对象。

## Redux工作流程
![在这里插入图片描述](https://img-blog.csdn.net/20181023160226208?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

React Work Flow
1.用户在View界面，通过鼠标点击刷新等方法触发 Action     store.dispatch(action);
2.Store自动调用Reducer,并且传入两个参数，当前的State和收到的Action,Reducer会返回新的State
let nextState = todoApp(previousState, action);
State一旦发生变化，Store就会调用监听函数      store.subscribe(listener);// 设置监听函数
3.listener通过store.getState()得到当前状态，这时会触发重新渲染View
Store的监听函数设置为render,每次State的变化都会导致网页重新渲染


React-Redux组件：
 1. UI组件
 2. 容器组件

1.UI 组件有以下几个特征。
 - 只负责 UI 的呈现，不带有任何业务逻辑
 - 没有状态（即不使用this.state这个变量）
 - 所有数据都由参数（this.props）提供
 - 不使用任何 Redux 的 API

因为不含有状态，UI 组件又称为"纯组件"，即它纯函数一样，纯粹由参数决定它的值。

2.容器组件的特征恰恰相反。
 - 负责管理数据和业务逻辑，不负责 UI 的呈现
 - 带有内部状态
 - 使用 Redux 的 API

UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。
React-Redux 规定，所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成。即用户负责视觉层，状态管理则是全部交给它。

拆分 UI 组件和容器组件的好处

 - UI 组件与后台数据无关，可以由设计师负责
 - 容器组件只负责数据和行为，一旦 Store 的数据结构变化，只要调整容器组件即可
 - 表现层和功能层脱钩，有利于代码重用，也有利于看清应用的数据结构和业务逻辑

React-Redux 提供connect方法，用于从 UI 组件生成容器组件。connect的意思，就是将这两种组件连起来。

    import { connect } from 'react-redux'
    const VisibleTodoList = connect()(TodoList);
为了定义业务逻辑，需要给出下面两方面的信息。
（1）输入逻辑：外部的数据（即state对象）如何转换为 UI 组件的参数
（2）输出逻辑：用户发出的动作如何变为 Action 对象，从 UI 组件传出去。
connect方法接受两个参数：mapStateToProps和mapDispatchToProps。它们定义了 UI 组件的业务逻辑。

 - mapStateToProps: 定义 UI 组件参数与 State 之间的映射
 - mapDispatchToProps：定义 UI 组件与 Action 之间的映射

前者负责输入逻辑，即将state映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action。
mapStateToProps()接收state作为参数，返回一个对象，里面每一个键值对就是一个映射。
使用 this.props.A键 就能够得到 A键对应的值，从而触发UI组件的重新渲染。

mapDispatchToProps是connect函数的第二个参数，用来建立 UI 组件的参数到store.dispatch方法的映射。
它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。
如果mapDispatchToProps是一个函数，会得到dispatch和ownProps（容器组件的props对象）两个参数。
如果mapDispatchToProps是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数，会被当作 Action creator ，返回的 Action 会由 Redux 自动发出。

**Provider组件**
connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成 UI 组件的参数。
React-Redux 提供Provider组件，可以让容器组件拿到state。
Provider在根组件外面包了一层，这样一来，Store传入组件，App的所有子组件就默认都可以拿到state了。

# 总结
![在这里插入图片描述](https://img-blog.csdn.net/20181023162446951?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L0plZmZyZXkyMDE3MDgxMg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
本文主要是结合网上众多资料和自己所学知识，探讨了一些对React&Redux的一些理解。
希望能对大家有所帮助~ 有问题欢迎留言交流，不足之处还请多多指正。