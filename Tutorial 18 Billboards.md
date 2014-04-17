公告板
======
[TOC]

公告板是3D世界中的2D元素。它既不是最顶层的2D菜单，也不是可以随意转动的3D平面，而是介于两者之间的一种元素，比如游戏中的血条。

公告板的独特之处在于：它位于某个特定位置，朝向是自动计算的，这样它就能始终面向相机（观察者）。

方案1:2D法
------
2D法十分简单。只需计算出点在屏幕空间的坐标，然后在该处显示2D文本（参见第十一课）即可。

```cpp
// Everything here is explained in Tutorial 3 ! There's nothing new.
glm::vec4 BillboardPos_worldspace(x,y,z, 1.0f);
glm::vec4 BillboardPos_screenspace = ProjectionMatrix * ViewMatrix * BillboardPos_worldspace;
BillboardPos_screenspace /= BillboardPos_screenspace.w;

if (BillboardPos_screenspace.z < 0.0f){
    // Object is behind the camera, don't display it.
}
```

就这么搞定了！

2D法优点是简单易行，无论点与相机距离远近，公告板始终保持大小不变。但此法总是把文本显示在最顶层，有可能会遮挡其他物体，影响渲染效果。

方案2:3D法
------
与2D法相比，3D法常常效果更好，也没复杂多少。
我们的目的就是无论相机如何移动，都要让公告板网格正对着相机：

<img class="alignnone size-full wp-image-944" title="2a" src="http://www.opengl-tutorial.org/wp-content/uploads/2013/09/2a.gif" alt="" width="400" height="300">

可将此视为模型矩阵的构造问题之简化版。基本思路是将公告板的各角落置于 （存疑待查）The idea is that each corner of the billboard is at the center position, displaced by the camera’s up and right vectors :

<img class="alignnone size-full wp-image-946 whiteborder" title="principle" src="http://www.opengl-tutorial.org/wp-content/uploads/2013/09/principle.png" alt="" width="555" height="572">

当然，我们仅仅知道世界空间中的公告板中心位置，因此还需要相机在世界空间中的up/right向量。

在相机空间，相机的up向量为(0,1,0)。要把up向量变换到世界空间，只需乘以观察矩阵的逆矩阵（由相机空间变换至世界空间的矩阵）。

用数学公式表示即：

CameraRight_worldspace = {ViewMatrix[0][0], ViewMatrix[1][0], ViewMatrix[2][0]}
CameraUp_worldspace = {ViewMatrix[0][1], ViewMatrix[1][1], ViewMatrix[2][1]}

接下来，顶点坐标的计算就很简单了：

```glsl
vec3 vertexPosition_worldspace =
    particleCenter_wordspace
    + CameraRight_worldspace * squareVertices.x * BillboardSize.x
    + CameraUp_worldspace * squareVertices.y * BillboardSize.y;
```

* `particleCenter_worldspace`顾名思义即公告板的中心位置，以vec3类型的uniform变量表示。
* `squareVertices`是原始的网格。左顶点的`squareVertices.x`为-0.5（存疑待查），which are thus moved towars the left of the camera (because of the *CameraRight_worldspace)
* `BillboardSize`是公告板大小，以世界单位为单位，uniform变量。

效果如下。怎么样，是不是很简单？

<img class="alignnone size-full wp-image-942" title="2" src="http://www.opengl-tutorial.org/wp-content/uploads/2013/09/2.gif" alt="" width="400" height="300">

为了保证内容完整性，这里给出`squareVertices`的数据：

```cpp
// The VBO containing the 4 vertices of the particles.
 static const GLfloat g_vertex_buffer_data[] = {
 -0.5f, -0.5f, 0.0f,
 0.5f, -0.5f, 0.0f,
 -0.5f, 0.5f, 0.0f,
 0.5f, 0.5f, 0.0f,
 };
```

方案3：固定大小3D法
------
正如上面所看到的，公告板大小随着相机与之的距离变化。有些情况下的确需要这样的效果，但血条这类公告板则需要保持大小不变。


```cpp
vertexPosition_worldspace = particleCenter_wordspace;
// Get the screen-space position of the particle's center
gl_Position = VP * vec4(vertexPosition_worldspace, 1.0f);
// Here we have to do the perspective division ourselves.
gl_Position /= gl_Position.w;

// Move the vertex in directly screen space. No need for CameraUp/Right_worlspace here.
gl_Position.xy += squareVertices.xy * vec2(0.2, 0.05);
```

<img class="alignnone size-full wp-image-943" title="3" src="http://www.opengl-tutorial.org/wp-content/uploads/2013/09/3.gif" alt="" width="400" height="300">

方案4：限制垂直旋转法
------
一些引擎以公告板表示远处的树和灯。不过，这些树可不能任意转向，**必须**是竖直的。So you need an hybrid system that rotates only around one axis.（存疑待查）

这个方案作为练习留给读者。
> &copy; http://www.opengl-tutorial.org/

> Written with [StackEdit](https://stackedit.io/).