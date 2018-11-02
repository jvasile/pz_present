// The svgPanZoom object instance.
var svgpz;
var currentView = 0;

window.addEventListener(
  'load',
  function() {
    svgpz = svgPanZoom('#mindmap', {
      zoomEnabled: true,
      controlIconsEnabled: false,
    });
  },
  false
);

function getZoomAndPan() {
  // The raw pan values are absolute, so we make them relative
  // to the width and height of the SVG.  That way they still
  // work when the window/screen is a different size.
  var current = svgpz.getPan();
  var { width, height } = svgpz.getSizes();
  var relativeX = current.x / width;
  var relativeY = current.y / height;

  var zoomLevel = svgpz.getZoom();
  return [zoomLevel, relativeX, relativeY];
}

function getAbsoluteCoordinates(x, y) {
  // Takes relative x and y values representing a position
  // in an abstract 1.0 x 1.0 SVG, and returns the absolute
  // values for the SVG at its current size.
  var { width, height } = svgpz.getSizes();
  return {
    x: x * width,
    y: y * height,
  };
}

function getPanBy(target) {
  // Takes target x/y coordinates and returns the amount
  // of relative x/y panning to go from current to target
  // position.
  var current = svgpz.getPan();
  var panBy = {
    x: target.x - current.x,
    y: target.y - current.y,
  };
  return panBy;
}

function getZoomBy(targetZoomLevel) {
  // Calculate the relative zoom factor to go from current
  // to target zoom level.
  var currentZoomLevel = svgpz.getZoom();
  var zoomFactor = targetZoomLevel / currentZoomLevel;
  return zoomFactor;
}

function zoomAndPan([zoomLevel, x, y]) {
  svgpz.zoomBy(getZoomBy(zoomLevel));
  svgpz.panBy(getPanBy(x, y));
}

function getViewIndexByKeyName(keyName, views) {
  return views.findIndex(function(view) {
    return view[3] === keyName;
  });
}

function keyListener(event) {
  var keyName = event.key;
  var keyNameNum = Number(keyName);
  var previousView = currentView;

  if (keyName === '.') {
    console.log(getZoomAndPan().join(', '));
  } else if (keyNameNum >= 0 && keyNameNum <= 9 && views[keyNameNum]) {
    currentView = keyNameNum;
  } else if (keyName === 'ArrowRight' && currentView < views.length - 1) {
    currentView += 1;
  } else if (keyName === 'ArrowLeft' && currentView > 0) {
    currentView -= 1;
  } else {
    var index = getViewIndexByKeyName(keyName, views);
    if (index !== -1) {
      currentView = index;
    }
  }

  if (currentView !== previousView) {
    if (currentView === 0) {
      svgpz.reset();
    } else {
      zoomAndPan(views[currentView]);
    }
  }
}

document.addEventListener('keydown', keyListener, false);
