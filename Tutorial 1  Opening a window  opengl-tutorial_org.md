
第一课：打开一个窗口    {#Welcome}
=====================
[TOC]
导语
--------
欢迎来到第一课 ！

在学习OpenGL之前，我们将先学习如何生成，运行，和玩转（最重要的一点）课程中的代码。

预备知识
--------
本课程不需要特别的预备知识。如果您有编程语言（C、Java、Lisp、Javascript等）的经验，理解起课程代码来会快一些；但这并非必需的；如果没有编程经验，也不过是同时学两样东西（编程语言+OpenGL）而已，会稍微麻烦点。

课程全部以“傻瓜式C++”编写：为了让代码尽量简单我费了很大劲。代码中没有模板（template）、类或指针。也就是说，即使只懂Java也能理解所有内容。

忘记一切
--------
如前所述，无需预备知识；不过，先把『旧式OpenGL』（glBegin()这类东西）忘掉吧。
在这里，您将学到新式OpenGL（OpenGL 3、4），而多数网上教程还在讲『老式OpenGL』（OpenGL 1、2）。所以，在您的脑袋乱成一团浆糊之前，先把过时的知识清空吧。

Build课程中的代码
--------
所有课程代码都能在Windows、Linux、和Mac上生成，过程大体相同：

 1. **更新驱动** ！！赶快更新吧。别怪我没提醒您哟。
 2. 下载C++编译器
 3. 安装CMake
 4. 下载全部课程代码
 5. 用CMake创建工程
 6. 编译工程
 7. 试试这些例子！

各平台的详细过程如下。可能要根据实际情况做些调整。若不确定，请按照Windows平台说明操作。

###在Windows上build

 1. 更新驱动小菜一碟。直接去NVIDIA或者AMD的官网下载。若不清楚GPU的型号:控制面板->系统和安全->系统->设备管理器->显示适配器。如果是Intel集成显卡，一般由OEM（Dell、HP…）提供驱动。
 2. 建议用Visual Studio 2010 Express来编译。[这里](http://www.microsoft.com/express/Downloads/#2010-Visual-CPP)可以免费下载。若喜欢用MinGW，推荐[Qt Creator](http://qt-project.org/)。IDE可根据个人喜好选择。下列步骤是按Visual Studio讲解的，其他IDE差别不大。
 3. 从[这里](http://www.cmake.org/cmake/resources/software.html)下载安装CMake
 4. [下载课程源码](http://www.opengl-tutorial.org/download/)，解压到例如C:\Users\XYZ\Projects\OpenGLTutorials\
 5. 启动CMake。让第一栏路径指向刚才解压缩的文件夹；不确定就选包含CMakeLists.txt的文件夹。第二栏填CMake输出路径。例如C:\Users\XYZ\Projects\OpenGLTutorials-build-Visual2010-32bits\，或者C:\Users\XYZ\Projects\OpenGLTutorials\build\Visual2010-32bits\。注意，此处可随便填，不一定要和源码在同一文件夹。![Alt text](./Tutorial_01/CMake.png)
 6. 点击Configure。由于是首次congiure工程，CMake会让您选择编译器。根据步骤1选择。如果您的系统是Windows 64位的，选64位。不清楚就选32位。
 7. 再点Configure直至红色行全部消失。点Generate。Visual Studio工程创建完毕。不再需要CMake了，可以卸载掉。
 8. 打开 C:\Users\XYZ\Projects\OpenGLTutorials-build-Visual2010-32bits\会看到Tutorials.sln文件，用Visual Studio打开它。
在Build菜单中，点Build All。每个课程代码和依赖项都将编译。生成的可执行文件会出现在 C:\Users\XYZ\Projects\OpenGLTutorials\。应该不会有错误。
 9. 打开C:\Users\XYZ\Projects\OpenGLTutorials\playground，运行playground.exe，会弹出一个黑色窗口。


也可以在Visual Studio中运行任意一课的代码，但得先设置工作目录：右键点击Playground，选择Debugging、Working Directory、Browse，设置路径为C:\Users\XYZ\Projects\OpenGLTutorials\playground\。验证一下。再次右键点击Playground，“Choose as startup project”。按F5就可以调试了。

###在Linux上build

Linux版本众多，这里不可能列出所有的平台。可根据实际情况自行调整，也不妨看一下发行版文档。

 1. 安装最新驱动。强烈推荐闭源的二进制驱动；不开源但是好用。如果发行版不提供自动安装，试试Ubuntu指南。
 2. 安装必需的编译器、工具和库。完整清单如下： cmake make g++ libx11-dev libgl1-mesa-dev libglu1-mesa-dev libxrandr-dev libxext-dev。命令行是sudo apt-get install 或者 su && yum install。
 3. 下载课程源码并解压到如 ~/Projects/OpenGLTutorials/
 4. 输入如下命令 :
cd ~/Projects/OpenGLTutorials/
mkdir build
cd build
cmake ..
 5. build目录下多了一个刚刚创建的makefile文件
 6. 键入“make all”。每个课程代码和依赖项都会被编译。生成的可执行文件在 ~/Projects/OpenGLTutorials/。应该不会有错误。
 7. 打开~/Projects/OpenGLTutorials/playground，运行./playground会弹出一个黑色窗口。

> **提示**：推荐使用Qt Creator作为IDE。值得一提的是，Qt Creator内置支持CMake，调试很方便。如下是QtCreator使用说明：

 1. 在QtCreator中打开Tools->Options->Compile-&Execute->CMake
 2. 设置CMake路径。比如 /usr/bin/cmake
 3. File->Open Project；选择 tutorials/CMakeLists.txt
 4. 选择生成目录，最好选择tutorials文件夹外面
 5. 还可以在参数栏中设置 -DCMAKE_BUILD_TYPE=Debug。验证一下。
 6. 点击下面的锤子图标。现在教程可以从tutorials/文件夹启动了。
 7. 要想在QtCreator中运行教程源码，点击Projects->Execution parameters->Working Directory，选择着色器、纹理和模型所在目录。以第二课为例：~/opengl-tutorial/tutorial02_red_triangle/

###在Mac上build

Mac OS不支持OpenGL 3.3。最近，搭载MacOS 10.7 Lion和兼容型GPU的Mac机可以跑OpenGL 3.2了，但3.3还不行；所以我们用2.1移植版的课程代码。除此外，其他步骤和Windows类似（也支持Makefiles，此处不赘述）：

 1. 从Mac App Store安装XCode
 2. 下载 CMake，安装.dmg。无需安装命令行工具。
 3. 下载课程源码（2.1版！！）解压到如~/Projects/OpenGLTutorials/
 4. 启动CMake （Applications->CMake）。将第一栏路径指向刚才解压缩的文件夹，不确定就选包含CMakeLists.txt的文件夹。第二栏填CMake输出路径。例如~/Projects/OpenGLTutorials_bin_XCode/。注意，这里可以随便填，不一定要和源码在同一文件夹。
 5. 点击Configure。由于是首次configure工程，CMake会让您选择编译器。选择Xcode。
 6. 再点Configure直至红色行全部消失。点Generate。Xcode项目创建完毕。不再需要CMake了，可以卸载掉。
 7. 打开~/Projects/OpenGLTutorials_bin_XCode/会看到Tutorials.xcodeproj文件：打开它。
 8. 选择一个教程，在Xcode的Scheme面板上运行，点击Run按钮编译和运行：

###关于Code::Blocks的说明
由于C::B和CMake中各有一个bug，您得在Project->Build->Options->Make commands中手动设置编译命令，如下图所示：

同时您还得手动设置工作目录：Project->Properties->Build targets->tutorial N->execution working dir（即src_dir/tutorial_N/）。

运行课程例子
--------

一定要在正确的目录下运行课程例子：您可以双击可执行文件；如果爱用命令行，请用cd命令切换到正确的目录。

若想从IDE中运行程序，别忘了看看上面的说明——先正确设置工作目录。

如何学习本课程
--------
每课都附有源码和数据，可在tutorialXX/找到。不过，建议您不改动这些工程，将它们作为参考；推荐在playground/playground.cpp中做试验，怎么折腾都行。要是弄乱了，就去粘一段课程代码，一切就会恢复正常。

我们会在整个教程中提供代码片段。不妨一边看教程，一边把代码复制到playground里调试。动手实验才是王道。单纯看别人写好的代码学不了多少。即便只是粘贴一下代码，也会碰到不少问题。

打开一个窗口
--------
终于！写OpenGL代码的时刻来了！
呃，其实还早着呢。有些教程会教您以“底层”的方式做事，好让您清楚每一步的原理。这些内容往往无趣无用。因此，我们用一个第三方库——GLFW来帮我们处理窗口、键盘消息等细节。您也可以使用Windows的Win32 API、Linux的X11 API，或Mac的Cocoa API；或者用别的库，比如SFML、FreeGLUT、SDL等，请参见链接页。

开工啦。从处理依赖库开始：我们要用一些基本库在控制台显示消息：

    // Include standard headers
    #include <stdio.h>
    #include <stdlib.h>

然后是GLEW库。其原理我们以后再说。

    // Include GLEW. Always include it before gl.h and glfw.h, since it's a bit magic.
    #include <GL/glew.h>

我们使用GLFW库处理窗口和键盘消息，把它也包含进来：

    // Include GLFW
    #include <GL/glfw.h>

下面的GLM是个很有用三维数学库，我们暂时没用到，但很快就会用上。GLM库很好用，但没有什么神奇的，您自己也可以写一个。添加“using namespace”是为了不用写“glm::vec3”，直接写“vec3”。

    // Include GLM
    #include <glm/glm.hpp>
    using namespace glm;

如果把这些#include都粘贴到playground.cpp，编译器会报错，说缺少main函数。我们创建一个 ：

    int main(){

首先初始化GLFW ：

    // Initialise GLFW
    if( !glfwInit() )
    {
        fprintf( stderr, "Failed to initialize GLFW\n" );
        return -1;
    }

终于可以创建我们的第一个OpenGL窗口啦！

    glfwOpenWindowHint(GLFW_FSAA_SAMPLES, 4); // 4x antialiasing
    glfwOpenWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3); // We want OpenGL 3.3
    glfwOpenWindowHint(GLFW_OPENGL_VERSION_MINOR, 3);
    glfwOpenWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE); //We don't want the old OpenGL
     
    // Open a window and create its OpenGL context
    if( !glfwOpenWindow( 1024, 768, 0,0,0,0, 32,0, GLFW_WINDOW ) )
    {
        fprintf( stderr, "Failed to open GLFW window\n" );
        glfwTerminate();
        return -1;
    }
     
    // Initialize GLEW
    glewExperimental=true; // Needed in core profile
    if (glewInit() != GLEW_OK) {
        fprintf(stderr, "Failed to initialize GLEW\n");
        return -1;
    }
 
glfwSetWindowTitle( "Tutorial 01" );

build并运行。一个窗口弹出后立即关闭了。可不是嘛，还没设置等待用户Esc按键再关闭呢：

    // Ensure we can capture the escape key being pressed below
    glfwEnable( GLFW_STICKY_KEYS );
     
    do{
        // Draw nothing, see you in tutorial 2 !
     
        // Swap buffers
        glfwSwapBuffers();
     
    } // Check if the ESC key was pressed or the window was closed
    while( glfwGetKey( GLFW_KEY_ESC ) != GLFW_PRESS &&
    glfwGetWindowParam( GLFW_OPENED ) );

第一课就到这啦！第二课会教大家绘制三角形。


> Written with [StackEdit](https://stackedit.io/).