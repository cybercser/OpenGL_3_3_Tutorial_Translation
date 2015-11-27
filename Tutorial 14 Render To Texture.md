第十四课：渲染到纹理
===
[TOC]

Tags： OpenGL 教程

“渲染到纹理”是一种特效方法，基本思想是将场景渲染到可重用的纹理中。其应用包括：游戏内置摄像机（in-game camera）、后期处理（post-processing）以及各种超乎想象的特效（GFX，Graphics Effects）。

渲染到纹理
---
整个过程分为三步：创建用于渲染的纹理；在纹理中进行渲染；使用第二步生成的纹理。

###创建渲染目标（Render Target）###

我们将把场景渲染到帧缓冲。帧缓冲是用于存储纹理（可附加深度缓冲（depth buffer））的容器。我们可以像创建其他OpenGL对象一样创建帧缓冲:
```cpp
// The framebuffer, which regroups 0, 1, or more textures, and 0 or 1 depth buffer.
GLuint FramebufferName = 0;
glGenFramebuffers(1, &amp;FramebufferName);
glBindFramebuffer(GL_FRAMEBUFFER, FramebufferName);
```
现在我们需要创建包含着色器RGB输出的纹理。这段代码非常经典：
```cpp
// The texture we're going to render to
GLuint renderedTexture;
glGenTextures(1, &amp;renderedTexture);

// "Bind" the newly created texture : all future texture functions will modify this texture
glBindTexture(GL_TEXTURE_2D, renderedTexture);

// Give an empty image to OpenGL ( the last &quot;0&quot; )
glTexImage2D(GL_TEXTURE_2D, 0,GL_RGB, 1024, 768, 0,GL_RGB, GL_UNSIGNED_BYTE, 0);

// Poor filtering. Needed !
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
```
同时，我们还需要一个深度缓冲。深度缓冲是可选的。是否需要深度缓冲取决于渲染到纹理上的内容。由于我们渲染的小猴Suzanne是一个3D模型，所以需要进行深度测试。
```cpp
// The depth buffer
GLuint depthrenderbuffer;
glGenRenderbuffers(1, &amp;depthrenderbuffer);
glBindRenderbuffer(GL_RENDERBUFFER, depthrenderbuffer);
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, 1024, 768);
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, depthrenderbuffer);
```
最后，配置帧缓冲。
```cpp
// Set "renderedTexture" as our colour attachement #0
glFramebufferTexture(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, renderedTexture, 0);

// Set the list of draw buffers.
GLenum DrawBuffers[1] = {GL_COLOR_ATTACHMENT0};
glDrawBuffers(1, DrawBuffers); // "1" is the size of DrawBuffers
```
由于各种GPU之间的性能差异，这个过程中可能出现一些错误；如下是查错的方法：
```cpp
// Always check that our framebuffer is ok
if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
return false;
```
###渲染到纹理###

这一步简单明了。只需绑定帧缓冲，然后像平常一样绘制场景。轻松搞定！
```cpp
// Render to our framebuffer
glBindFramebuffer(GL_FRAMEBUFFER, FramebufferName);
glViewport(0,0,1024,768); // Render on the whole framebuffer, complete from the lower left corner to the upper right
```
片段着色器只需稍作调整：
```glsl
layout(location = 0) out vec3 color;
```
这也就是说，对变量“color”写入实际上就是在对0号渲染目标（当前纹理）进行写入；`DrawBuffers[0]`就是`GL_COLOR_ATTACHMENT0`，亦即`renderedTexture`（渲染的纹理）。

再强调一下：

+ 语句`layout(locatio=0)`指定将`color`写入到第一个缓冲
+ 数组`DrawBuffers[1] = {GL_COLOR_ATTACHMENT0}`，因此第一个缓冲是`GL_COLOR_ATTACHMENT0`
+ `renderedTexture`依附于`GL_COLOR_ATTACHMENT0`，因此`color`将被写入此处
+ 换句话说，就算把`GL_COLOR_ATTACHMENT0`换成`GL_COLOR_ATTACHMENT0`也照样没问题

附注：OpenGL 3.3之前的版本不支持语句`layout(location=0)`，不过可以用`glFragData[i]＝xxx`替代。

###使用渲染的纹理###
我们将绘制一个简单的、铺满屏幕的四边形。如下代码对各种缓冲、着色器、ID等进行设置。
```cpp
// The fullscreen quad's FBO
GLuint quad_VertexArrayID;
glGenVertexArrays(1, &quad_VertexArrayID);
glBindVertexArray(quad_VertexArrayID);

static const GLfloat g_quad_vertex_buffer_data[] = {
-1.0f, -1.0f, 0.0f,
1.0f, -1.0f, 0.0f,
-1.0f,  1.0f, 0.0f,
-1.0f,  1.0f, 0.0f,
1.0f, -1.0f, 0.0f,
1.0f,  1.0f, 0.0f,
};

GLuint quad_vertexbuffer;
glGenBuffers(1, &quad_vertexbuffer);
glBindBuffer(GL_ARRAY_BUFFER, quad_vertexbuffer);
glBufferData(GL_ARRAY_BUFFER, sizeof(g_quad_vertex_buffer_data), g_quad_vertex_buffer_data, GL_STATIC_DRAW);

// Create and compile our GLSL program from the shaders
GLuint quad_programID = LoadShaders( "Passthrough.vertexshader", "SimpleTexture.fragmentshader" );
GLuint texID = glGetUniformLocation(quad_programID, "renderedTexture");
GLuint timeID = glGetUniformLocation(quad_programID, "time");
```
必须把`glBindFramebuffer`的第二个参数设为0，才能渲染到屏幕上。
```cpp
// Render to the screen
glBindFramebuffer(GL_FRAMEBUFFER, 0);
glViewport(0,0,1024,768); // Render on the whole framebuffer, complete from the lower left corner to the upper right
```
我们用如下着色器来绘制全屏的四边形：
```glsl
#version 330 core

in vec2 UV;

out vec3 color;

uniform sampler2D renderedTexture;
uniform float time;

void main(){
color = texture( renderedTexture, UV + 0.005*vec2( sin(time+1024.0*UV.x),cos(time+768.0*UV.y)) ).xyz;
}
``` 

这段代码对纹理进行采样，并加上一个随时间变化的微小偏移量。

结果
---
![wavvy](http://www.opengl-tutorial.org/assets/images/tuto-14-render-to-texture/wavvy.png)

延伸阅读
---
###使用深度缓冲###
在某些情况下可能还需要深度才能使用渲染的纹理。如下面例子所示，创建渲染纹理：
```cpp
glTexImage2D(GL_TEXTURE_2D, 0,GL_DEPTH_COMPONENT24, 1024, 768, 0,GL_DEPTH_COMPONENT, GL_FLOAT, 0);
```
(“24”是精度，单位是bit。你可以根据需求选择16 bit，24 bit或者32 bit。通常24 bit就可以了。)

上面这些例子已经帮您迈出了第一步，完整的实现在课程源码中。

由于驱动不支持[Hi-Z](http://developer.amd.com/media/gpu_assets/Depth_in-depth.pdf)优化，程序运行起来可能会有些慢。

如下截图的深度层次已经PS过了。一般情况下，很难从深度纹理上看出些什么信息。深度纹理中，纹素颜色越深表明Z越接近0，也就是离摄像机越近；反之，颜色越浅则意味着Z越接近1，离摄像机越远。

![wavvydepth](http://www.opengl-tutorial.org/assets/images/tuto-14-render-to-texture/wavvydepth.png)

###多重采样###
您可以用多重采样纹理取代“基本的”纹理：只需要在C++代码中将`glTexImage2D`替换为[glTexImage2DMultisample](http://www.opengl.org/sdk/docs/man3/xhtml/glTexImage2DMultisample.xml)，在片段着色器中将`sampler2D/texture`替换为`sampler2DMS/texelFetch`。 

不过要特别小心：`texelFetch`多了一个表示采样数量的参数。换句话说就是没有自动“过滤”（在多重采样中，正确的术语是“分辨率（resolution）”）。

因此您可能得在着色器中自行多重采样。这个步骤难度不大，但工作量较大。

###多渲染目标###
您可以同时对多个纹理进行写入。

创建若干纹理（尺寸要正确、一致！），调用`glFramebufferTexture`，为每个纹理设置不同的颜色依附（color attachment），以参数（如`(2,{GL_COLOR_ATTACHMENT0,GL_COLOR_ATTACHMENT1,GL_DEPTH_ATTACHMENT})`）调用`glDrawBuffers`，然后在片段着色器中添加一个输出变量：
```glsl
layout(location = 1) out vec3 normal_tangentspace; // or whatever
```
提示1：如果确实需要在纹理中输出向量，可利用浮点纹理。浮点纹理精度不是8 bit，而是16 bit或32 bit……参见[glTexImage2D](http://www.opengl.org/sdk/docs/man/xhtml/glTexImage2D.xml)的参考手册（搜索关键词`GL_FLOAT`）。
提示2：对于旧版的OpenGL，请用`glFragData[1] = xxx`代替。

练习
---
- 试用`glViewport(0,0,512,768)`替换`glViewport(0,0,1024,768)`；（帧缓冲、屏幕都改改尺寸试试）
- 在最后一个片段着色器中尝试一下其他UV坐标
- 试用变换矩阵对四边形进行变换。首先用硬编码方式，然后尝试使用`controls.hpp`里的函数，观察发生的变化。

> &copy; http://www.opengl-tutorial.org/

> Written with [Cmd Markdown](https://www.zybuluo.com/mdeditor).