第二课：绘制第一个三角形
============
[TOC]

本课依然是“长篇大论”。

用OpenGL 3绘制复杂的物体很方便，绘制一个简单的三角形却十分麻烦。

别忘了时不时地复制粘贴代码，动手调试。

> *如果程序启动时崩溃了，很可能是您从错误的目录下运行了它。请仔细地阅读第一课中讲到的如何配置Visual Studio！*

顶点数组对象(VAO)
--------
您需要创建一个顶点数组对象，并将它设为当前对象（细节暂不深入）：

    GLuint VertexArrayID;
    glGenVertexArrays(1, &VertexArrayID);
    glBindVertexArray(VertexArrayID);

窗口创建成功（即OpenGL上下文创建后）紧接着完成上述动作；这一步必须在其他OpenGL调用前完成。

若想进一步了解顶点数组对象（VAO）可以参考其他教程，不过VAO不是很重要。

屏幕坐标系
--------
三点确定一个三角形。当我们谈论3D图形学中的“点（point）”时，我们常常采用“顶点（Vertex，复数vertices）”这个词。一个顶点有三个坐标：X，Y和Z。您可以这样想象这三个坐标：

- X在您的右方
- Y在您的上方
- Z是指向您背后（没错，是背后，不是前方）

还有更形象的方法：使用右手定则

- 拇指代表X
- 食指代表Y
- 中指代表Z。如果您的拇指指向右边，食指指向天空，那么中指将指向您的背后。

Z的指向很费解，为什么要这样呢？简言之：因为基于右手定则的坐标系统被广泛使用了100多年，这一系统中不乏许多实用的数学工具，唯一的缺点就是是Z方向有些别扭。

补充说明一下，您的手可以自由地移动：X，Y和Z轴也将随之移动（详见后文）。

我们需要三个3D点来组成一个三角形；现在开始：

    // An array of 3 vectors which represents 3 vertices
    static const GLfloat g_vertex_buffer_data[] = {
       -1.0f, -1.0f, 0.0f,
       1.0f, -1.0f, 0.0f,
       0.0f,? 1.0f, 0.0f,
    };

第一个顶点是(-1, -1, 0)。
这意味着除非以某种方式变换它，否则它将显示在屏幕的(-1, -1)位置。什么意思呢？屏幕的原点在中间，X在右方，Y在上方。屏幕坐标如下图：

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/04/screenCoordinates.png"><img class="alignnone size-medium wp-image-16" title="screenCoordinates" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/04/screenCoordinates-300x165.png" alt="" width="300" height="165"></a>

这是显卡的固有机制，无法改变。因此(-1, -1)是屏幕的左下角，(1, -1)是右下角，(0, 1)在中上位置。这个三角形应该占据了大部分屏幕。

绘制三角形
--------
下一步，通过缓冲区把三角形传给OpenGL：

    // This will identify our vertex buffer
    GLuint vertexbuffer;
    
    // Generate 1 buffer, put the resulting identifier in vertexbuffer
    glGenBuffers(1, &vertexbuffer);
    
    // The following commands will talk about our 'vertexbuffer' buffer
    glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
    
    // Give our vertices to OpenGL.
    glBufferData(GL_ARRAY_BUFFER, sizeof(g_vertex_buffer_data), g_vertex_buffer_data, GL_STATIC_DRAW);

这步操作仅需执行一次即可。

之前在main loop中我们什么也没绘制，现在终于可以绘制三角形了：

        // 1rst attribute buffer : vertices
    glEnableVertexAttribArray(0);
    glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
    glVertexAttribPointer(
       0,                  // attribute 0. No particular reason for 0, but must match the layout in the shader.
       3,                  // size
       GL_FLOAT,           // type
       GL_FALSE,           // normalized?
       0,                  // stride
       (void*)0            // array buffer offset
    );

    // Draw the triangle !
    glDrawArrays(GL_TRIANGLES, 0, 3); // Starting from vertex 0; 3 vertices total -> 1 triangle
    
    glDisableVertexAttribArray(0);

结果如图：

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/04/triangle_no_shader1.png"><img class="alignnone size-medium wp-image-858" title="triangle_no_shader" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/04/triangle_no_shader1-300x232.png" alt="" width="300" height="232"></a>

白色太单调了。来看看怎么把它涂成红色吧。这就需要用到『着色器（Shader）』了。

着色器
--------
###编译着色器
在最简单的配置下，您得有两个着色器：一个叫顶点着色器，它将作用于每个顶点上；另一个叫片断（Fragment）着色器，它将作用于每一个采样点。我们使用4倍反走样，因此每个像素有四个采样点。

着色器编程使用GLSL(GL Shader Language，GL着色语言)，它是OpenGL的一部分。与C、Java不同，GLSL必须在运行时编译，这意味着每次启动程序，所有的着色器将重新编译。

这两个着色器通常单独存放在文件里。本例中有SimpleFragmentShader.fragmentshader和SimpleVertexShader.vertexshader两个着色器。扩展名无关紧要，.txt或者.glsl也行。

以下是代码。没必要完全理解它，因为通常在程序中这些操作仅需执行一次，结合注释能看懂就够了。其他课程代码都用到了这个函数，因此将其放在一个单独的文件中：common/loadShader.cpp。注意，着色器和缓冲区一样不能直接访问：我们仅仅有一个ID。真正的实现隐藏在驱动程序中。

    GLuint LoadShaders(const char * vertex_file_path,const char * fragment_file_path){

        // Create the shaders
        GLuint VertexShaderID = glCreateShader(GL_VERTEX_SHADER);
        GLuint FragmentShaderID = glCreateShader(GL_FRAGMENT_SHADER);
    
        // Read the Vertex Shader code from the file
        std::string VertexShaderCode;
        std::ifstream VertexShaderStream(vertex_file_path, std::ios::in);
        if(VertexShaderStream.is_open())
        {
            std::string Line = "";
            while(getline(VertexShaderStream, Line))
                VertexShaderCode += "n" + Line;
            VertexShaderStream.close();
        }
    
        // Read the Fragment Shader code from the file
        std::string FragmentShaderCode;
        std::ifstream FragmentShaderStream(fragment_file_path, std::ios::in);
        if(FragmentShaderStream.is_open()){
            std::string Line = "";
            while(getline(FragmentShaderStream, Line))
                FragmentShaderCode += "n" + Line;
            FragmentShaderStream.close();
        }
    
        GLint Result = GL_FALSE;
        int InfoLogLength;
    
        // Compile Vertex Shader
        printf("Compiling shader : %sn", vertex_file_path);
        char const * VertexSourcePointer = VertexShaderCode.c_str();
        glShaderSource(VertexShaderID, 1, &amp;VertexSourcePointer , NULL);
        glCompileShader(VertexShaderID);
    
        // Check Vertex Shader
        glGetShaderiv(VertexShaderID, GL_COMPILE_STATUS, &amp;Result);
        glGetShaderiv(VertexShaderID, GL_INFO_LOG_LENGTH, &amp;InfoLogLength);
        std::vector VertexShaderErrorMessage(InfoLogLength);
        glGetShaderInfoLog(VertexShaderID, InfoLogLength, NULL, &amp;VertexShaderErrorMessage[0]);
        fprintf(stdout, "%sn", &amp;VertexShaderErrorMessage[0]);
    
        // Compile Fragment Shader
        printf("Compiling shader : %sn", fragment_file_path);
        char const * FragmentSourcePointer = FragmentShaderCode.c_str();
        glShaderSource(FragmentShaderID, 1, &amp;FragmentSourcePointer , NULL);
        glCompileShader(FragmentShaderID);
    
        // Check Fragment Shader
        glGetShaderiv(FragmentShaderID, GL_COMPILE_STATUS, &amp;Result);
        glGetShaderiv(FragmentShaderID, GL_INFO_LOG_LENGTH, &amp;InfoLogLength);
        std::vector FragmentShaderErrorMessage(InfoLogLength);
        glGetShaderInfoLog(FragmentShaderID, InfoLogLength, NULL, &amp;FragmentShaderErrorMessage[0]);
        fprintf(stdout, "%sn", &amp;FragmentShaderErrorMessage[0]);
    
        // Link the program
        fprintf(stdout, "Linking programn");
        GLuint ProgramID = glCreateProgram();
        glAttachShader(ProgramID, VertexShaderID);
        glAttachShader(ProgramID, FragmentShaderID);
        glLinkProgram(ProgramID);
    
        // Check the program
        glGetProgramiv(ProgramID, GL_LINK_STATUS, &amp;Result);
        glGetProgramiv(ProgramID, GL_INFO_LOG_LENGTH, &amp;InfoLogLength);
        std::vector ProgramErrorMessage( max(InfoLogLength, int(1)) );
        glGetProgramInfoLog(ProgramID, InfoLogLength, NULL, &amp;ProgramErrorMessage[0]);
        fprintf(stdout, "%sn", &amp;ProgramErrorMessage[0]);
    
        glDeleteShader(VertexShaderID);
        glDeleteShader(FragmentShaderID);
    
        return ProgramID;
    }

###顶点着色器

先写顶点着色器。
第一行告诉编译器我们将用OpenGL 3语法。

    #version 330 core

第二行声明输入数据：

    layout(location = 0) in vec3 vertexPosition_modelspace;

下面详细解释这一行：

- 在GLSL中“vec3”代表一个三维向量。类似但不等同于之前声明三角形的glm::vec3。最重要的是，如果我们在C++中使用三维向量，那么在GLSL中也要相应地使用三维向量。
- "layout(location = 0)"指向存储vertexPosition_modelspace属性的缓冲区。每个顶点有多种属性：位置，一种或多种颜色，一个或多个纹理坐标等等。OpenGL并不清楚什么是颜色，它只能识别vec3这样的数据类型。因此我们必须将glvertexAttribPointer函数的第一个参数值赋给layout，以此告知OpenGL每个缓冲对应的是哪种属性数据。第二个参数“0”并不重要，也可以换成12（但是不能超过glGetIntegerv(GL_MAX_VERTEX_ATTRIBS, &v)），关键是C++和GLSL两边数值保持一致。
- “vertexPosition_modelspace”这个变量名可以任取，其中保存的是顶点位置，vertex shader每次运行时都会用到。
- “in”的意思是这是输入数据。不久我们将会看到“out”关键字。


每个顶点都会调用main函数（和C语言一样）：

    void main(){
这里的main函数只是简单地将缓冲区里的值作为顶点位置。因此如果位置是（1,1），那么三角形有一个顶点位于屏幕的右上角。
在下一课中我们将看到怎样对输入位置做一些更有趣的计算。

        gl_Position.xyz = vertexPosition_modelspace;
    	gl_Position.w = 1.0;
    }
gl_Position是仅有的几个内置变量之一：您必须赋一个值给它。其他操作都是可选的，我们将在第四课中看到究竟有哪些“其他操作”。

###片断着色器
这就是我们的第一个片断着色器，它仅仅简单将每个片断的颜色设为红色。（记住，由于我们采用了4倍反走样，因此每个像素有4个片断）

    #version 330 core
    out vec3 color;
    
    void main(){
        color = vec3(1,0,0);
    }
vec3(1,0,0)代表红色。因为在计算机屏幕上，颜色由红，绿，蓝这个三元组表示。因此（1,0,0）是纯红色，没有绿色、蓝色。

汇总
--------
在main loop之前调用LoadShaders函数：

    // Create and compile our GLSL program from the shaders
    GLuint programID = LoadShaders( "SimpleVertexShader.vertexshader", "SimpleFragmentShader.fragmentshader" );
首先在main中清屏。由于在main loop之前调用了glClearColor(0.0f, 0.0f, 0.4f, 0.0f) ，因此这一步操作将把背景色设为暗红色。

    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
然后告知OpenGL采用您的着色器：

    // Use our shader
    glUseProgram(programID);

    // Draw triangle...
...然后，当当当当，这就是您绘制的红色三角形啦！

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/04/red_triangle.png"><img class="alignnone size-medium wp-image-15" title="red_triangle" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/04/red_triangle-300x231.png" alt="" width="300" height="231"></a>

下一课中我们将学习变换（transformation）：设置相机，移动物体等等。

> &copy; http://www.opengl-tutorial.org/

> Written with [StackEdit](https://stackedit.io/).