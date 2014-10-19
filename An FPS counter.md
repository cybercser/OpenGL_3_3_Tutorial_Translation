FPS计数器
===
时刻关注性能在实时计算机图形学中是很重要的。比较好的做法是选择一个目标FPS（通常是60FPS或30FPS），然后竭尽所能朝这个目标努力。

FPS计数器工作原理大致如下:

```
 double lastTime = glfwGetTime();
 int nbFrames = 0;

 do{
 
     // Measure speed
     double currentTime = glfwGetTime();
     nbFrames++;
     if ( currentTime - lastTime >= 1.0 ){ // If last prinf() was more than 1 sec ago
         // printf and reset timer
         printf("%f ms/frame\n", 1000.0/double(nbFrames));
         nbFrames = 0;
         lastTime += 1.0;
     }

     ... rest of the main loop
```

代码中有一个奇怪的地方。这个FPS计数器显示的是渲染每一帧所需的时间（单位毫秒，取一秒内的平均值），而不是上一秒内渲染的帧数。

实际上这种计法要**好得多**。不要太依赖FPS。帧每秒 = 1/秒每帧，因此二者互为倒数。人们对倒数的感觉很不靠谱。来看看这个个例子。

你写了个很棒的渲染函数，帧率为1000FPS（1毫秒/帧）。不过你在着色器里加了一个很小的计算，开销仅0.1毫秒。然后，1/0.0011 = 900。帧率一下子掉了100FPS。信条：切勿将FPS作为性能分析标准。

如果想制作一个60fps的游戏，目标就是16.6666毫秒；如果想制作一个30fps的游戏，目标就是33.3333毫秒。知道这些就够了。

从“第九课：VBO索引”开始就有这段FPS计数器的代码，参见`tutorial09_vbo_indexing/tutorial09.cpp`。其他的性能测试工具可参考[“工具——调试器”](http://www.opengl-tutorial.org/miscellaneous/useful-tools-links/#header-4)。 

> &copy; http://www.opengl-tutorial.org/

> Written with [Mou](http://25.io/mou/)