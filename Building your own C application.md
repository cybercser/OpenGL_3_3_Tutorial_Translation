<!DOCTYPE html>
<html dir="ltr" lang="en-US">
<head>
<meta charset="UTF-8" />
<title>Building your own C application | opengl-tutorial.org</title>

<link rel="stylesheet" href="http://www.opengl-tutorial.org/wp-content/plugins/sitepress-multilingual-cms/res/css/language-selector.css?v=2.0.4.1" type="text/css" media="all" />
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="stylesheet" type="text/css" media="all" href="http://www.opengl-tutorial.org/wp-content/themes/celine/style.css" />
<link rel="pingback" href="http://www.opengl-tutorial.org/xmlrpc.php" />
<link rel="alternate" type="application/rss+xml" title="opengl-tutorial.org &raquo; Feed" href="http://www.opengl-tutorial.org/feed/" />
<link rel="alternate" type="application/rss+xml" title="opengl-tutorial.org &raquo; Comments Feed" href="http://www.opengl-tutorial.org/comments/feed/" />
<link rel='stylesheet' id='thickbox.css-css'  href='http://www.opengl-tutorial.org/wp-includes/js/thickbox/thickbox.css?ver=1.0' type='text/css' media='all' />
<link rel='stylesheet' id='jquery-toc-css'  href='http://www.opengl-tutorial.org/wp-content/plugins/jquery-table-of-contents/jquery-toc.css?ver=3.4.2' type='text/css' media='all' />
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-includes/js/jquery/jquery.js?ver=1.7.2'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var jQueryTOC = {"source_selector":".single .entry","header_tag":"h2","output_id":"jquery_toc","output_title":"On this page:"};
/* ]]> */
</script>
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-content/plugins/jquery-table-of-contents/jquery-toc.js?ver=3.4.2'></script>
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-includes/js/comment-reply.js?ver=3.4.2'></script>
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-content/plugins/google-analyticator/external-tracking.min.js?ver=6.3.4'></script>
<link rel="EditURI" type="application/rsd+xml" title="RSD" href="http://www.opengl-tutorial.org/xmlrpc.php?rsd" />
<link rel="wlwmanifest" type="application/wlwmanifest+xml" href="http://www.opengl-tutorial.org/wp-includes/wlwmanifest.xml" /> 
<meta name="generator" content="WordPress 3.4.2" />
<link rel='canonical' href='http://www.opengl-tutorial.org/miscellaneous/building-your-own-c-application/' />
			<!-- Last Modified Footer -->
				<style type="text/css" media="screen">p.lmf_generated_text { color: #A0A0A0; }</style>			<!-- /Last Modified Footer -->
			<script type="text/javascript">var icl_lang = 'en';var icl_home = 'http://www.opengl-tutorial.org/';</script>
<script type="text/javascript" src="http://www.opengl-tutorial.org/wp-content/plugins/sitepress-multilingual-cms/res/js/sitepress.js"></script>
<meta name="generator" content="WPML ver:2.0.4.1 stt:1,61,4,3,2;0;0;0" />
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shCore.js'></script>
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shAutoloader.js'></script>
<link type='text/css' rel='stylesheet' href='http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/styles/shCore.css'/>
<link type='text/css' rel='stylesheet' href='http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/styles/shThemeDefault.css'/>
<style type="text/css">.broken_link, a.broken_link {
	text-decoration: line-through;
}</style><style type="text/css" id="custom-background-css">
body.custom-background { background-color: #1F1F1F; }
</style>
<!-- Google Analytics Tracking by Google Analyticator 6.3.4: http://www.videousermanuals.com/google-analyticator/ -->
<script type="text/javascript">
	var analyticsFileTypes = ['zip'];
	var analyticsEventTracking = 'enabled';
</script>
<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-22633480-2']);
        _gaq.push(['_addDevId', 'i9k95']); // Google Analyticator App ID with Google 
	_gaq.push(['_trackPageview']);
	_gaq.push(['_trackPageLoadTime']);

	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
</script>
</head>

<body class="page page-id-587 page-child parent-pageid-167 page-template-default custom-background">
<div id="wrapper" class="hfeed">
	<div id="header">
		<div id="masthead">
			<div id="branding" role="banner">
								<div id="site-title">
					<span>
						<!--a href="http://www.opengl-tutorial.org/" title="opengl-tutorial.org" rel="home">opengl-tutorial.org</a-->
					</span>
				</div>
				<div id="site-description">Tutorials for OpenGL 3.3 and later</div>

										<img src="http://www.opengl-tutorial.org/wp-content/themes/celine/images/headers/blue_bubbles.png" width="940" height="100" alt="" />
										<div class="clear"></div>
			</div><!-- #branding -->
<div class="clear"></div>
			<div id="access" role="navigation">
			  				<div class="skip-link screen-reader-text"><a href="#content" title="Skip to content">Skip to content</a></div>
								<div class="menu"><ul><li ><a href="http://www.opengl-tutorial.org/" title="Home">Home</a></li><li class="page_item page-item-138"><a href="http://www.opengl-tutorial.org/beginners-tutorials/">Basic OpenGL</a><ul class='children'><li class="page_item page-item-7"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-1-opening-a-window/">Tutorial 1 : Opening a window</a></li><li class="page_item page-item-14"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-2-the-first-triangle/">Tutorial 2 : The first triangle</a></li><li class="page_item page-item-19"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/">Tutorial 3 : Matrices</a></li><li class="page_item page-item-82"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-4-a-colored-cube/">Tutorial 4 : A Colored Cube</a></li><li class="page_item page-item-83"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-5-a-textured-cube/">Tutorial 5 : A Textured Cube</a></li><li class="page_item page-item-170"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-6-keyboard-and-mouse/">Tutorial 6 : Keyboard and Mouse</a></li><li class="page_item page-item-185"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-7-model-loading/">Tutorial 7 : Model loading</a></li><li class="page_item page-item-198"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-8-basic-shading/">Tutorial 8 : Basic shading</a></li></ul></li><li class="page_item page-item-140"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/">Intermediate Tutorials</a><ul class='children'><li class="page_item page-item-252"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-9-vbo-indexing/">Tutorial 9 : VBO Indexing</a></li><li class="page_item page-item-281"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-10-transparency/">Tutorial 10 : Transparency</a></li><li class="page_item page-item-291"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-11-2d-text/">Tutorial 11 : 2D text</a></li><li class="page_item page-item-323"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-12-opengl-extensions/">Tutorial 12 : OpenGL Extensions</a></li><li class="page_item page-item-301"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/">Tutorial 13 : Normal Mapping</a></li><li class="page_item page-item-311"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-14-render-to-texture/">Tutorial 14 : Render To Texture</a></li><li class="page_item page-item-344"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-15-lightmaps/">Tutorial 15 : Lightmaps</a></li><li class="page_item page-item-381"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-16-shadow-mapping/">Tutorial 16 : Shadow mapping</a></li></ul></li><li class="page_item page-item-167 current_page_ancestor current_page_parent"><a href="http://www.opengl-tutorial.org/miscellaneous/">Miscellaneous</a><ul class='children'><li class="page_item page-item-526"><a href="http://www.opengl-tutorial.org/miscellaneous/faq/">FAQ</a></li><li class="page_item page-item-209"><a href="http://www.opengl-tutorial.org/miscellaneous/math-cheatsheet/">Math Cheatsheet</a></li><li class="page_item page-item-210"><a href="http://www.opengl-tutorial.org/miscellaneous/useful-tools-links/">Useful Tools &amp; Links</a></li><li class="page_item page-item-436"><a href="http://www.opengl-tutorial.org/miscellaneous/an-fps-counter/">An FPS counter</a></li><li class="page_item page-item-587 current_page_item"><a href="http://www.opengl-tutorial.org/miscellaneous/building-your-own-c-application/">Building your own C application</a></li></ul></li><li class="page_item page-item-200"><a href="http://www.opengl-tutorial.org/download/">Download</a></li></ul></div>
			</div><!-- #access -->
		</div><!-- #masthead -->
	</div><!-- #header -->

	<div id="main">

		<div id="container">
			<div id="content" role="main">

			

				<div id="post-587" class="post-587 page type-page status-publish hentry">
											<h1 class="entry-title">Building your own C application</h1>
					
					<div class="entry-content">
						<p>A lot of efforts have been made so that these tutorials are as simple to compile &amp; run as possible. Unfortunately, this also means that CMakes hides how to do that on your own project.</p>
<p>So, this tutorial will explain how to build your own C application from scatch. But first, you need a basic knowledge of what the compiler actually does.</p>
<p><span style="color: #ff0000;">Please don&#8217;t skip the first two sections. If you&#8217;re reading this tutorial, you probably need to know this stuff.</span></p>
<h1> The C application model</h1>
<h2>Preprocessing</h2>
<p>This is what all those <em>#defines</em> and <em>#includes</em> are about.</p>
<p>C preprocessing is a very simple process : cut&#8217;n pasting.</p>
<p>When the preprocessor sees the following MyCode.c :</p>
<pre class="brush: cpp;">#include "MyHeader.h"

void main(){
    FunctionDefinedInHeader();
}</pre>
<p>, it simply opens the file MyHeader.h, and cut&#8217;n pastes its contents into MyCode.c :</p>
<pre>// Begin of MyCode.c
// Begin of MyHeader.h
#ifndef MYHEADER_H
#define MYHEADER_H

void FunctionDefinedInHeader(); // Declare the function

#endif
// End of MyHeader.h

void main(){
    FunctionDefinedInHeader(); // Use it
}

// End of MyCode</pre>
<p>Similarly, <em>#define</em>s are cut&#8217;n pasted, <em>#if</em>s are analysed and potentially removed, etc.</p>
<p>At the end of this step we have a preprocessed C++ file, without any #define, #if, #ifdef, #include, ready to be compiled.</p>
<p>As an example, here is the main.cpp file of the 6th tutorial, fully preprocessed in Visual : <a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/tutorial06_preprocessed.txt">tutorial06_preprocessed</a>. Warning, it&#8217;s a huge file ! But it&#8217;s worth knowing what a seemingly simple .cpp really looks to the compiler.</p>
<h2>Compilation</h2>
<p>The compiler translates C++ code into a representation that the CPU can directly understand. For instance, the following code :</p>
<pre class="brush: cpp">int i=3;
int j=4*i+2;</pre>
<p>will be translated into this : x86 opcodes.</p>
<pre>mov         dword ptr [i],3
mov         eax,dword ptr [i]
lea         ecx,[eax*4+2]
mov         dword ptr [j],ecx</pre>
<p>Each .cpp file is compiled separately, and the resulting binary code is written in .o/.obj files.</p>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/compilation.png"><img class="alignnone size-full wp-image-596" title="compilation" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/compilation.png" alt="" width="813" height="544" /></a></p>
<p>Note that we don&#8217;t have an executable yet : one remaining step is needed.</p>
<h2>Linking</h2>
<p>The linker takes all the binary code (yours, and the one from external libraries), and generates the final executable. A few notes :</p>
<ul>
<li>A library has the .lib extension.</li>
<li>Some libraries are <em>static</em>. This means that the .lib contains all the x86 opcodes needed.</li>
<li>Some library are <em>dynamic</em> ( also said <em>shared</em> ). This means that the .lib doesn&#8217;t contain any x86 code; it simply says &#8220;I swear that functions <em>Foo</em>, <em>Bar</em> and <em>WhatsNot</em> will be available at runtime&#8221;.</li>
</ul>
<p>When the linker has run, you have an executable (.exe on Windows, .nothing_at_all on unix) :</p>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/linking.png"><img class="wp-image-597 alignnone" title="linking" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/linking.png" alt="" width="483" height="254" /></a></p>
<h2>Runtime</h2>
<p>When you launch the executable, the OS will open the .exe, and put the x86 opcodes in memory. As said earlier, some code isn&#8217;t available at this point : the code from dynamic libraries. But the linker was nice enough to say where to look for it : the .exe clearly says that the glClearColor function is implemented in OpenGL32.dll.</p>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/10/dynamiclinking.png"><img class="alignnone size-full wp-image-640" title="dynamiclinking" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/10/dynamiclinking.png" alt="" width="576" height="288" /></a></p>
<p>Windows will happily open the .dll and find glClearColor :</p>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/10/depends.png"><img class="alignnone size-full wp-image-639" title="depends" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/10/depends.png" alt="" width="1073" height="298" /></a></p>
<p>Sometimes a .dll can&#8217;t be found, probably because you screwed the installation process, and the program just can&#8217;t be run.</p>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/dynamiclinking.png"><img class="size-full wp-image-598 alignnone" title="dynamiclinking" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/dynamiclinking.png" alt="" width="437" height="223" /></a></p>
<h1>How do I do X with IDE Y ?</h1>
<p>The instructions on how to build an OpenGL application are separated from the following basic operations. This is on purpose :</p>
<ul>
<li>First, you&#8217;ll need to do these thinks all of the time, so you&#8217;d better know them well</li>
<li>Second, you will know what is OpenGL-specific and what is not.</li>
</ul>
<p>&nbsp;</p>
<h2>Visual Studio</h2>
<h3>Creating a new project</h3>
<p>File -&gt; New -&gt; Project -&gt; Empty project. Don&#8217;t use any weird wizard. Don&#8217;t use any option you may not know about (disable MFC, ATL, precompiled headers, stdafx, main file).</p>
<h3>Adding a source file in a project</h3>
<p>Right clic on Source Files -&gt; Add new.</p>
<h3>Adding include directories</h3>
<p>Right clic on project -&gt; Project Properties -&gt; C++ -&gt; General -&gt; Additional include directories. This is actually a dropdown list, you can modify the list conveniently.</p>
<h3>Link with a library</h3>
<p>Right clic on project -&gt; Project Properties -&gt; Linker -&gt; Input -&gt; Additional dependencies : type the name of the .lib. For instance : opengl32.lib</p>
<p>In Project Properties -&gt; Linker -&gt; General -&gt; Additional library directories, make sure that the path to the above library is present.</p>
<h3>Build, Run &amp; Debug</h3>
<p>Setting the working directory (where your textures &amp; shaders are) : Project Properties -&gt; Debugging -&gt; Working directory</p>
<p>Running : Shift-F5; but you&#8217;ll probably never need to do that. <em>Debug</em> instead : F5</p>
<p>A short list of debugging shortcuts :</p>
<ul>
<li>F9 on a line, or clicking on the left of the line number: setting a breakpoint. A red dot will appear.</li>
<li>F10 : execute current line</li>
<li>F11 : execute current line, but step into the functions this line is calling (&#8220;step into&#8221;)</li>
<li>Shift-F11 : run until the end of the function (&#8220;step out&#8221;)</li>
</ul>
<p>You also have plenty of debugging windows : watched variables, callstack, threads, &#8230;</p>
<h2>QtCreator</h2>
<p>QtCreator is available for free at <a href="http://qt-project.org/">http://qt-project.org/</a>.</p>
<h3>Creating a new project</h3>
<p>Use a plain C or C++ project; avoid the templates filled with Qt stuff.</p>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/QtCreator_newproject.png"><img class="size-full wp-image-613 alignnone" title="QtCreator_newproject" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/QtCreator_newproject.png" alt="" width="556" height="485" /></a></p>
<p>Use default options.</p>
<h3>Adding a source file in a project</h3>
<p>Use the GUI, or add the file in the .pro :</p>
<pre>SOURCES += main.cpp \
           other.cpp \
           foo.cpp</pre>
<h3>Adding include directories</h3>
<p>In the .pro file :</p>
<pre><code>INCLUDEPATH += &lt;your path&gt; \ &lt;other path&gt; </code></pre>
<h3>Link with a library</h3>
<p>Right clic on project -&gt; Add library</p>
<ul>
<li>If you&#8217;re on Linux and you installed the library with apt-get or similar, chances are that the library registered itself in the system. You can select &#8220;System package&#8221; and enter the name of the library ( ex : <em>libglfw</em> or <em>glew</em> )</li>
</ul>
<p><a href="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/QtCreator_linking.png"><img class="alignnone size-full wp-image-614" title="QtCreator_linking" src="http://www.opengl-tutorial.org/wp-content/uploads/2012/09/QtCreator_linking.png" alt="" width="1112" height="729" /></a></p>
<ul>
<li>If not, use &#8220;System Library&#8221;. Browse to where you compiled it.</li>
</ul>
<h3>Build, Run &amp; Debug</h3>
<p>Building : Ctrl-B, or the hammer on the bottom left corner.</p>
<p>Running : the green arrow. You can set the program&#8217;s arguments and working directory in Projects -&gt; Run Settings</p>
<p>Debugging :</p>
<ul>
<li>Setting a breakpoint : Click on the left of the line number. A red dot will appear.</li>
<li>F10 : execute current line</li>
<li>F11 : execute current line, but step into the functions this line is calling (&#8220;step into&#8221;)</li>
<li>Shift-F11 : run until the end of the function (&#8220;step out&#8221;)</li>
</ul>
<p>You also have plenty of debugging windows : watched variables, callstack, threads, &#8230;</p>
<h2>XCode</h2>
<p>Work in progress&#8230;</p>
<h3>Creating a new project</h3>
<h3>Adding a source file in a project</h3>
<h3>Adding include directories</h3>
<h3>Link with a library</h3>
<h3>Build, Run &amp; Debug</h3>
<h2>CMake</h2>
<p>CMake will create projects for almost any software building tool : Visual, QtCreator, XCode, make, Code::Blocks, Eclipse, etc, on any OS. This frees you from maintaining many project files.</p>
<h3>Creating a new project</h3>
<p>Create a CMakeLists.txt file and write the following inside (adapt if needed) :</p>
<pre>cmake_minimum_required (VERSION 2.6)
project (your_project_name)

find_package(OpenGL REQUIRED)

add_executable(your_exe_name
    tutorial04_colored_cube/tutorial04.cpp
    common/shader.cpp
    common/shader.hpp
)</pre>
<p>Launch the CMake GUI, browse to your .txt file, and select your build folder. Click Configure, then Generate. Your solution will be created in the build folder.</p>
<h3>Adding a source file in a project</h3>
<p>Simply add a line in the add_executable command.</p>
<h3>Adding include directories</h3>
<pre>include_directories(
    external/AntTweakBar-1.15/include/
    external/glfw-2.7.2/include/
    external/glm-0.9.1/
    external/glew-1.5.8/include/
    .
)</pre>
<h3>Link with a library</h3>
<pre>set(ALL_LIBS
    ${OPENGL_LIBRARY}
    GLFW_272
    GLEW_158
    ANTTWEAKBAR_151_OGLCORE_GLFW
)

target_link_libraries(tutorial01_first_window
    ${ALL_LIBS}
)</pre>
<h3>Build, Run &amp; Debug</h3>
<p>CMake doesn&#8217;t do that. Use your favourite IDE.</p>
<h2>make</h2>
<p>Please, just don&#8217;t use that.</p>
<h2>gcc</h2>
<p>It might be worth compiling a small project &#8220;by hand&#8221; in order to gain a better comprehension of the workflow. Just don&#8217;t do this on a real project&#8230;</p>
<p>Note that you can also do that on Windows using mingw.</p>
<p>Compile each .cpp file separately :</p>
<pre>g++ -c main.cpp
g++ -c tools.cpp</pre>
<div id=":2v"></div>
<p>As said above, you will have a main.o and a tools.o files. Link them :</p>
<pre>g++ main.o tools.o</pre>
<p>a <em>a.out</em> file appeared; It&#8217;s your executable, run it :</p>
<pre>./a.out</pre>
<p>That&#8217;s it !</p>
<h1>Building your own C application</h1>
<p>Armed with this knowledge, we can start building our own OpenGL application.</p>
<ol>
<li>Download the dependencies : Here we use GLFW, GLEW and GLM, but depending on your project, you might need something different. Save same preferably in a subdirectory of your project (for instance : external/)</li>
<li>They should be pre-compiled for your platform. GLM doesn&#8217;t have to be compiled, though.</li>
<li>Create a new project with the IDE of your choice</li>
<li>Add a new .cpp file in the project</li>
<li>Copy and paste, for instance, the following code (this is actually playground.cpp) :
<pre class="brush: cpp">#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;

#include &lt;GL/glew.h&gt;

#include &lt;GL/glfw.h&gt;

#include &lt;glm/glm.hpp&gt;
using namespace glm;

int main( void )
{
	// Initialise GLFW
	if( !glfwInit() )
	{
		fprintf( stderr, "Failed to initialize GLFW\n" );
		return -1;
	}

	glfwOpenWindowHint(GLFW_FSAA_SAMPLES, 4);
	glfwOpenWindowHint(GLFW_WINDOW_NO_RESIZE,GL_TRUE);
	glfwOpenWindowHint(GLFW_OPENGL_VERSION_MAJOR, 3);
	glfwOpenWindowHint(GLFW_OPENGL_VERSION_MINOR, 3);
	glfwOpenWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	// Open a window and create its OpenGL context
	if( !glfwOpenWindow( 1024, 768, 0,0,0,0, 32,0, GLFW_WINDOW ) )
	{
		fprintf( stderr, "Failed to open GLFW window. If you have an Intel GPU, they are not 3.3 compatible. Try the 2.1 version of the tutorials.\n" );
		glfwTerminate();
		return -1;
	}

	// Initialize GLEW
	if (glewInit() != GLEW_OK) {
		fprintf(stderr, "Failed to initialize GLEW\n");
		return -1;
	}

	glfwSetWindowTitle( "Playground" );

	// Ensure we can capture the escape key being pressed below
	glfwEnable( GLFW_STICKY_KEYS );

	// Dark blue background
	glClearColor(0.0f, 0.0f, 0.3f, 0.0f);

	do{
		// Draw nothing, see you in tutorial 2 !

		// Swap buffers
		glfwSwapBuffers();

	} // Check if the ESC key was pressed or the window was closed
	while( glfwGetKey( GLFW_KEY_ESC ) != GLFW_PRESS &amp;&amp;
		   glfwGetWindowParam( GLFW_OPENED ) );

	// Close OpenGL window and terminate GLFW
	glfwTerminate();

	return 0;
}</pre>
</li>
<li>Compile the project.</li>
</ol>
<p>You will have many compiler errors. We will analyse all of them, one by one.</p>
<h1>Troubleshooting</h1>
<p>The error messages below are for Visual Studio 2010, but they are more or less similar on GCC.</p>
<h2>Visual Studio &#8211; fatal error C1083: Cannot open filetype file: &#8216;GL/glew.h&#8217; : No such file or directory</h2>
<p>(or whichever other file)</p>
<p>Some headers are in weird locations. For instance, GLEW include files are located in external/glew-x.y.z/include/. The compiler has no way to magically guess this, so you have to tell him. In the project settings, add the appropriate path in the COMPILER (not linker) options.</p>
<p>Under <em>no circumstance</em> you should copy files in the compiler&#8217;s default directory (Program Files/Visual Studio/&#8230;). Technically, this will work, but it&#8217;s <em>very</em> bad practice.</p>
<p>Also, it&#8217;s good practice to use relative paths ( ./external/glew/&#8230; instead of C:/Users/username/Downloads/&#8230; )</p>
<p>As an example, this is what the tutorial&#8217;s CMake use :</p>
<pre>external/glfw-2.7.2/include
external/glm-0.9.1
external/glew-1.5.8/include</pre>
<p>Repeat until all files are found.</p>
<h2>GCC &#8211; fatal error: GL/glew.h: No such file or directory</h2>
<p>(or whichever other file)</p>
<p>This means that the library is not installed. If you&#8217;re lucky, the library is well-known and you just have to install it. This is the case for GLFW, GLEW and GLM :</p>
<pre>sudo apt-get install libglfw-dev libglm-dev libglew1.6-dev</pre>
<p>If this is not a widespread library, see the answer for Visual Studio above.</p>
<h2>Visual Studio &#8211; error LNK2019: unresolved external symbol glfwGetWindowParam referenced in function main</h2>
<p>(or whichever other symbol in whichever other function)</p>
<p>Congratulations ! You have a linker error. This is excellent news : this means that the compilation succeeded. Just one last step !</p>
<p>glfw functions are in an external library. You have to tell the linker about this library. Add it in the linker options. Don&#8217;t forget to add the path to the library.</p>
<p>As an example, this is what the Visual project use. The names are a bit unusual because this is a custom build. What&#8217;s more, GLM doesn&#8217;t need to be compiled or linked, so it&#8217;s not here.</p>
<pre>external\Debug\GLFW_272.lib
external\Debug\GLEW_158.lib</pre>
<h2>GCC &#8211; main.cpp: undefined reference to `glfwInit&#8217;</h2>
<p>(or whichever other symbol in whichever other file)</p>
<p>Same answer than for Visual Studio.</p>
<p>&nbsp;</p>
<h2>I set everything right, but I still have an &#8220;unresolved external symbol&#8221; error !</h2>
<p>This might me tricky to track down. Here are several options:</p>
<h3>I have a linker error with _imp_glewInit or some other symbol that begins with _imp</h3>
<p>This means that the library (in this case, glew) has been compiled as a <em>static</em> library, but you&#8217;re trying to use it as a <em>dynamic</em> library. Simply add the following preprocessor directive in your compiler&#8217;s options (for your own project, not glew&#8217;s) :</p>
<pre>GLEW_STATIC</pre>
<p>&nbsp;</p>
<h3>I have some other weird problem with GLFW</h3>
<p>Maybe GLFW was built as a dynamic library, but you&#8217;re trying to use it as a static one ?</p>
<p>Try adding the following preprocessor directive :</p>
<pre>GLFW_DLL</pre>
<h3> I have another linker problem ! Help me, I&#8217;m stuck !</h3>
<p>Please send us a detailed report and a fully featured zipped project, and we&#8217;ll add instructions.</p>
<h3>I&#8217;d like to solve this myself. What are the generic rules ?</h3>
<p>Let&#8217;s say you&#8217;re the author of GLFW. You want to provide the function glfwInit().</p>
<p>When building it as a DLL, you have to tell the compiler that glfwInit() is not like any other function in the DLL : it should be seen from others, unlike glfwPrivateImplementationMethodNobodyShouldCareAbout(). This is done by declaring the function &#8220;external&#8221; (with GCC) or &#8220;__declspec(dllexport)&#8221; (with Visual).</p>
<p>When you want to use glfw, you need to tell the compiler that this function is not really available : it should link to it dynamically. This is done by declaring the function &#8220;external&#8221; (with GCC) or &#8220;__declspec(dllimport)&#8221; (with Visual).</p>
<p>So you use a handy #define : GLFWAPI, and you use it to declare the functions :</p>
<p>GLFWAPI int  glfwInit( void );</p>
<ul>
<li>When you&#8217;re building as a DLL, you #define GLFW_BUILD_DLL. GLFWAPI then gets #define&#8217;d to __declspec(dllexport)</li>
<li>When you&#8217;re using GLFW as a DLL, you #define GLFW_DLL. GLFWAPI then gets #define&#8217;d to __declspec(dllimport)</li>
<li>When you&#8217;re building as a static lib, GLFWAPI is #define&#8217;d to nothing</li>
<li>When you&#8217;re using GLFW as a static lib, GLFWAPI is #define&#8217;d to nothing.</li>
</ul>
<p>So the rule is : these flags must be consistent. If you build a lib (any lib, not just GLFW) as a DLL, use the right preprocessor definition : GLFW_DLL, GLEW_STATIC</p>
<p>&nbsp;</p>
<h2>My program crashes !</h2>
<p>There are many reasons why a C++ OpenGL application might crash. Here are a few. If you don&#8217;t know the exact line where your program crashes, learn how to use a debugger ( see shortcuts above). PLEASE don&#8217;t debug with printf().</p>
<h3>I don&#8217;t even go inside main()</h3>
<p>This is most probably because some dll could not be found. Try opening your application with Dependency Walker (Windows) or ldd (Linux; try also <a href="http://stackoverflow.com/questions/6977298/dependency-walker-equivalent-for-linux">this</a>)</p>
<h3>My program crashes on glfwOpenWindow(), or any other function that creates an OpenGL context</h3>
<p>Several possible reasons :</p>
<ul>
<li>Your GPU doesn&#8217;t support the requested OpenGL version. Try to see the supported version with GPU Caps Viewer or similar. Update driver if it seems too low. Integrated Intel cards on netbooks especially suck. Use a lower version of OpenGL (2.1 for instance), and use extensions if you lack features.</li>
<li>Your OS doesn&#8217;t support the requested OpenGL version : Mac OS&#8230; same answer.</li>
<li>You&#8217;re trying to use GLEW with an OpenGL Core context (i.e. without all the deprecated stuff). This is a GLEW bug. Use glewExperimental=true before glewInit(), or use a compatibility profile ( i.e. use GLFW_OPENGL_CORE_PROFILE  instead of GLFW_OPENGL_CORE_PROFILE )</li>
</ul>
<h2>My program crashes on the first OpenGL call, or on the first buffer creation</h2>
<p>Three possible reasons :</p>
<ul>
<li>You&#8217;re not calling glewInit() AFTER glfwOpenWindow()</li>
<li>You&#8217;re using a core OpenGL profile, and you didn&#8217;t create a VAO. Add the following code after glewInit() :</li>
</ul>
<pre class="brush: cpp">	GLuint VertexArrayID;
	glGenVertexArrays(1, &amp;VertexArrayID);
	glBindVertexArray(VertexArrayID);</pre>
<ul>
<li>You&#8217;re using the default build of GLEW, which has a bug. You can&#8217;t use a Core OpenGL Profile due to this bug. Either Use glewExperimental=true before glewInit(), or ask GLFW for a Compatibility Profile instead :</li>
</ul>
<pre class="brush: cpp">    glfwOpenWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_COMPAT_PROFILE);</pre>
<h2>My program crashes when I try to load some file</h2>
<p>Setup your working directory correctly. See Tutorial 1.</p>
<p>Create a test.txt file and try the following code :</p>
<pre class="brush: cpp">if ( fopen("test.txt", "r" ) == NULL ){
    printf("I'm probably running my program from a wrong folder");
}</pre>
<p><span style="color: #ff0000;">USE THE DEBUGGER !!!! </span>Seriously ! Don&#8217;t debug with printf(); use a good IDE. <a href="http://www.dotnetperls.com/debugging">http://www.dotnetperls.com/debugging</a> is for C# but is valid for C++ too. Will vary for XCode and QtCreator, but concepts remain exactly the same.</p>
<h2>Something else is wrong</h2>
<p>Please contact us by mail</p>
<p>&nbsp;</p>
																	</div><!-- .entry-content -->
				</div><!-- #post-## -->

				
			<div id="comments">


	<p class="nocomments">Comments are closed.</p>


								
</div><!-- #comments -->


			</div><!-- #content -->
		</div><!-- #container -->

<div id="sideBar">
		<div id="primary" class="widget-area" role="complementary">
			<ul class="xoxo">

<li id="text-3" class="widget-container widget_text"><h3 class="widget-title">Staying tuned</h3>			<div class="textwidget"><ul>
<li class="page_item">
<a href="mailto:contact@opengl-tutorial.org?body=Hi ! Did you read the FAQ ? http://www.opengl-tutorial.org/miscellaneous/faq/">Drop us a word</a>
</li>
<li class="page_item">
<a href="http://www.opengl-tutorial.org/miscellaneous/faq/">FAQ</a>
</li>
<li class="page_item">
<a href="http://feeds.feedburner.com/Opengl-tutorialorg">
<img src="http://www.mozilla.org/images/feed-icon-14x14.png" alt="RSS Feed" title="RSS Feed" />&nbsp RSS
</a> 
</li>
<li class="page_item">
<a href="http://forums.opengl-tutorial.org">
Forums</a> 
</li>
<li class="page_item"
<!-- AddThis Button BEGIN -->
<div class="addthis_toolbox addthis_default_style ">
<a class="addthis_button_google_plusone" g:plusone:count="false"></a>
<a class="addthis_button_preferred_1"></a>
<a class="addthis_button_preferred_2"></a>
<a class="addthis_button_preferred_3"></a>
<a class="addthis_button_preferred_4"></a>
<a class="addthis_button_compact"></a>
</div>
<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4f2825193b4dc8b7"></script>
<!-- AddThis Button END -->
</li>
</ul></div>
		</li><li id="search-2" class="widget-container widget_search"><h3 class="widget-title">Search</h3><form role="search" method="get" id="searchform" action="http://www.opengl-tutorial.org/" >
	<div><label class="screen-reader-text" for="s">Search for:</label>
	<input type="text" value="" name="s" id="s" />
	<input type="submit" id="searchsubmit" value="Search" />
	</div>
	</form></li><li id="language-selector" class="widget-container icl_languages_selector"><h3 class="widget-title">Languages</h3><div id="lang_sel"  >
    <ul>
        <li><a href="#" class="lang_sel_sel icl-en">
                            
            <img  class="iclflag" src="http://www.opengl-tutorial.org/wp-content/plugins/sitepress-multilingual-cms/res/flags/en.png" alt="en" />                                
            &nbsp;English</a>                    </li>
    </ul>    
</div>
</li>			</ul>
		</div><!-- #primary .widget-area -->


		<div id="secondary" class="widget-area" role="complementary">
			<ul class="xoxo">
				<li id="pages-4" class="widget-container widget_pages"><h3 class="widget-title">Tutorials</h3>		<ul>
			<li class="page_item page-item-138"><a href="http://www.opengl-tutorial.org/beginners-tutorials/">Basic OpenGL</a>
<ul class='children'>
	<li class="page_item page-item-7"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-1-opening-a-window/">Tutorial 1 : Opening a window</a></li>
	<li class="page_item page-item-14"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-2-the-first-triangle/">Tutorial 2 : The first triangle</a></li>
	<li class="page_item page-item-19"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-3-matrices/">Tutorial 3 : Matrices</a></li>
	<li class="page_item page-item-82"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-4-a-colored-cube/">Tutorial 4 : A Colored Cube</a></li>
	<li class="page_item page-item-83"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-5-a-textured-cube/">Tutorial 5 : A Textured Cube</a></li>
	<li class="page_item page-item-170"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-6-keyboard-and-mouse/">Tutorial 6 : Keyboard and Mouse</a></li>
	<li class="page_item page-item-185"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-7-model-loading/">Tutorial 7 : Model loading</a></li>
	<li class="page_item page-item-198"><a href="http://www.opengl-tutorial.org/beginners-tutorials/tutorial-8-basic-shading/">Tutorial 8 : Basic shading</a></li>
</ul>
</li>
<li class="page_item page-item-200"><a href="http://www.opengl-tutorial.org/download/">Download</a></li>
<li class="page_item page-item-140"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/">Intermediate Tutorials</a>
<ul class='children'>
	<li class="page_item page-item-281"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-10-transparency/">Tutorial 10 : Transparency</a></li>
	<li class="page_item page-item-291"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-11-2d-text/">Tutorial 11 : 2D text</a></li>
	<li class="page_item page-item-323"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-12-opengl-extensions/">Tutorial 12 : OpenGL Extensions</a></li>
	<li class="page_item page-item-301"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-13-normal-mapping/">Tutorial 13 : Normal Mapping</a></li>
	<li class="page_item page-item-311"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-14-render-to-texture/">Tutorial 14 : Render To Texture</a></li>
	<li class="page_item page-item-344"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-15-lightmaps/">Tutorial 15 : Lightmaps</a></li>
	<li class="page_item page-item-381"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-16-shadow-mapping/">Tutorial 16 : Shadow mapping</a></li>
	<li class="page_item page-item-252"><a href="http://www.opengl-tutorial.org/intermediate-tutorials/tutorial-9-vbo-indexing/">Tutorial 9 : VBO Indexing</a></li>
</ul>
</li>
<li class="page_item page-item-167 current_page_ancestor current_page_parent"><a href="http://www.opengl-tutorial.org/miscellaneous/">Miscellaneous</a>
<ul class='children'>
	<li class="page_item page-item-436"><a href="http://www.opengl-tutorial.org/miscellaneous/an-fps-counter/">An FPS counter</a></li>
	<li class="page_item page-item-587 current_page_item"><a href="http://www.opengl-tutorial.org/miscellaneous/building-your-own-c-application/">Building your own C application</a></li>
	<li class="page_item page-item-526"><a href="http://www.opengl-tutorial.org/miscellaneous/faq/">FAQ</a></li>
	<li class="page_item page-item-209"><a href="http://www.opengl-tutorial.org/miscellaneous/math-cheatsheet/">Math Cheatsheet</a></li>
	<li class="page_item page-item-210"><a href="http://www.opengl-tutorial.org/miscellaneous/useful-tools-links/">Useful Tools &amp; Links</a></li>
</ul>
</li>
		</ul>
		</li>			</ul>
		</div><!-- #secondary .widget-area -->
</div>
	</div><!-- #main -->
</div></div>
	<div id="footer" role="contentinfo">
		<div id="colophon">


<div id="siteinfo">
                        <div id="contact">Remark ? Question ? Bug report ? Feel free to contact us at <a href='mailto:contact@opengl-tutorial.org'>contact@opengl-tutorial.org</a>. But don't forget to read the <a href="http://www.opengl-tutorial.org/miscellaneous/faq/">FAQ</a> !</div>
			<div id="site-generator">
								<a href="http://codepuzzle.net/?page_id=109" title="Semantic Personal Publishing Platform" rel="generator">Celine Theme Proudly powered by WordPress.</a>
			</div><!-- #site-generator -->
</div>
		</div><!-- #colophon -->
	</div><!-- #footer -->

<!-- #wrapper -->

<p class="lmf_generated_text">Site last updated December 31, 2012; Page last updated December 30, 2012</p><script type='text/javascript'>
  SyntaxHighlighter.autoloader(
      'applescript            http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushAppleScript.js',
      'actionscript3 as3      http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushAS3.js',
      'bash shell             http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushBash.js',
      'coldfusion cf          http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushColdFusion.js',
      'cpp c                  http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushCpp.js',
      'c# c-sharp csharp      http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushCSharp.js',
      'css                    http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushCss.js',
      'delphi pascal          http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushDelphi.js',
      'diff patch pas         http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushDiff.js',
      'erl erlang             http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushErlang.js',
      'groovy                 http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushGroovy.js',
      'java                   http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushJava.js',
      'jfx javafx             http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushJavaFX.js',
      'js jscript javascript  http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushJScript.js',
      'objc obj-c             http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushObjectiveC.js',
      'perl pl                http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushPerl.js',
      'php                    http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushPhp.js',
      'text plain             http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushPlain.js',
      'py python              http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushPython.js',
      'ruby rails ror rb      http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushRuby.js',
      'sass scss              http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushSass.js',
      'scala                  http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushScala.js',
      'sql                    http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushSql.js',
      'vb vbnet               http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushVb.js',
      'xml xhtml xslt html    http://www.opengl-tutorial.org/wp-content/plugins/syntax-highlighter-mt/scripts/shBrushXml.js'
       );
	SyntaxHighlighter.all();
</script>
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-includes/js/jquery/ui/jquery.ui.core.min.js?ver=1.8.20'></script>
<script type='text/javascript'>
/* <![CDATA[ */
var thickboxL10n = {"next":"Next >","prev":"< Prev","image":"Image","of":"of","close":"Close","noiframes":"This feature requires inline frames. You have iframes disabled or your browser does not support them.","loadingAnimation":"http:\/\/www.opengl-tutorial.org\/wp-includes\/js\/thickbox\/loadingAnimation.gif","closeImage":"http:\/\/www.opengl-tutorial.org\/wp-includes\/js\/thickbox\/tb-close.png"};
/* ]]> */
</script>
<script type='text/javascript' src='http://www.opengl-tutorial.org/wp-includes/js/thickbox/thickbox.js?ver=3.1-20111117'></script>
<p id="wpml_credit_footer"><a href="http://wpml.org/">Multilingual WordPress</a> by <a href="http://www.icanlocalize.com/site/">ICanLocalize</a></p></body>
</html>
