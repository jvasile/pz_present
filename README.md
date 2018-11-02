# PZ Present

Easy peasy presentations that pan and zoom.

## Setup

Run 'make deps' to install some libs. Optionally, run 'make debian'
which will make sure you have Dia installed, which is needed to
convert the .dia file to an .svg.  Disregard that if you have the
svg already.

Run 'make'. The Makefile builds two different webpages.  The basic
presentation html is the one with the better UI but it requires a
web server. The "no-server" html has a clunkier UI but is just a
webpage and javascript.

If you cloned this dir, you'll have to change the title tag in the
html files.

## Usage

To use the presentation html, run 'make serve' to start the server,
then point your browser at http://localhost:3050 .  For the
"no-server" version, just open the html file in your browser.
