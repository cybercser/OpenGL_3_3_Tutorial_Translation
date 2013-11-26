简介Introduction
这堂课是视频课程，没有介绍新的OpenGL相关技术/语法。不过，大家会学习如何利用现有知识，生成高质量的阴影。This a video-only tutorial. It doesn't introduce any new OpenGL-specific technique/syntax, but shows you how to use the techniques you already know to build high-quality shadows.

本课介绍了用Blender创建简单场景的方法；还介绍了如何烘培（bake）光照图（lightmap），以便在你的项目中使用。This tutorials explains how to build a simple world in Blender, and bake the lightmaps so that you can use them in your application.

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/05/lighmappedroom.png"><img class="alignnone size-large wp-image-345" title="lighmappedroom" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/05/lighmappedroom-1024x793.png" alt="" width="640" height="495" /></a>
无需Blender预备知识，我会讲解包括快捷键的所有内容。No prior knowledge of Blender is required. I will explain all keyboard shortcuts and everything.
关于光照图A note on lightmaps
光照图是永久、一次性地烘焙好的。也就是说光照图是完全静态的，你不能在运行时移动光源，连删除都不行。Lightmaps are baked. Once and for all. This means that they are completely static, you can't decide to move the light at runtime. Or even remove it.

但对于阳光这种光源来说，光照图还是大有用武之地的；在不会打碎灯泡的室内场景中，也是可以的。2009年发布的《镜之边缘》就在室内、室外场景中大量采用了光照图。This can still be useful for the sunlight, though, or indoor scenes where you may not break the light bulbs. Mirror Edge, released in 2009, uses them extensively, both indoors and outdoors.

更重要的是，光照图很容易配置，速度无可匹敌。What's more, it's very easy to setup, and you can't beat the speed.
视频
这是个1024x768的视频，采用HD模式……This is a 1024x768p video, use HD mode...

<iframe src="http://player.vimeo.com/video/24359223?title=0&byline=0&portrait=0" frameborder="0" width="800" height="450"></iframe>
附录Addendum
用OpenGL渲染它时，你大概会注意到一些瑕疵（这里把瑕疵放大了）：When rendering it in OpenGL, you might notice some glitches (exaggerated here) :

<a href="http://www.opengl-tutorial.org/wp-content/uploads/2011/05/positivebias.png"><img class="alignnone size-large wp-image-346" title="positivebias" src="http://www.opengl-tutorial.org/wp-content/uploads/2011/05/positivebias-1024x793.png" alt="" width="640" height="495" /></a>

这是由mipmap造成的。从远处观察时，mipmap对纹素做了混合。纹理背景中的黑色像素点和光照图中的像素点混合在了一起。为了避免这一点，你可以采取如下措施：This is because of mipmapping, which blends texels together when seen at a distance. Black pixels from the texture's background get mixed with good parts of the lightmap. To avoid this, there are a few things you can do :

	让Blender在UV图的limits上生成一个margin。【难以翻译，等待实际操作Blender后再确定】这个margin参数位于bake面板。要想效果更好，可以把margin值设为20个纹素。You can ask Blender to generate a margin around the limits of the UV map. This is the "margin" parameter in the "bake" panel. For good results, you may have to go up to a margin of 20 texels.
	获取纹理时，加上一个偏离（bias）：You can use a bias in your texture fetch :

<pre class="brush:fs">color = texture2D( myTextureSampler, UV, -2.0 ).rgb;</pre>
-2就是偏离量。这个值是通过不断尝试得出的。上面的截图中bias值为+2，也就是说OpenGL将在原本的mipmap层次上再加两层（因此，纹素大小变为原来的1/16，瑕疵也随之变小了）。-2 is the bias. You'll have to experiment with this value. The screenshot above was taken with a bias of +2, which means that OpenGL will select two mipmaps above the one it should have taken (so it's 16 times smaller, hence the glitches)

	后期处理中可将背景填充为黑色，这一点我后面还会再讲。You can fill the black background in a post-processing step. I'll post more about this later.
