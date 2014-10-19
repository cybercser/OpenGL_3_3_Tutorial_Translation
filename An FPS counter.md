FPS计数器
===
时刻关注性能在实时计算机图形学中时很重要的。比较好的做法是选择一个目标FPS（通常是60 FPS或30 FPS），然后竭尽所能朝这个目标努力。

FPS计数器工作原理大致如下:

```
 double lastTime = glfwGetTime();
 int nbFrames = 0;

 do{
 
     // Measure speed
     double currentTime = glfwGetTime();
     nbFrames++;
     if ( currentTime - lastTime &gt;= 1.0 ){ // If last prinf() was more than 1 sec ago
         // printf and reset timer
         printf("%f ms/frame\n", 1000.0/double(nbFrames));
         nbFrames = 0;
         lastTime += 1.0;
     }

     ... rest of the main loop
```

代码中有一处有些异样。这个FPS计数器显示的是绘制每一帧所需的时间（单位毫秒，取一秒内的平均值），而不是过去的一秒内绘制的帧数。T

实际上这种计法要**好得多**。千万不要太仰仗于FPS。帧每秒 = 1 / 秒每帧，因此二者互为倒数。人们对倒数的感觉太不靠谱了。举个例子。

你写了个很厉害的绘制函数，帧率为1000FPS（1毫秒/帧）。不过你在着色器里加了一个很小的计算，开销仅0.1毫秒。然后，1 / 0.0011 = 900。帧率一下子掉了100FPS。信条：切勿将FPS作为性能分析标准。

如果想制作一个60fps的游戏，目标就是16.6666毫秒；如果想制作一个30fps的游戏，目标就是33.3333毫秒。知道这些就够了。

从“第九课：VBO索引”开始，这段FPS的代码就能用了，参见tutorial09_vbo_indexing/tutorial09.cpp。其他可用的性能工具可参考[“工具——调试器”](http://www.opengl-tutorial.org/miscellaneous/useful-tools-links/#header-4)。 

> &copy; http://www.opengl-tutorial.org/

> Written with [Mou](http://25.io/mou/)