第十二课：OpenGL扩展
===
[TOC]

扩展
---
GPU的性能随着更新换代一直在提高，支持渲染更多的三角形和像素。不过，我们不能仅仅只关心硬件性能。为了提升显卡性能，NVIDIA, AMD和Intel还增加了许多新功能。我们来看一些例子。

###ARB_fragment_program###

时光倒流到2002年，那时GPU都没有顶点着色器或片段着色器：一切都硬编码在芯片中。这被称为固定功能流水线（Fixed-Function Pipeline (FFP)）。当时最新的OpenGL 1.3中同样也没有API可以创建、操作和使用所谓的“着色器”，因为那时压根就没有着色器。接着NVIDIA决定用实际代码来取代数以百计的标记和状态量，描述渲染过程。这就是`ARB_fragment_program`的由来。当时还没有GLSL，但你可以写这样的程序：

```
    !!ARBfp1.0 MOV result.color, fragment.color; END
```
但若要显式地令OpenGL使用这些代码，您需要一些尚未包含在OpenGL中的特殊函数。在对这条语句进行解释前，我们先来看个例子。

###ARB_debug_output###

好吧，您也许会说“`ARB_fragment_program`太老了，我肯定不需要扩展这东西”。其实有不少新的扩展非常方便。其中一个便是`ARB_debug_output`，它提供了一个不存在于OpenGL 3.3中的，但你可以/应该用到的功能。它定义了像`GL_DEBUG_OUTPUT_SYNCHRONOUS_ARB`或`GL_DEBUG_SEVERITY_MEDIUM_ARB`之类的字符串，和`DebugMessageCallbackARB`这样的函数。这个扩展的伟大之处在于，当您写了一如下这样的些错误代码时，您能得到错误消息和错误的精确位置：

```cpp
glEnable(GL_TEXTURE); // Incorrect ! You probably meant GL_TEXTURE_2D !
```
总结一下经验：

- 即便在新式的OpenGL 3.3中，扩展仍旧十分有用。
- 请使用`ARB_debug_output` ！下文有链接。

<img class="alignnone size-large wp-image-622" title="breakpoint" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/02/breakpoint-1024x678.png" alt="" width="640" height="423" />

###复杂方法：获取个别扩展###

“手动”查找一个扩展的方法是使用以下代码片段（转自[OpenGL.org wiki](http://www.opengl.org/wiki/GlGetString)）：

```
int NumberOfExtensions;
glGetIntegerv(GL_NUM_EXTENSIONS, &amp;NumberOfExtensions);
for(i=0; i&lt;NumberOfExtensions; i++) {
  const GLubyte *ccc=glGetStringi(GL_EXTENSIONS, i);
  if ( strcmp(ccc, (const GLubyte *)&quot;GL_ARB_debug_output&quot;) == 0 ){
    // The extension is supported by our hardware and driver
    // Try to get the &quot;glDebugMessageCallbackARB&quot; function :
    glDebugMessageCallbackARB  = (PFNGLDEBUGMESSAGECALLBACKARBPROC) wglGetProcAddress(&quot;glDebugMessageCallbackARB&quot;);
  }
}
```
###简单方法：获取所有扩展###

上面的方式太复杂。若用GLEW, GLee, gl3w这些库，就简单多了。例如，有了GLEW，你只需要在创建窗口后调用`glewInit()`，不少方便的变量就创建好了：  
```cpp
if (GLEW_ARB_debug_output){ // Ta-Dah ! }
```
（小心：`debug_output`身份特殊，因为您需要在创建上下文的时候启用它。在GLFW中，这通过`glfwOpenWindowHint(GLFW_OPENGL_DEBUG_CONTEXT, 1)`完成。）

###ARB vs EXT vs ...###
扩展名称表明了其适用范围：

+ GL_：所有平台；
+ GLX_：仅Linux和Mac下可使用（X11）；
+ WGL_：仅Windows下可使用。
+ EXT：一般扩展。
+ ARB：已经被OpenGL架构评审委员会（OpenGL Architecture Review Board ）的所有成员接受（一般EXT扩展不久就被提交到ARB）的扩展。
NV/AMD/INTEL：顾名思义 =)

设计与扩展
---
###问题###

假如您的OpenGL 3.3应用程序需要渲染一些大型线条。您可以用一个复杂的顶点着色器搞定，也可以避繁就简，用[GL_NV_path_rendering](http://www.opengl.org/registry/specs/NV/path_rendering.txt)帮您处理所有复杂的细节。

因此您可以这样写：

```
if ( GLEW_NV_path_rendering ){
    glPathStringNV( ... ); // Draw the shape. Easy !
}else{
    // Else what ? You still have to draw the lines
    // on older NVIDIA hardware, on AMD and on INTEL !
    // So you have to implement it yourself anyway !
}
```
###均衡考量###

当使用扩展的收益（如渲染质量、性能）大于维护两种方法的代价时，我们通常选择使用扩展。

例如，在时空幻境（Braid, 一个时空穿越2D游戏）中，当您干扰时间时，就会有各种各样的图像扭曲效果，而这种效果在旧硬件上没法渲染。

而在OpenGL 3.3及更高版本中包含了很多称手的工具，您会经常用到。诸如`GL_AMD_pinned_memory`这样的扩展，虽然没法像几年前的`GL_ARB_framebuffer_object`（用于渲染到纹理）一样大幅改善游戏品质，却能能派上大用场。

如果您不得不兼容老硬件，那么就无法使用OpenGL 3+，只能用OpenGL 2+。您将再也无法使用各种神奇的扩展了，必须自行处理各种问题。

更多的细节可以参考例子[OpenGL 2.1版本的第14课 - 纹理渲染，第152行](http://code.google.com/p/opengl-tutorial-org/source/browse/tutorial14_render_to_texture/tutorial14.cpp?name=2.1%20branch#152)，需手动检查`GL_ARB_framebuffer_object`是否存在。参见[FAQ](http://www.opengl-tutorial.org/miscellaneous/faq/)。

结论
---
如果用户的GPU支持OpenGL扩展，那么OpenGL扩展将是增加OpenGL功能的绝佳方法。 

目前OpenGL大部分功能位于核心库，扩展尚属高级用法，其维护成本也较高，但了解其运作方式，学会用它提高软件性能还是很重要的。

深度阅读
---

- [debug_output tutorial by Aks](http://sites.google.com/site/opengltutorialsbyaks/introduction-to-opengl-4-1---tutorial-05) 得益于GLEW，您可以跳过第一步。
- [The OpenGL extension registry](http://www.opengl.org/registry/) 所有扩展的规格说明。这是本宝典。
- [GLEW](http://glew.sourceforge.net/) The OpenGL Extension Wrangler Library
- [gl3w](https://github.com/skaslev/gl3w)简单的OpenGL 3/4 core profile加载 


> &copy; http://www.opengl-tutorial.org/

> Written with [StackEdit](https://stackedit.io/).