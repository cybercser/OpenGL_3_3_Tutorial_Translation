第十七课：旋转Tutorial 17 : Rotations

前言：旋转 vs. 朝向Foreword: rotation VS orientation
欧拉角Euler Angles
四元数Quaternions
看懂四元数Reading quaternions
基本操作Basic operations
怎样在C++中创建四元数？How do I create a quaternion in C++ ?
怎样在GLSL中创建四元数？How do I create a quaternion in GLSL ?
怎样把四元数转换为矩阵？How do I convert a quaternion to a matrix ?
那究竟该用哪一个呢？So, which one should I choose ?
其他资源Other resources
速查手册Cheat-sheet
怎样旋转一个点？How do I apply a rotation to a point ?
怎样对两个四元数插值？How do I interpolate between 2 quaternions ?
怎样累积两个旋转？How do I cumulate 2 rotations ?
怎样计算两向量之间的旋转量？How do I find the rotation between 2 vectors ?
我需要一个类似gluLookAt的函数。怎样旋转物体使之朝向某点？I need an equivalent of gluLookAt. How do I orient an object towards a point ?
怎样使用LookAt且限制旋转速度？How do I use LookAt, but limit the rotation at a certain speed ?
怎样……How do I…
本课内容有点超出OpenGL的范畴，不过倒是解决了一个非常普遍的问题：怎样表示旋转？This tutorial goes a bit outside the scope of OpenGL, but nevertheless tackles a very common problem: how to represent rotations ?

第三课：矩阵中，我们知道矩阵可以将点绕某个轴旋转。矩阵可以简洁地表示顶点的变换，但处理起来难度较大：例如，从最终结果中获取旋转轴就很麻烦。In Tutorial 3 – Matrices, we learnt that matrices are able to rotate a point around a specific axis. While matrices are a neat way to transform vertices, handling matrices is difficult: for instance, getting the rotation axis from the final matrix is quite tricky.

本课将展示两种最常见的表示旋转的方法：欧拉角和四元数。最重要的是，本课会详细解释为何要尽可能地使用四元数。We will present the two most common ways to represent rotation: Euler angles and Quaternions. Most importantly, we will explain why you should probably use Quaternions.



前言：旋转 vs. 朝向Foreword: rotation VS orientation

阅读有关旋转的文献时，你可能会为其中的术语感到困惑。本课中：While reading articles on rotations, you might get confused because of the vocabulary. In this tutorial:

“朝向”是一种状态：该物体的朝向为……An orientation is a state: “the object’s orientation is…”
“旋转”是一个操作：旋转该物体A rotation is an operation: “Apply this rotation to the object”
也就是说，当你实施旋转操作时，就改变了物体的朝向。That is, when you apply a rotation, you change the orientation. 两者形式相同，因此容易引起误解。闲话少叙，开始进入正题……Both can be represented with the same tools, which leads to the confusion. Now, let’s get started…

欧拉角Euler Angles

欧拉角是表示朝向的最简方法，只需存储绕X、Y、Z轴旋转的角度，非常容易理解。你可以用vec3来存储一个欧拉角：Euler angles are the easiest way to think of an orientation. You basically store three rotations around the X, Y and Z axes. It’s a very simple concept to grasp. You can use a vec3 to store it:


vec3 EulerAngles( RotationAroundXInRadians, RotationAroundYInRadians, RotationAroundZInRadians);
这三个旋转量是依次施加的，通常的顺序是：Y-Z-X（但并不一定要按照这种顺序）。顺序不同，旋转的结果也不同。These 3 rotations are then applied successively, usually in this order: first Y, then Z, then X (but not necessarily). Using a different order yields different results.

欧拉角的一个简单运用就是设置人物的朝向。通常，游戏人物不会绕X和Z轴旋转，仅仅绕竖直的Y轴旋转。因此，只需维护一个绕Y轴旋转的角度即可，无需打理三个朝向。One simple use of Euler angles is setting a character’s orientation. Usually game characters do not rotate on X and Z, only on the vertical axis. Therefore, it’s easier to write, understand and maintain “float direction;” than 3 different orientations.

另外一个使用欧拉角的例子是FPS相机：用一个角度表示头部的平转（绕Y轴），一个角度表示俯仰（绕X轴）。参见common/controls.cpp的示例。Another good use of Euler angles is an FPS camera: you have one angle for the heading (Y), and one for up/down (X). See common/controls.cpp for an example.

不过，面对更加复杂的情况时，欧拉角就显得力不从心了。例如：However, when things get more complex, Euler angle will be hard to work with. For instance :

很难对两个朝向进行插值。简单地对X、Y、Z角度进行插值得到的结果很不理想。Interpolating smoothly between 2 orientations is hard. Naively interpolating the X,Y and Z angles will be ugly.
实施多次旋转很复杂且不精确：必须计算出最终的旋转矩阵，然后据此推测书欧拉角。Applying several rotations is complicated and unprecise: you have to compute the final rotation matrix, and guess the Euler angles from this matrix
“臭名昭著”的“万向节死锁”问题有时会让旋转“卡死”。其他一些奇异状态还会导致模型方向翻转。A well-known problem, the “Gimbal Lock”, will sometimes block your rotations, and other singularities which will flip your model upside-down.
不同的角度可产生同样的旋转（例如-180°和180°）Different angles make the same rotation ( -180° and 180°, for instance )
繁杂不已，如上所述，一般的顺序是YZX，如果用了另外一个库，其顺序又不是YZX，那就麻烦了。It’s a mess – as said above, usually the right order is YZX, but if you also use a library with a different order, you’ll be in trouble.
某些操作很复杂：如绕指定的轴旋转角度N。Some operations are complicated: for instance, rotation of N degrees around a specific axis.
四元数是表示旋转的好工具，可解决上述问题：Quaternions are a tool to represent rotations, which solves these problems.

四元数Quaternions

四元数由一组4个数字[x y z w]构成，表示了如下的旋转：A quaternion is a set of 4 numbers, [x y z w], which represents rotations the following way:

// RotationAngle is in radians
x = RotationAxis.x * sin(RotationAngle / 2)
y = RotationAxis.y * sin(RotationAngle / 2)
z = RotationAxis.z * sin(RotationAngle / 2)
w = cos(RotationAngle / 2)
RotationAxis，顾名思义即旋转轴。RotationAxis is, as its name implies, the axis around which you want to make your rotation.

RotationAngle是旋转的角度。RotationAngle is the angle of rotation around this axis.



因此，实际上四元数存储了一个旋转轴和一个旋转角度。这让旋转的结合变得简单了。So essentially quaternions store a rotation axis and a rotation angle, in a way that makes combining rotations easy.

看懂四元数Reading quaternions

这种格式当然没有欧拉角那么直观了，不过仔细看还是能看明白的：xyz分量大致代表了各个轴上的旋转分量，而w=acos(旋转角度/2)。举个例子，假设你在调试器中看到了这样的值[ 0.7 0 0 0.7 ]。x=0.7，比y、z的大，因此主要是在绕X轴旋转；而2*acos(0.7) = 1.59弧度，所以旋转角度应该是90°。：This format is definitely less intuitive than Euler angles, but it’s still readable: the xyz components match roughly the rotation axis, and w is the acos of the rotation angle (divided by 2). For instance, imagine that you see the following values in the debugger: [ 0.7 0 0 0.7 ]. x=0.7, it’s bigger than y and z, so you know it’s mostly a rotation around the X axis; and 2*acos(0.7) = 1.59 radians, so it’s a rotation of 90°.

同理，[0 0 0 1] (w=1)表示旋转角度 = 2*acos(1) = 0，因此这是一个单位四元数，表示没有发生旋转。Similarly, [0 0 0 1] (w=1) means that angle = 2*acos(1) = 0, so this is a unit quaternion, which makes no rotation at all.

基本操作Basic operations

了解四元数的数学原理通常用处不大：这种表示方式太晦涩了，一般通过一些便捷函数来做这些数学计算。如果对这些数学原理感兴趣，可以参考有用的工具和链接中的数学书籍。Knowing the math behind the quaternions is rarely useful: the representation is so unintuitive that you usually only rely on utility functions which do the math for you. If you’re interested, see the math books in the Useful Tools & Links page.

怎样在C++中创建四元数？How do I create a quaternion in C++ ?

// Don't forget to #include <glm/gtc/quaternion.hpp> and <glm/gtx/quaternion.hpp>
 
// Creates an identity quaternion (no rotation)
quat MyQuaternion;
 
// Direct specification of the 4 components
// You almost never use this directly
MyQuaternion = quat(w,x,y,z);
 
// Conversion from Euler angles (in radians) to Quaternion
vec3 EulerAngles(90, 45, 0);
MyQuaternion = quat(EulerAngles);
 
// Conversion from axis-angle
// In GLM the angle must be in degrees here, so convert it.
MyQuaternion = gtx::quaternion::angleAxis(degrees(RotationAngle), RotationAxis);
怎样在GLSL中创建四元数？How do I create a quaternion in GLSL ?

不要这么干。把四元数转换为旋转矩阵，并用在模型矩阵中。顶点会一如既往地随着MVP矩阵的变化而旋转。You don’t. Convert your quaternion to a rotation matrix, and use it in the Model Matrix. Your vertices will be rotated as usual, with the MVP matrix.

某些情况下，你可能确实需要在GLSL中使用四元数。例如，在GPU上做骨骼动画。GLSL中没有四元数类型，但是可以将四元数存在vec4类型变量中，然后在shader中做你指定的计算。In some cases, you might actually want to use quaternions in GLSL, for instance if you do skeletal animation on the GPU. There is no quaternion type in GLSL, but you can pack one in a vec4, and do the math yourself in the shader.

怎样把四元数转换为矩阵？How do I convert a quaternion to a matrix ?

mat4 RotationMatrix = quaternion::toMat4(quaternion);
这下可以像往常一样建立模型矩阵了:You can now use it to build your Model matrix as usual:

mat4 RotationMatrix = quaternion::toMat4(quaternion);
...
mat4 ModelMatrix = TranslationMatrix * RotationMatrix * ScaleMatrix;
// You can now use ModelMatrix to build the MVP matrix
那究竟该用哪一个呢？So, which one should I choose ?

在欧拉角和四元数之间作选择还真不是件简单的事。欧拉角对于艺术家们来说显得很直观，因此，如果要做一款3D编辑器，请选用欧拉角。但对程序员来说，四元数却是最方便的。所以在写3D引擎内核时应该选用四元数。Choosing between Euler angles and quaternions is tricky. Euler angles are intuitive for artists, so if you write some 3D editor, use them. But quaternions are handy for programmers, and faster too, so you should use them in a 3D engine core.

一个普遍的共识是：在程序内部使用四元数，在需要和用户交互的地方就用欧拉角。The general consensus is exactly that: use quaternions internally, and expose Euler angles whenever you have some kind of user interface.

这样，在处理各种问题时，你才能得心应手（至少会轻松一点）。如果确有必要（如上文所述的相机，人体等等），就用欧拉角也行，只需后期做些转换工作。You will be able to handle all you will need (or at least, it will be easier), and you can still use Euler angles for entities that require it ( as said above: the camera, humanoids, and that’s pretty much it) with a simple conversion.

其他资源Other resources

有用的工具和链接中的书籍The books on Useful Tools & Links !
老是老了点，游戏编程精粹1有几篇不错的关于四元数的文章。没准儿可以在网上找到。As old as it can be, Game Programming Gems 1 has several awesome articles on quaternions. You can probably find them online too.
一个关于旋转的GDC报告A GDC presentation on rotations
The Game Programing Wiki’s Quaternion tutorial
Ogre3D’s FAQ on quaternions. Most of the 2nd part is ogre-specific, though.
Ogre3D’s Vector3D.h and Quaternion.cpp
速查手册Cheat-sheet

怎样判断两个四元数是否相同？How do I know it two quaternions are similar ?

向量点积是两向量夹角的余弦值。若该值为1，那么这两个向量同向。When using vector, the dot product gives the cosine of the angle between these vectors. If this value is 1, then the vectors are in the same direction.

四元数的十分相似：With quaternions, it’s exactly the same:

float matching = quaternion::dot(q1, q2);
if ( abs(matching-1.0) < 0.001 ){
    // q1 and q2 are similar
}
求点积的acos值还可以得到q1和q2间的夹角。You can also get the angle between q1 and q2 by taking the acos() of this dot product.

怎样旋转一个点？How do I apply a rotation to a point ?

方法如下：You can do the following:

rotated_point = orientation_quaternion *  point;
……但如果想计算模型矩阵，你得先将其转换为矩阵。… but if you want to compute your Model Matrix, you should probably convert it to a matrix instead.

注意旋转的中心始终是原点。如果想绕别的点旋转：Note that the center of rotation is always the origin. If you want to rotate around another point:

rotated_point = origin + (orientation_quaternion * (point-origin));
怎样对两个四元数插值？How do I interpolate between 2 quaternions ?

SLERP意为球面线性插值（Spherical Linear intERPolation）、可以用GLM中的mix函数完成SLERP：This is called a SLERP: Spherical Linear intERPolation. With GLM, you can do this with mix:

glm::quat interpolatedquat = quaternion::mix(quat1, quat2, 0.5f); // or whatever factor
怎样累积两个旋转？How do I cumulate 2 rotations ?

简单！两个四元数相乘即可。顺序和矩阵乘法一致。亦即逆序相乘：Simple ! Just multiply the two quaternions together. The order is the same as for matrices, i.e. reverse:

quat combined_rotation = second_rotation * first_rotation;
怎样计算两向量之间的旋转量？How do I find the rotation between 2 vectors ?

（也就是说，四元数得把v1旋转到v2的方向）(in other words: the quaternion needed to rotate v1 so that it matches v2)

基本思路很明了：The basic idea is straightforward:

两向量间的夹角很好找：acos(点积)。The angle between the vectors is simple to find: the dot product gives its cosine.
旋转轴很好找：两向量的叉乘积。The needed axis is also simple to find: it’s the cross product of the two vectors.
如下的算法就是遵循的上述思路，还处理了若干个特例：The following algorithm does exactly this, but also handles a number of special cases:

quat RotationBetweenVectors(vec3 start, vec3 dest){
    start = normalize(start);
    dest = normalize(dest);
 
    float cosTheta = dot(start, dest);
    vec3 rotationAxis;
 
    if (cosTheta < -1 + 0.001f){
        // special case when vectors in opposite directions:
        // there is no "ideal" rotation axis
        // So guess one; any will do as long as it's perpendicular to start
        rotationAxis = cross(vec3(0.0f, 0.0f, 1.0f), start);
        if (gtx::norm::length2(rotationAxis) < 0.01 ) // bad luck, they were parallel, try again!
            rotationAxis = cross(vec3(1.0f, 0.0f, 0.0f), start);
 
        rotationAxis = normalize(rotationAxis);
        return gtx::quaternion::angleAxis(180.0f, rotationAxis);
    }
 
    rotationAxis = cross(start, dest);
 
    float s = sqrt( (1+cosTheta)*2 );
    float invs = 1 / s;
 
    return quat(
        s * 0.5f, 
        rotationAxis.x * invs,
        rotationAxis.y * invs,
        rotationAxis.z * invs
    );
 
}
（可在common/quaternion_utils.cpp中找到该函数）(You can find this function in common/quaternion_utils.cpp)

我需要一个类似gluLookAt的函数。怎样旋转物体使之朝向某点？I need an equivalent of gluLookAt. How do I orient an object towards a point ?

使用函数Use RotationBetweenVectors !

// Find the rotation between the front of the object (that we assume towards +Z,
// but this depends on your model) and the desired direction
quat rot1 = RotationBetweenVectors(vec3(0.0f, 0.0f, 1.0f), direction);
现在，你也许想让物体保持竖直：Now, you might also want to force your object to be upright:

// Recompute desiredUp so that it's perpendicular to the direction
// You can skip that part if you really want to force desiredUp
vec3 right = cross(direction, desiredUp);
desiredUp = cross(right, direction);
 
// Because of the 1rst rotation, the up is probably completely screwed up.
// Find the rotation between the "up" of the rotated object, and the desired up
vec3 newUp = rot1 * vec3(0.0f, 1.0f, 0.0f);
quat rot2 = RotationBetweenVectors(newUp, desiredUp);
组合到一起：Now, combine them:

quat targetOrientation = rot2 * rot1; // remember, in reverse order.
注意，“direction”仅仅是direction方向，并非目标位置！你可以轻松计算出方向：targetPos – currentPos。Beware, “direction” is, well, a direction, not the target position ! But you can compute the direction simply: targetPos – currentPos.

得到目标朝向后，你很可能想对startOrientation和targetOrientation进行插值。Once you have this target orientation, you will probably want to interpolate between startOrientation and targetOrientation.

（可在common/quaternion_utils.cpp中找到此函数。）(You can find this function in common/quaternion_utils.cpp)

怎样使用LookAt且限制旋转速度？How do I use LookAt, but limit the rotation at a certain speed ?

基本思想是采用SLERP（用glm::mix函数），但要控制插值的幅度，避免角度偏大。The basic idea is to do a SLERP ( = use glm::mix ), but play with the interpolation value so that the angle is not bigger than the desired value:

float mixFactor = maxAllowedAngle / angleBetweenQuaternions;
quat result = glm::gtc::quaternion::mix(q1, q2, mixFactor);
Here is a more complete implementation, which deals with many special cases. Note that it doesn’t use mix() directly as an optimization.

quat RotateTowards(quat q1, quat q2, float maxAngle){
 
    if( maxAngle < 0.001f ){
        // No rotation allowed. Prevent dividing by 0 later.
        return q1;
    }
 
    float cosTheta = dot(q1, q2);
 
    // q1 and q2 are already equal.
    // Force q2 just to be sure
    if(cosTheta > 0.9999f){
        return q2;
    }
 
    // Avoid taking the long path around the sphere
    if (cosTheta < 0){
        q1 = q1*-1.0f;
        cosTheta *= -1.0f;
    }
 
    float angle = acos(cosTheta);
 
    // If there is only a 2° difference, and we are allowed 5°,
    // then we arrived.
    if (angle < maxAngle){
        return q2;
    }
 
    float fT = maxAngle / angle;
    angle = maxAngle;
 
    quat res = (sin((1.0f - fT) * angle) * q1 + sin(fT * angle) * q2) / sin(angle);
    res = normalize(res);
    return res;
 
}
可以这样用RotateTowards函数：You can use it like that:

CurrentOrientation = RotateTowards(CurrentOrientation, TargetOrientation, 3.14f * deltaTime );
（可在common/quaternion_utils.cpp中找到此函数）(You can find this function in common/quaternion_utils.cpp)

怎样……How do I…

若有疑问，可e-mail联系我们。我们将把您的问题添加到此文中。If you can’t figure it out, drop us an email, and we’ll add it to the list !