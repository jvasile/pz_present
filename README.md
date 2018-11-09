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

To set up preset "views", pan and zoom to a "view" you want to
save as a preset.  Press the period ('.') key. (You may need to
click on the page first so it will register the key press.)  A
dialog will ask for an optional name for the view (to easily
identify it when editing views) and an optional shortcut key for
moving to that view.

Add additional views in the same way, in the order you want.

Use the left and right arrow keyboard keys to navigate through
the views in order, or hit a number key to jump to a view by
number.  Zero is the initial page view, and one is the first
saved preset view. If you assigned letter keys to views you can
also use those.

To edit views, press the comma (',') key to show the "Edit Preset
Views" interface.  You can change the order of views, delete them,
name or rename them, and add or change their shortcut keys. Hit
the comma key again to close the "Edit Preset Views" interface.

