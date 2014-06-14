第十二课：OpenGL扩展
===
[TOC]

扩展
---
GPU的性能随着更新换代一直在提高，支持渲染更多的三角形和像素点。然而，原始性能不是我们唯一关心的。NVIDIA, AMD和Intel也通过增加功能来改善他们的显卡。来看一些例子。

###ARB_fragment_program###

时光倒回到2002年，那时GPU都没有vertex shader或fragment shader：所有的一切都硬编码在芯片中。这被称为固定功能流水线（Fixed-Function Pipeline (FFP)）。当时最新的OpenGL 1.3中同样也没有API可以创建、操作和使用所谓的“着色器”，因为它根本不存在。接着NVIDIA决定用实际代码描述渲染过程，来取代数以百计的标记和状态量。这就是`ARB_fragment_program`的由来。当时还没有GLSL，但你可以写这样的程序：
```
    !!ARBfp1.0 MOV result.color, fragment.color; END
```
但若要显式地令OpenGL使用这些代码，您需要一些尚未包含在OpenGL中的特殊函数。在进行解释前，再举个例子。

###ARB_debug_output###

好吧，您也许会说“ARB_fragment_program太老了，我肯定不需要扩展这东西”？其实有不少新的扩展非常方便。其中一个便是ARB_debug_output，它提供了一个不存在于OpenGL 3.3中的，但你可以/应该用到的功能。它定义了像GL_DEBUG_OUTPUT_SYNCHRONOUS_ARB或GL_DEBUG_SEVERITY_MEDIUM_ARB之类的字符串，和DebugMessageCallbackARB这样的函数。这个扩展的伟大之处在于，当你写了一些不正确的代码，例如：
```cpp
glEnable(GL_TEXTURE); // Incorrect ! You probably meant GL_TEXTURE_2D !
```
您能得到错误消息和错误的精确位置。总结：

- 即便在新式的OpenGL 3.3中，扩展仍旧十分有用。
- 请使用ARB_debug_output ！下文有链接。

<img class="alignnone size-large wp-image-622" title="breakpoint" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/02/breakpoint-1024x678.png" alt="" width="640" height="423" />

###获取扩展 - 复杂的方式 ###

“手动”查找一个扩展的方法是使用以下代码片断（转自[OpenGL.org wiki](http://www.opengl.org/wiki/GlGetString)）：
```cpp
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
###获得所有的扩展 - 简单的方式###

上面的方式太复杂。若用GLEW, GLee, gl3w这些库，就简单多了。例如，有了GLEW，你只需要在创建窗口后调用`glewInit()`，不少方便的变量就创建好了：  
```cpp
if (GLEW_ARB_debug_output){ // Ta-Dah ! }
```
（小心：`debug_output`身份特殊，因为您需要在创建上下文的时候启用它。在GLFW中，这通过`glfwOpenWindowHint(GLFW_OPENGL_DEBUG_CONTEXT, 1)`完成。）

###ARB vs EXT vs ...###
扩展的名字暗示了它的适用范围：

+ GL_：所有平台；
+ GLX_：仅Linux和Mac下可使用（X11）；
+ WGL_：仅Windows下可使用。
+ EXT：一般扩展。
+ ARB：已经被OpenGL架构评审委员会（OpenGL Architecture Review Board ）的所有成员接受（一般EXT扩展不久就被提升为ARB）的扩展。
NV/AMD/INTEL：顾名思义 =)

设计与扩展
---
###问题###

假如您的OpenGL 3.3应用程序需要渲染一些大型线条。您可以写一个复杂的vertex shader来完成，或者简单地用[GL_NV_path_rendering](http://www.opengl.org/registry/specs/NV/path_rendering.txt)，它能帮你处理所有复杂的事。

因此您可以这样写代码：
```cpp
if ( GLEW_NV_path_rendering ){
    glPathStringNV( ... ); // Draw the shape. Easy !
}else{
    // Else what ? You still have to draw the lines
    // on older NVIDIA hardware, on AMD and on INTEL !
    // So you have to implement it yourself anyway !
}
```
###均衡考量###

当使用扩展的益处（如渲染质量、性能）超过维护两种不同方法（如上面的代码，一种靠你自己实现，一种使用扩展）的代价时，通常就选择用扩展。

例如，在时空幻境（Braid, 一个时空穿越的2D游戏）中，当你干扰时间时，就会有各种各样的图像变形效果，而这种效果在旧硬件上没法渲染。

而在OpenGL 3.3及更高版本中，包含了99%的可能会用到的工具。一些扩展很有用，比如`GL_AMD_pinned_memory`，虽然它通常没法像几年前使用`GL_ARB_framebuffer_object`（用于纹理渲染）那样让你的游戏看起来变好10倍。

如果您不得不兼容老硬件，那么就不能用OpenGL 3+，您得用OpenGL 2+来代替。您将不再能使用各种神奇的扩展了，必须自行处理那些问题。

更多的细节可以参考例子[OpenGL 2.1版本的第14课 - 纹理渲染，第152行](http://code.google.com/p/opengl-tutorial-org/source/browse/tutorial14_render_to_texture/tutorial14.cpp?name=2.1%20branch#152)，需手动检查`GL_ARB_framebuffer_object`是否存在。常见问题可见[FAQ](http://www.opengl-tutorial.org/miscellaneous/faq/)。
结论
---
OpenGL扩展提供了一个很好的方式来增强OpenGL的功能，它依赖于你用户的GPU。 

虽然现在扩展属于高级用法（因为大部分功能在核心中已经有了），了解扩展如何运作和怎么用它提高软件性能（付出更高的维护代价）还是很重要的。

深度阅读
---

- [debug_output tutorial by Aks](http://sites.google.com/site/opengltutorialsbyaks/introduction-to-opengl-4-1---tutorial-05) 有了GLEW，您可以跳过第一步。
- [The OpenGL extension registry](http://www.opengl.org/registry/) 所有扩展的规格说明。这是本宝典。
- [GLEW](http://glew.sourceforge.net/) OpenGL标准扩展库
- [gl3w](https://github.com/skaslev/gl3w)简单的OpenGL 3/4 core profile加载 


> &copy; http://www.opengl-tutorial.org/

> Written with [StackEdit](https://stackedit.io/).