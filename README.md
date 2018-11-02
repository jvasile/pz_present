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

To set up preset "views", open the console inside your browser's
developer tools.  Then manually pan and zoom to a "view" you want
to save as a preset.  Press the period ('.') key and an array of
three numbers will be logged to the console, like so:

`[1.5287898741806416, -0.3384300293883705, -0.1704605958743659],`

(You may need to click on the page first so it will register the
key press.)

Open the "views.js" file in an editor and cut and paste the array
of three numbers from the console into the next line in the
"views" array.

The "views.js" file comes with some example preset views, that
you'll want to delete.

Add additional views in the same way, in the order you want them
to appear. Optionally, you can assign a letter short-cut key for
a given view, by adding a letter string at the end of the array,
like so:

`[1.5287898741806416, -0.3384300293883705, -0.1704605958743659, 'm'],`

(This process is temporary, until we have a good UI for this.)

Save the "views.js" file and refresh the page.  Use the left and
right arrow keyboard keys to navigate through the views in order,
or hit a number key to jump to a view by number.  Zero is the
initial page view, and one is the first saved preset view. If you
assigned letter keys to views you can also use those.
