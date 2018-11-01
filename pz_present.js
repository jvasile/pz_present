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
  // The raw zoom and pan values are absolute, so we make them
  // relative to the width and height of the SVG.  That way they
  // still work when the window/screen is a different size.
  var zoom = svgpz.getZoom();
  var pan = svgpz.getPan();
  var { width, height } = svgpz.getSizes();
  var relPanX = pan.x / width;
  var relPanY = pan.y / height;
  return [zoom, relPanX, relPanY];
}

function getPanBy(x, y) {
  // De-relativize target pan values.
  var { width, height } = svgpz.getSizes();
  var targetX = x * width;
  var targetY = y * height;

  // Calculate the relative pan position change to go
  // from current to target pan position.
  var current = svgpz.getPan();
  var panBy = {
    x: targetX - current.x,
    y: targetY - current.y,
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
