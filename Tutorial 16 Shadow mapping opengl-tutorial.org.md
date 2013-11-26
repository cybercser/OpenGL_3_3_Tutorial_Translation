第十五课中已经学习了如何创建光照图。光照图可用于静态对象的光照，其阴影效果也很不错，但无法处理运动的对象。In Tutorial 15 we learnt how to create lightmaps, which encompasses static lighting. While it produces very nice shadows, it doesn't deal with animated models.


阴影图是目前（截止2012年）最好的生成动态阴影的方法。此法最大的优点是易于实现，缺点是想完全正确地实现不大容易。Shadow maps are the current (as of 2012) way to make dynamic shadows. The great thing about them is that it's fairly easy to get to work. The bad thing is that it's terribly difficult to get to work <em>right</em>.

本课首先介绍基本算法，探究其缺陷，然后实现一些优化。由于撰写本文时（2012），阴影图技术还在被广泛地研究；我们将提供一些指导，以便你根据自身需要，进一步改善你的阴影图。In this tutorial, we'll first introduce the basic algorithm, see its shortcomings, and then implement some techniques to get better results. Since at time of writing (2012) shadow maps are still a heavily researched topic, we'll give you some directions to further improve your own shadowmap, depending on your needs.
基本的阴影图Basic shadowmap
基本的阴影图算法包含两个步骤。首先，从光源的视角将场景渲染一次，只计算每个片断的深度。接着从正常的视角把场景再渲染一次，渲染时要测试当前片断是否位于阴影中。The basic shadowmap algorithm consists in two passes. First, the scene is rendered from the point of view of the light. Only the depth of each fragment is computed. Next, the scene is rendered as usual, but with an extra test to see it the current fragment is in the shadow.

“是否在阴影中”的测试实际上非常简单。如果当前采样点比阴影图中的同一点离光源更远，那说明场景中有一个物体比当前采样点离光源更近；即当前片断位于阴影中。The "being in the shadow" test is actually quite simple. If the current sample is further from the light than the shadowmap at the same point, this means that the scene contains an object that is closer to the light. In other words, the current fragment is in the shadow.

下图可以帮你理解上述原理：The following image might help you understand the principle :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/shadowmapping.png"><img class="alignnone size-full wp-image-532 whiteborder" title="shadowmapping" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/shadowmapping.png" alt="" width="636" height="272" /></a>
渲染阴影图Rendering the shadow map
本课只考虑平行光——一种位于无限远处，其光线可视为相互平行的光源。故可用正交投影矩阵来渲染阴影图。正交投影矩阵和一般的透视投影矩阵差不多，只不过未考虑透视——因此无论距离相机多远，物体的大小看起来都是一样的。In this tutorial, we'll only consider directional lights - lights that are so far away that all the light rays can be considered parallel. As such, rendering the shadow map is done with an orthographic projection matrix. An orthographic matrix is just like a usual perspective projection matrix, except that no perspective is taken into account - an object will look the same whether it's far or near the camera.
设置渲染目标和MVP矩阵Setting up the rendertarget and the MVP matrix
十四课中，大家学习了把场景渲染到纹理，以便稍后从着色器中访问的方法。 Since Tutorial 14, you know how to render the scene into a texture in order to access it later from a shader.

这里采用了一幅1024x1024、16位深度的纹理来存储阴影图。对于阴影图来说，通常16位绰绰有余;你可以自由地试试别的数值。注意，这里采用的是深度纹理，而非深度渲染缓冲区（这个要留到后面进行采样）。Here we use a 1024x1024 16-bit depth texture to contain the shadow map. 16 bits are usually enough for a shadow map. Feel free to experiment with these values. Note that we use a depth texture, not a depth renderbuffer, since we'll need to sample it later.
// The framebuffer, which regroups 0, 1, or more textures, and 0 or 1 depth buffer.
 GLuint FramebufferName = 0;
 glGenFramebuffers(1, &FramebufferName);
 glBindFramebuffer(GL_FRAMEBUFFER, FramebufferName);

 // Depth texture. Slower than a depth buffer, but you can sample it later in your shader
 GLuint depthTexture;
 glGenTextures(1, &depthTexture);
 glBindTexture(GL_TEXTURE_2D, depthTexture);
 glTexImage2D(GL_TEXTURE_2D, 0,GL_DEPTH_COMPONENT16, 1024, 1024, 0,GL_DEPTH_COMPONENT, GL_FLOAT, 0);
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
 glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

 glFramebufferTexture(GL_FRAMEBUFFER, GL_DEPTH_ATTACHMENT, depthTexture, 0);

 glDrawBuffer(GL_NONE); // No color buffer is drawn to.

 // Always check that our framebuffer is ok
 if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE)
 return false;
MVP矩阵用于从光源的视角绘制场景，其计算过程如下：The MVP matrix used to render the scene from the light's point of view is computed as follows :

	投影矩阵是正交矩阵，可将整个场景包含到一个轴向包围盒（axis-aligned box）里，该包围盒在X、Y、Z轴上的坐标范围分别为(-10,10)、(-10,10)、(-10,20)。这样做是为了让整个场景始终可见，这一点在“再进一步”小节还会讲到。The Projection matrix is an orthographic matrix which will encompass everything in the axis-aligned box (-10,10),(-10,10),(-10,20) on the X,Y and Z axes respectively. These values are made so that our entire <em>visible </em>scene is always visible ; more on this in the Going Further section.
	视图矩阵对场景做了旋转，这样在观察坐标系中，光源的方向就是-Z方向（需要温习第三课吗？）。The View matrix rotates the world so that in camera space, the light direction is -Z (would you like to re-read <a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/" target="_blank">Tutorial 3</a> ?)
	模型矩阵可设为任意值。The Model matrix is whatever you want.

glm::vec3 lightInvDir = glm::vec3(0.5f,2,2);

 // Compute the MVP matrix from the light's point of view
 glm::mat4 depthProjectionMatrix = glm::ortho<float>(-10,10,-10,10,-10,20);
 glm::mat4 depthViewMatrix = glm::lookAt(lightInvDir, glm::vec3(0,0,0), glm::vec3(0,1,0));
 glm::mat4 depthModelMatrix = glm::mat4(1.0);
 glm::mat4 depthMVP = depthProjectionMatrix * depthViewMatrix * depthModelMatrix;

 // Send our transformation to the currently bound shader,
 // in the "MVP" uniform
 glUniformMatrix4fv(depthMatrixID, 1, GL_FALSE, &depthMVP[0][0])
着色器The shaders
这一次渲染中所用的着色器很简单。顶点着色器仅仅简单地计算一下顶点的齐次坐标：The shaders used during this pass are very simple. The vertex shader is a pass-through shader which simply compute the vertex' position in homogeneous coordinates :
#version 330 core

// Input vertex data, different for all executions of this shader.
layout(location = 0) in vec3 vertexPosition_modelspace;

// Values that stay constant for the whole mesh.
uniform mat4 depthMVP;

void main(){
 gl_Position =  depthMVP * vec4(vertexPosition_modelspace,1);
}
片断着色器同样简单：只需将片断的深度值写到location 0（即写入深度纹理）。The fragment shader is just as simple : it simply writes the depth of the fragment at location 0 (i.e. in our depth texture).
#version 330 core

// Ouput data
layout(location = 0) out float fragmentdepth;

void main(){
    // Not really needed, OpenGL does it anyway
    fragmentdepth = gl_FragCoord.z;
}
渲染阴影图比渲染一般的场景要快一倍多，因为只需写入低精度的深度值，不需要同时写深度值和颜色值。显存带宽往往是影响GPU性能的关键因素。Rendering a shadow map is usually more than twice as fast as the normal render, because only low precision depth is written, instead of both the depth and the color; Memory bandwidth is often the biggest performance issue on GPUs.
结果Result
渲染出的纹理如下所示：The resulting texture looks like this :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/DepthTexture.png"><img class="alignnone size-full wp-image-383" title="DepthTexture" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/DepthTexture.png" alt="" width="512" height="511" /></a>

颜色越深表示z值越小；故墙面的右上角离相机更近。相反地，白色表示z=1（齐次坐标系中的值），离相机十分遥远。A dark colour means a small z ; hence, the upper-right corner of the wall is near the camera. At the opposite, white means z=1 (in homogeneous coordinates), so this is very far.
使用阴影图Using the shadow map
基本着色器Basic shader
现在回到普通的着色器。对于每一个计算出的片断，都要测试其是否位于阴影图之“后”。Now we go back to our usual shader. For each fragment that we compute, we must test whether it is "behind" the shadow map or not.

为了做这个测试，需要计算：在创建阴影图所用的坐标系中，当前片断的坐标。因此要依次用通常的MVP矩阵和depthMVP矩阵对其做变换。To do this, we need to compute the current fragment's position <em>in the same space that the one we used when creating the shadowmap</em>. So we need to transform it once with the usual MVP matrix, and another time with the depthMVP matrix.

不过还需要一些技巧。将depthMVP与顶点坐标相乘得到的是齐次坐标，坐标范围为[-1,1]，而纹理采样的取值范围却是[0,1]。There is a little trick, though. Multiplying the vertex' position by depthMVP will give homogeneous coordinates, which are in [-1,1] ; but texture sampling must be done in [0,1].

举个例子，位于屏幕中央的片断的齐次坐标应该是(0,0)；但要对纹理中心进行采样，UV坐标就应该是(0.5,0.5)。For instance, a fragment in the middle of the screen will be in (0,0) in homogeneous coordinates ; but since it will have to sample the middle of the texture, the UVs will have to be (0.5, 0.5).

这个问题可以通过在片断着色器中调整采样坐标来修正，但用下面这个矩阵去乘齐次坐标则更为高效。这个矩阵将坐标除以2（主对角线上[-1,1] -> [-0.5, 0.5]），然后平移（最后一行[-0.5, 0.5] -> [0,1]）。This can be fixed by tweaking the fetch coordinates directly in the fragment shader but it's more efficient to multiply the homogeneous coordinates by the following matrix, which simply divides coordinates by 2 ( the diagonal : [-1,1] -> [-0.5, 0.5] ) and translates them ( the lower row : [-0.5, 0.5] -> [0,1] ).
glm::mat4 biasMatrix(
0.5, 0.0, 0.0, 0.0,
0.0, 0.5, 0.0, 0.0,
0.0, 0.0, 0.5, 0.0,
0.5, 0.5, 0.5, 1.0
);
glm::mat4 depthBiasMVP = biasMatrix*depthMVP;
终于可以写顶点着色器了。和之前的差不多，不过这次要输出两个坐标。We can now write our vertex shader. It's the same as before, but we output 2 positions instead of 1 :

	gl_Position是当前相机所在坐标系下的顶点坐标gl_Position is the position of the vertex as seen from the current camera
	ShadowCoord是上一个相机（光源）所在坐标系下的顶点坐标ShadowCoord is the position of the vertex as seen from the last camera (the light)

// Output position of the vertex, in clip space : MVP * position
gl_Position =  MVP * vec4(vertexPosition_modelspace,1);

// Same, but with the light's view matrix
ShadowCoord = DepthBiasMVP * vec4(vertexPosition_modelspace,1);
片断着色器就很简单了：The fragment shader is then very simple :

	texture2D( shadowMap, ShadowCoord.xy ).z 是光源到距离最近的遮挡物之间的距离。texture2D( shadowMap, ShadowCoord.xy ).z is the distance between the light and the nearest occluder
	ShadowCoord.z是光源和当前片断之间的距离ShadowCoord.z is the distance between the light and the current fragment

……因此，若当前片断比最近的遮挡物还远，那意味着这个片断位于（这个最近的遮挡物的）阴影中... so if the current fragment is further than the nearest occluder, this means we are in the shadow (of said nearest occluder) :
float visibility = 1.0;
if ( texture2D( shadowMap, ShadowCoord.xy ).z  <  ShadowCoord.z){
visibility = 0.5;
}
我们只需把这个原理加到光照计算中。当然，环境光分量无需改动，毕竟这只分量是个为了模拟一些光亮，让即使处在阴影或黑暗中的物体也能显出轮廓来（否则就会是纯黑色）。We just have to use this knowledge to modify our shading. Of course, the ambiant colour isn't modified, since its purpose in life is to fake some incoming light even when we're in the shadow (or everything would be pure black)
<pre class="brush:fs; highlight: [4, 6]">color =
 // Ambiant : simulates indirect lighting
 MaterialAmbiantColor +
 // Diffuse : "color" of the object
 visibility * MaterialDiffuseColor * LightColor * LightPower * cosTheta+
 // Specular : reflective highlight, like a mirror
 visibility * MaterialSpecularColor * LightColor * LightPower * pow(cosAlpha,5);
结果——阴影瑕疵（Shadow acne）Result - Shadow acne
这是目前的代码渲染的结果。很明显，大体的思想是实现了，不过质量不尽如人意。Here's the result of the current code. Obviously, the global idea it there, but the quality is unacceptable.

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/1rstTry.png"><img class="alignnone size-large wp-image-382" title="1rstTry" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/1rstTry-1024x793.png" alt="" width="640" height="495" /></a>

逐一检查图中的问题。代码有两个工程：shadowmaps和shadowmaps_simple，任选一项。simple版的效果和上图一样糟糕，但代码比较容易理解。Let's look at each problem in this image. The code has 2 projects : shadowmaps and shadowmaps_simple; start with whichever you like best. The simple version is just as ugly as the image above, but is simpler to understand.
问题Problems
阴影瑕疵Shadow acne
最明显的问题就是阴影瑕疵。The most obvious problem is called <em>shadow acne</em> :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/ShadowAcne.png"><img class="alignnone size-full wp-image-396" title="ShadowAcne" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/ShadowAcne.png" alt="" width="335" height="179" /></a>

这种现象可用下面这张简单的图解释：This phenomenon is easily explained with a simple image :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/shadow-acne.png"><img class="alignnone size-full wp-image-531 whiteborder" title="shadow-acne" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/shadow-acne.png" alt="" width="266" height="183" /></a>

通常的“补救措施”是加上一个误差容限（error margin）：仅当当前片断的深度（再次提醒，这里指的是从光源的坐标系得到的深度值）确实比光照图像素的深度要大时，才将其判定为阴影。这可以通过添加一个偏差（bias）来办到：The usual "fix" for this is to add an error margin : we only shade if the current fragment's depth (again, in light space) is really far away from the lightmap value. We do this by adding a bias :
float bias = 0.005;
float visibility = 1.0;
if ( texture2D( shadowMap, ShadowCoord.xy ).z  <  ShadowCoord.z-bias){
visibility = 0.5;
}
效果好多了：The result is already much nicer :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/FixedBias.png"><img class="alignnone size-large wp-image-384" title="FixedBias" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/FixedBias-1024x793.png" alt="" width="640" height="495" /></a>

不过，你也许注意到了，由于加入了偏差，墙面与地面之间的瑕疵显得更加明显了。更糟糕的是，0.005的偏差对地面来说太大了，但对曲面来说又太小了：圆柱体和球体上的瑕疵依然可见。However, you can notice that because of our bias, the artefact between the ground and the wall has gone worse. What's more, a bias of 0.005 seems too much on the ground, but not enough on curved surface : some artefacts remain on the cylinder and on the sphere.

一个通常的解决方案是根据斜率调整偏差：A common approach is to modify the bias according to the slope :
float bias = 0.005*tan(acos(cosTheta)); // cosTheta is dot( n,l ), clamped between 0 and 1
bias = clamp(bias, 0,0.01);
阴影瑕疵消失了，即使在曲面上也看不到了。Shadow acne is now gone, even on curved surfaces.

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/VariableBias.png"><img class="alignnone size-large wp-image-389" title="VariableBias" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/VariableBias-1024x793.png" alt="" width="640" height="495" /></a>

还有一个技巧，不过这个技巧灵不灵得看具体的几何形状。此技巧只渲染阴影中的背面。这就对厚墙的几何形状提出了硬性要求（请看下一节——阴影悬空（Peter Panning），不过即使有瑕疵，也只会出现在阴影遮蔽下的表面上。【译者注：在迪斯尼经典动画片《小飞侠》中，小飞侠彼得·潘中的影子和身体分开了，小仙女Wendy又给他缝好了。豆瓣链接http://movie.douban.com/subject/1296538/】Another trick, which may or may not work depending on your geometry, is to render only the back faces in the shadow map. This forces us to have a special geometry ( see next section - Peter Panning ) with thick walls, but at least, the acne will be on surfaces which are in the shadow :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/shadowmapping-backfaces.png"><img class="alignnone size-full wp-image-533 whiteborder" title="shadowmapping-backfaces" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/shadowmapping-backfaces.png" alt="" width="592" height="327" /></a>

渲染阴影图时剔除正面的三角形：When rendering the shadow map, cull front-facing triangles :
        // We don't use bias in the shader, but instead we draw back faces,
        // which are already separated from the front faces by a small distance
        // (if your geometry is made this way)
        glCullFace(GL_FRONT); // Cull front-facing triangles -> draw only back-facing triangles
渲染场景时就正常地渲染（剔除背面）And when rendering the scene, render normally (backface culling)
         glCullFace(GL_BACK); // Cull back-facing triangles -> draw only front-facing triangles
代码中也用了这个方法，和『加入偏差』联合使用。This method is used in the code, in addition to the bias.
阴影悬空（Peter Panning）Peter Panning
现在没有阴影瑕疵了，但地面的光照效果还是不对，看上去墙面好像悬在半空（因此术语称为“阴影悬空”）。实际上，加上偏差会加剧阴影悬空。We have no shadow acne anymore, but we still have this wrong shading of the ground, making the wall to look as if it's flying (hence the term "Peter Panning"). In fact, adding the bias made it worse.

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/PeterPanning.png"><img class="alignnone size-full wp-image-395" title="PeterPanning" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/PeterPanning.png" alt="" width="150" height="254" /></a>

这个问题很好修正：避免使用薄的几何形体就行了。这样做有两个好处：This one is very easy to fix : simply avoid thin geometry. This has two advantages :

	首先，（把物体增厚）解决了阴影悬空问题：物体比偏差值要大得多，于是一切麻烦烟消云散了。First, it solves Peter Panning : it the geometry is more deep than your bias, you're all set.
	其次，可在渲染光照图时启用背面剔除，因为现在，墙壁上有一个面面对光源，就可以遮挡住墙壁的另一面，而这另一面恰好作为背面被剔除了，无需渲染。Second, you can turn on backface culling when rendering the lightmap, because now, there is a polygon of the wall which is facing the light, which will occlude the other side, which wouldn't be rendered with backface culling.

缺点就是要渲染的三角形增多了（每帧多了一倍的三角形！）The drawback is that you have more triangles to render ( two times per frame ! )

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/NoPeterPanning.png"><img class="alignnone size-large wp-image-385" title="NoPeterPanning" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/NoPeterPanning-1024x793.png" alt="" width="640" height="495" /></a>
走样Aliasing
即使是使用了这些技巧，你还是会发现阴影的边缘上有一些走样。换句话说，就是一个像素点是白的，邻近的一个像素点是黑的，中间缺少平滑过渡。Even with these two tricks, you'll notice that there is still aliasing on the border of the shadow. In other words, one pixel is white, and the next is black, without a smooth transition inbetween.

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/Aliasing.png"><img class="alignnone size-full wp-image-394" title="Aliasing" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/Aliasing.png" alt="" width="69" height="145" /></a>
百分比渐近滤波（PCF, percentage closer filtering）PCF
一个最简单的改善方法是把阴影图的sampler类型改为sampler2DShadow。这么做的结果是，每当对阴影图进行一次采样时，硬件就会对相邻的纹素进行采样，并对它们全部进行比较，对比较的结果做双线性滤波后返回一个[0,1]之间的float值。The easiest way to improve this is to change the shadowmap's sampler type to <em>sampler2DShadow</em>. The consequence is that when you sample the shadowmap once, the hardware will in fact also sample the neighboring texels, do the comparison for all of them, and return a float in [0,1] with a bilinear filtering of the comparison results.

例如，0.5即表示有两个采样点在阴影中，两个采样点在光明中。For instance, 0.5 means that 2 samples are in the shadow, and 2 samples are in the light.

注意，它和对滤波后深度图做单次采样有区别！一次“比较”，返回的是true或false；PCF返回的是4个“true或false”值的插值结果。Note that it's not the same than a single sampling of a filtered depth map ! A comparison always returns true or false; PCF gives a interpolation of 4 "true or false".

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/PCF_1tap.png"><img class="alignnone size-full wp-image-517" title="PCF_1tap" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/PCF_1tap.png" alt="" width="555" height="395" /></a>

可以看到，阴影边界平滑了，但阴影图的纹素依然可见。As you can see, shadow borders are smooth, but shadowmap's texels are still visible.
泊松采样（Poisson Sampling）Poisson Sampling
一个简易的解决办法是对阴影图做N次采样（而不是只做一次）。并且要和PCF一起使用，这样即使采样次数不多，也可以得到较好的效果。下面是四次采样的代码：An easy way to deal with this is to sample the shadowmap N times instead of once. Used in combination with PCF, this can give very good results, even with a small N. Here's the code for 4 samples :
for (int i=0;i<4;i++){
  if ( texture2D( shadowMap, ShadowCoord.xy + poissonDisk[i]/700.0 ).z  <  ShadowCoord.z-bias ){
    visibility-=0.2;
  }
}
poissonDisk是一个常量数组，其定义看起来像这样：poissonDisk is a constant array defines for instance as follows :
vec2 poissonDisk[4] = vec2[](
  vec2( -0.94201624, -0.39906216 ),
  vec2( 0.94558609, -0.76890725 ),
  vec2( -0.094184101, -0.92938870 ),
  vec2( 0.34495938, 0.29387760 )
);
这样，根据阴影图采样点个数的多少，生成的片断会随之变明或变暗。This way, depending on how many shadowmap samples will pass, the generated fragment will be more or less dark :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/SoftShadows.png"><img class="alignnone size-large wp-image-386" title="SoftShadows" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/SoftShadows-1024x793.png" alt="" width="640" height="495" /></a>

常量700.0确定了采样点的“分散”程度。散得太密，还是会发生走样；散得太开，会出现条带（截图中未使用PCF，以便让条带现象更明显；其中做了16次采样）。The 700.0 constant defines how much the samples are "spread". Spread them too little, and you'll get aliasing again; too much, and you'll get this :<em> banding </em>(this screenshot doesn't use PCF for a more dramatic effect, but uses 16 samples instead)<em>
</em>

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/SoftShadows_Close.png"><img class="alignnone size-large wp-image-387" title="SoftShadows_Close" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/SoftShadows_Close-1024x793.png" alt="" width="640" height="495" /></a>

 

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/SoftShadows_Wide.png"><img class="alignnone size-large wp-image-388" title="SoftShadows_Wide" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/SoftShadows_Wide-1024x793.png" alt="" width="640" height="495" /></a>
分层泊松采样（Stratified Poisson Sampling）Stratified Poisson Sampling
通过为每个像素分配不同采样点个数，我们可以消除这一问题。主要有两种方法：分层泊松法（Stratified Poisson）和旋转泊松法（Rotated Poisson）。分层泊松法选择不同的采样点数；旋转泊松法采样点数保持一致，但会做随机的旋转以使采样点的分布发生变化。本课仅对分层泊松法作介绍。We can remove this banding by choosing different samples for each pixel. There are two main methods : Stratified Poisson or Rotated Poisson. Stratified chooses different samples; Rotated always use the same, but with a random rotation so that they look different. In this tutorial I will only explain the stratified version.

与之前版本唯一不同的是，这里用了一个随机数来索引poissonDisk：The only difference with the previous version is that we index <em>poissonDisk</em> with a random index :
    for (int i=0;i<4;i++){
        int index = // A random number between 0 and 15, different for each pixel (and each i !)
        visibility -= 0.2*(1.0-texture( shadowMap, vec3(ShadowCoord.xy + poissonDisk[index]/700.0,  (ShadowCoord.z-bias)/ShadowCoord.w) ));
    }
可用如下代码（返回一个[0,1]间的随机数）产生随机数：We can generate a random number with a code like this, which returns a random number in [0,1] :
    float dot_product = dot(seed4, vec4(12.9898,78.233,45.164,94.673));
    return fract(sin(dot_product) * 43758.5453);
本例中，seed4是参数i和seed的组成的vec4向量（这样才会是在4个位置做采样）。参数seed的值可以选用gl_FragCoord（像素的屏幕坐标），或者Position_worldspace：In our case, seed4 will be the combination of i (so that we sample at 4 different locations) and ... something else. We can use gl_FragCoord ( the pixel's location on the screen ), or Position_worldspace :
        //  - A random sample, based on the pixel's screen location.
        //    No banding, but the shadow moves with the camera, which looks weird.
        int index = int(16.0*random(gl_FragCoord.xyy, i))%16;
        //  - A random sample, based on the pixel's position in world space.
        //    The position is rounded to the millimeter to avoid too much aliasing
        //int index = int(16.0*random(floor(Position_worldspace.xyz*1000.0), i))%16;
这样做之后，上图中的那种条带就消失了，不过噪点却显现出来了。不过，一些“漂亮的”噪点可比上面那些条带“好看”多了。This will make patterns such as in the picture above disappear, at the expense of visual noise. Still, a well-done noise is often less objectionable than these patterns.

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/PCF_stratified_4tap.png"><img class="alignnone size-full wp-image-518" title="PCF_stratified_4tap" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/08/PCF_stratified_4tap.png" alt="" width="565" height="287" /></a>

See tutorial16/ShadowMapping.fragmentshader for three example implementions.
延伸阅读Going further
即使把这些技巧都用上，仍有很多方法可以提升阴影质量。下面是最常见的一些方法：Even with all these tricks, there are many, many ways in which our shadows could be improved. Here are the most common :
过早优化（Early bailing）Early bailing
不要把采样次数设为16，太大了，四次采样足矣。若这四个点都在光明或都在阴影中，那就算做16次采样效果也一样：这就叫过早优化。若这些采样点明暗各异，那你很可能位于阴影边界上，这时候进行16次采样才是合情理的。Instead of taking 16 samples for each fragment (again, it's a lot), take 4 distant samples. It all of them are in the light or in the shadow, you can probably consider that all 16 samples would have given the same result : bail early. If some are different, you're probably on a shadow boundary, so the 16 samples are needed.
聚光灯（Spot lights）Spot lights
处理聚光灯这种光源时，不需要多大的改动。最主要的是：把正交投影矩阵换成透视投影矩阵：Dealing with spot lights requires very few changes. The most obvious one is to change the orthographic projection matrix into a perspective projection matrix :
<pre class="brush:cpp">glm::vec3 lightPos(5, 20, 20);
glm::mat4 depthProjectionMatrix = glm::perspective<float>(45.0f, 1.0f, 2.0f, 50.0f);
glm::mat4 depthViewMatrix = glm::lookAt(lightPos, lightPos-lightInvDir, glm::vec3(0,1,0));
大部分都一样，只不过用的不是正交视域四棱锥，而是透视视域四棱锥。考虑到透视除法，采用了texture2Dproj。（见“第四课——矩阵”的脚注）same thing, but with a perspective frustum instead of an orthographic frustum. Use texture2Dproj to account for perspective-divide (see footnotes in tutorial 4 - Matrices)

第二步，在着色器中，把透视考虑在内。（见“第四课——矩阵”的脚注。简而言之，透视投影矩阵根本就没做什么透视。这一步是由硬件完成的，只是把投影的坐标除以了w。这里在着色器中模拟这一步操作，因此得自己做透视除法。顺便说一句，正交矩阵产生的齐次向量w始终为1，这就是为什么正交矩阵没有任何透视效果。）The second step is to take into account the perspective in the shader. (see footnotes in tutorial 4 - Matrices. In a nutshell, a perspective projection matrix actually doesn't do any perspective at all. This is done by the hardware, by dividing the projected coordinates by w. Here, we emulate the transformation in the shader, so we have to do the perspective-divide ourselves. By the way, an orthographic matrix always generates homogeneous vectors with w=1, which is why they don't produce any perspective)

用GLSL完成此操作主要有两种方法。第二种方法利用了内置的textureProj函数，但两种方法得出的效果是一样的。Here are two way to do this in GLSL. The second uses the built-in textureProj function, but both methods produce exactly the same result.
if ( texture( shadowMap, (ShadowCoord.xy/ShadowCoord.w) ).z  <  (ShadowCoord.z-bias)/ShadowCoord.w )
if ( textureProj( shadowMap, ShadowCoord.xyw ).z  <  (ShadowCoord.z-bias)/ShadowCoord.w )
 
点光源（Point lights）Point lights
大部分是一样的，不过要做深度立方体贴图（cubemap）。立方体贴图包含一组6个纹理，每个纹理位于立方体的一面，无法用标准的UV坐标访问，只能用一个代表方向的三维向量来访问。Same thing, but with depth cubemaps. A cubemap is a set of 6 textures, one on each side of a cube; what's more, it is not accessed with standard UV coordinates, but with a 3D vector representing a direction.

空间各个方向的深度都保存着，保证点光源各方向都能投射影子。The depth is stored for all directions in space, which make possible for shadows to be cast all around the point light.
多个光源的组合Combination of several lights
该算法可以处理多个光源，但别忘了，每个光源都要做一次渲染，以生成其阴影图。这些计算极大地消耗了显存，也许很快你的显卡带宽就吃紧了。he algorithm handles several lights, but keep in mind that each light requires an additional rendering of the scene in order to produce the shadowmap. This will require an enormous amount of memory when applying the shadows, and you might become bandwidth-limited very quickly.
自动光源视域四棱锥（Automatic light frustum）Automatic light frustum
本课中，囊括整个场景的光源视域四棱锥是手动算出来的。虽然在本课的限定条件下，这么做还行得通，但应该避免这样的做法。如果你的地图大小是1Km x 1Km，你的阴影图大小为1024x1024，则每个纹素代表的面积为1平方米。这么做太蹩脚了。光源的投影矩阵应尽量紧包整个场景。In this tutorial, the light frustum hand-crafted to contain the whole scene. While this works in this restricted example, it should be avoided. If your map is 1Km x 1Km, each texel of your 1024x1024 shadowmap will take 1 square meter; this is lame. The projection matrix of the light should be as tight as possible.

对于聚光灯来说，只需调整一下范围就行了。For spot lights, this can be easily changed by tweaking its range.

对于太阳这样的方向光源，情况就复杂一些：光源确实照亮了整个场景。以下是计算方向光源视域四棱锥的一种方法：Directional lights, like the sun, are more tricky : they really <em>do</em> illuminate the whole scene. Here's a way to compute a the light frustum :

潜在阴影接收者（Potential Shadow Receiver，PSR）。PSR是这样一种物体——它们同时在【光源视域四棱锥，观察视域四棱锥，以及场景包围盒】这三者之内。顾名思义，PSR都有可能位于阴影中：相机和光源都能“看”到它。Potential Shadow Receivers, or PSRs for short, are objects which belong at the same time to the light frustum, to the view frustum, and to the scene bounding box. As their name suggest, these objects are susceptible to be shadowed : they are visible by the camera and by the light.

潜在阴影投射者（Potential Shadow Caster，PSC）= PSR + 所有位于PSR和光源之间的物体（一个物体可能不可见但仍然会投射出一条可见的阴影）。Potential Shadow Casters, or PCFs, are all the Potential Shadow Receivers, plus all objects which lie between them and the light (an object may not be visible but still cast a visible shadow).

因此，要计算光源的投影矩阵，可以用所有可见的物体，“减去”那些离得太远的物体，再计算其包围盒；然后“加上”位于包围盒与广元之间的物体，再次计算新的包围盒（不过这次是沿着光源的方向）。So, to compute the light projection matrix, take all visible objects, remove those which are too far away, and compute their bounding box; Add the objects which lie between this bounding box and the light, and compute the new bounding box (but this time, aligned along the light direction).

这些集合的精确计算涉及凸包体的求交计算，但这个方法(计算包围盒)实现起来简单多了。Precise computation of these sets involve computing convex hulls intersections, but this method is much easier to implement.

此法在物体离开视域四棱锥时，计算量会陡增，原因在于阴影图的分辨率陡然增加了。你可以通过多次平滑插值来弥补。层叠阴影图法（Cascaded Shadow Map）无此问题，但实现起来较难。This method will result in popping when objects disappear from the frustum, because the shadowmap resolution will suddenly increase. Cascaded Shadow Maps don't have this problem, but are harder to implement, and you can still compensate by smoothing the values over time.
指数阴影图（Exponential shadow map）Exponential shadow maps
指数阴影图法试图借助【位于阴影中的、但离光源较近的片断实际上处于‘某个中间位置’】这一假设来减少走样。这个方法涉及到偏差，不过测试已不再是二元的：片断离明亮曲面的距离越远，则其越显得黑暗。Exponential shadow maps try to limit aliasing by assuming that a fragment which is in the shadow, but near the light surface, is in fact "somewhere in the middle". This is related to the bias, except that the test isn't binary anymore : the fragment gets darker and darker when its distance to the lit surface increases.

显然，这纯粹是一种投机，两物体重叠时，瑕疵就会显露出来。This is cheating, obviously, and artefacts can appear when two objects overlap.
光源空间透视阴影图（Light-space perspective Shadow Map，LiSPSM）Light-space perspective Shadow Maps
LiSPSM调整了光源投影矩阵，从而在离相机很近时获取更高的精度。这一点在“duelling frustra”现象发生时显得尤为重要。所谓“duelling frustra”是指：点光源与你（相机）距离远，『视线』方向又恰好与你的视线方向相反。离光源近的地方(即离你远的地方)，阴影图精度高；离光源远的地方（即离你近的地方，你最需要精确阴影图的地方），阴影图的精度又不够了。LiSPSM tweaks the light projection matrix in order to get more precision near the camera. This is especially important in case of "duelling frustra" : you look in a direction, but a spot light "looks" in the opposite direction. You have a lot of shadowmap precision near the light, i.e. far from you, and a low resolution near the camera, where you need it the most.

不过LiSPSM实现起来很难。详细的实现方法请看参考文献。However LiSPM is tricky to implement. See the references for details on the implementation.
层叠阴影图（Cascaded shadow map）Cascaded shadow maps
CSM和LiSPSM解决的问题一模一样，但方式不同。CSM仅对观察视域四棱锥的各部分使用了2~4个标准阴影图。第一个阴影图处理近处的物体，所以在近处这块小区域内，你可以获得很高的精度。随后几个阴影图处理远一些的物体。最后一个阴影图处理场景中的很大一部分，但由于透视效应，视觉感官上没有近处区域那么明显。CSM deals with the exact same problem than LiSPSM, but in a different way. It simply uses several (2-4) standard shadow maps for different parts of the view frustum. The first one deals with the first meters, so you'll get great resolution for a quite little zone. The next shadowmap deals with more distant objects. The last shadowmap deals with a big part of the scene, but due tu the perspective, it won't be more visually important than the nearest zone.

撰写本文时，CSM是复杂度/质量比最好的方法。很多案例都选用了这一解决方案。Cascarded shadow maps have, at time of writing (2012), the best complexity/quality ratio. This is the solution of choice in many cases.
总结Conclusion
正如你所看到的，阴影图技术是个很复杂的课题。每年都有新的方法和改进方案发表。但目前为止尚无完美的解决方案。As you can see, shadowmaps are a complex subject. Every year, new variations and improvement are published, and to day, no solution is perfect.

幸运的是，大部分方法都可以混合使用：在LiSPSM中使用CSM，再加PCF平滑等等是完全可行的。尽情地实验吧。Fortunately, most of the presented methods can be mixed together : It's perfectly possible to have Cascaded Shadow Maps in Light-space Perspective, smoothed with PCF... Try experimenting with all these techniques.

最后总结一句，我建议你坚持尽可能使用预计算的光照图，只为动态物体使用阴影图。并且要确保两者的视觉效果协调一致，任何一者比另一者的效果好/糟太多都不合适。As a conclusion, I'd suggest you to stick to pre-computed lightmaps whenever possible, and to use shadowmaps only for dynamic objects. And make sure that the visual quality of both are equivalent : it's not good to have a perfect static environment and ugly dynamic shadows, either.
