# PZ Present

Easy peasy presentations that pan and zoom.

This Makefile builds two different webpages.  The basic presentation
html is the one with the better UI but it requires a web server. The
"no-server" html has a clunkier UI but is just a webpage and
javascript.

To use the presentation html, run 'make serve' to start the server,
then point your browser at http://localhost:3050/scale2018.html.  On
first use, you should run 'make deps' to install some libs. Also,
'make debian' will make sure you have dia installed, which is needed
to convert the .dia file to an .svg.  Disregard that if you have the
svg already.

If you cloned this dir, you'll have to change the title tag in the
html files.
