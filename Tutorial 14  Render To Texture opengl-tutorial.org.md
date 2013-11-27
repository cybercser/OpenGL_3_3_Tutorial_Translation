第十四课：渲染到纹理
===
[TOC]

“渲染到纹理”是一系列特效方法之一。基本思想是：像通常那样渲染一个场景——只是这次是渲染到可以重用的纹理中。

应用包括：游戏（in-game）相机、后期处理（post-processing）以及你能想象到一切.

渲染到纹理
---
我们有三个任务：创建要渲染的纹理对象；将纹理渲染到对象上；使用生成的纹理。

###创建渲染目标（Render Target）###

我们要渲染的对象叫做帧缓存。它像一个容器，用来存纹理和一个可选的深度缓冲区(depth buffer)。在OpenGL中我们可以像创建其他对象一样创建它:
```cpp
// The framebuffer, which regroups 0, 1, or more textures, and 0 or 1 depth buffer.
GLuint FramebufferName = 0;
glGenFramebuffers(1, &amp;FramebufferName);
glBindFramebuffer(GL_FRAMEBUFFER, FramebufferName);
```
现在需要创建纹理，纹理中包含着色器的RGB输出。这段代码非常的经典：
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
同时还需要一个深度缓冲区（depth buffer）。这是可选的，取决于纹理中实际需要画的东西；由于我们渲染的是小猴Suzanne，所以需要深度测试。
```cpp
// The depth buffer
GLuint depthrenderbuffer;
glGenRenderbuffers(1, &amp;depthrenderbuffer);
glBindRenderbuffer(GL_RENDERBUFFER, depthrenderbuffer);
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH_COMPONENT, 1024, 768);
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, GL_RENDERBUFFER, depthrenderbuffer);
```
最后，配置frameBuffer。
```cpp
// Set "renderedTexture" as our colour attachement #0
glFramebufferTexture(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, renderedTexture, 0);

// Set the list of draw buffers.
GLenum DrawBuffers[2] = {GL_COLOR_ATTACHMENT0};
glDrawBuffers(1, DrawBuffers); // "1" is the size of DrawBuffers
```
这个过程中可能出现一些错误，取决于GPU的性能；下面是检查的方法：
```cpp
// Always check that our framebuffer is ok
if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
    return false;
```
###渲染到纹理###

渲染到纹理很直观。简单地绑定帧缓存，然后像往常一样画场景。轻松搞定！
```cpp
// Render to our framebuffer
glBindFramebuffer(GL_FRAMEBUFFER, FramebufferName);
glViewport(0,0,1024,768); // Render on the whole framebuffer, complete from the lower left corner to the upper right
```
fragment shader只需稍作调整：
```glsl
layout(location = 0) out vec3 color;
```
这意味着每当修改变量“color”时，实际修改了0号渲染目标；这是因为之前调用了`glFramebufferTexture(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, renderedTexture, 0);

注意：最后一个参数表示mipmap的级别，这个0和GL_COLOR_ATTACHMENT0没有任何关系。

###使用渲染出的纹理###
我们将画一个简单的铺满屏幕的四边形。需要buffer、shader、ID……
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
现在想渲染到屏幕上的话，必须把glBindFramebuffer的第二个参数设为0。
```cpp
// Render to the screen
glBindFramebuffer(GL_FRAMEBUFFER, 0);
glViewport(0,0,1024,768); // Render on the whole framebuffer, complete from the lower left corner to the upper right
```
我们用下面这个shader来画全屏的四边形：
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

这段代码只是简单地采样纹理，加上一个随时间变化的微小偏移。

结果
---
<img class="alignnone size-large wp-image-326" title="wavvy" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/05/wavvy-1024x793.png" alt="" width="640" height="495" />

进一步探索
---
###使用深度###
在一些情况下，使用已渲染的纹理可能需要深度。本例中，像下面这样，简单地渲染到纹理中：
```cpp
glTexImage2D(GL_TEXTURE_2D, 0,GL_DEPTH_COMPONENT24, 1024, 768, 0,GL_DEPTH_COMPONENT, GL_FLOAT, 0);
```
(“24”是精度。你可以按需从16,24,32中选。通常24刚好)

上面这些已经足够您起步了。课程源码中有完整的实现。

运行可能有点慢，因为驱动无法使用[Hi-Z](http://developer.amd.com/media/gpu_assets/Depth_in-depth.pdf)这类优化。

下图的深度层次已经经过手动“优化”。通常，深度纹理不会这么清晰。深度纹理中，近 = Z接近0 = 颜色深； 远 = Z接近1 = 颜色浅。

<img class="alignnone size-large wp-image-337" title="wavvydepth" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/05/wavvydepth-1024x793.png" alt="" width="640" height="495" />

###多重采样###
能够用多重采样纹理来替代基础纹理：只需要在C++代码中将glTexImage2D替换为[glTexImage2DMultisample](http://www.opengl.org/sdk/docs/man3/xhtml/glTexImage2DMultisample.xml)，在fragment shader中将`sampler2D/texture`替换为`sampler2DMS/texelFetch`。 

但要注意：`texelFetch`多出了一个参数，表示采样的数量。换句话说，就是没有自动“滤波”（在多重采样中，正确的术语是“分辨率（resolution）”）功能。

所以需要你自己解决多重采样的纹理，另外，非多重采样纹理，是多亏另一个着色器。

没有什么难点，只是体积庞大。

###多重渲染目标###
你可能需要同时写多个纹理。

简单地创建若干纹理（都要有正确、一致的大小！），调用glFramebufferTexture，为每一个纹理设置一个不同的color attachement，用更新的参数（如`(2,{GL_COLOR_ATTACHMENT0,GL_COLOR_ATTACHMENT1,GL_DEPTH_ATTACHMENT})`一样）调用glDrawBuffers，然后在片断着色器中多添加一个输出变量：
```glsl
layout(location = 1) out vec3 normal_tangentspace; // or whatever
```
提示1：如果真需要在纹理中输出向量，浮点纹理也是有的，可以用16或32位精度代替8位……看看[glTexImage2D](http://www.opengl.org/sdk/docs/man/xhtml/glTexImage2D.xml)的参考手册（搜GL_FLOAT）。
提示2：对于以前版本的OpenGL，请使用glFragData[1] = myvalue。

练习
---
- 试使用`glViewport(0,0,512,768)`代替`glViewport(0,0,1024,768)`；（帧缓存、屏幕两种情况都试试）
- 在最后一个fragment shader中尝试一下用其他UV坐标
- 试用一个真正的变换矩阵变换四边形。首先用硬编码方式。然后尝试使用`controls.hpp`里面的函数，观察到了什么现象？

> &copy; http://www.opengl-tutorial.org/

> Written with [StackEdit](https://stackedit.io/).