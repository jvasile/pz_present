// The svgPanZoom object instance.
var svgpz;
var currentView = 0;

var liveKeys = (function() {
  var liveKeys = ['.', 'ArrowRight', 'ArrowLeft'];
  views.forEach(function(view, index) {
    liveKeys.push(index.toString());
    if (view[3]) {
      liveKeys.push(view[3]);
    }
  });
  return liveKeys;
})();

window.addEventListener(
  'load',
  function() {
    svgpz = svgPanZoom('#mindmap', {
      zoomEnabled: true,
      controlIconsEnabled: false,
    });

    // Set view 0 to initial page rendering.
    views[0] = getZoomAndPan();
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

function zoomAndPan([targetZoomLevel, x, y]) {
  // times are in milliseconds
  var animationTime = 450;
  var animationStepTime = 15;
  var remainingSteps = animationTime / animationStepTime;
  var panTarget = getAbsoluteCoordinates(x, y);

  var intervalId = setInterval(function() {
    if (remainingSteps > 0) {
      var panBy = getPanBy(panTarget);
      var stepX = panBy.x / remainingSteps;
      var stepY = panBy.y / remainingSteps;

      var currentZoomLevel = svgpz.getZoom();
      var stepZoom = (targetZoomLevel - currentZoomLevel) / remainingSteps;

      svgpz.zoom(stepZoom + currentZoomLevel);
      svgpz.panBy({ x: stepX, y: stepY });

      remainingSteps -= 1;
    } else {
      // Otherwise we don't quite get fully back to initial view.
      if (currentView === 0) {
        svgpz.reset();
      }
      clearInterval(intervalId);
    }
  }, animationStepTime);
}

function getViewIndexByKeyName(keyName, views) {
  return views.findIndex(function(view) {
    return view[3] === keyName;
  });
}

function getNextView(currentView, views, keyName) {
  var keyNameNum = Number(keyName);
  var nextView;

  if (keyNameNum >= 0 && keyNameNum <= 9) {
    nextView = keyNameNum;
  } else if (keyName === 'ArrowRight') {
    nextView = currentView < views.length - 1 ? currentView + 1 : currentView;
  } else if (keyName === 'ArrowLeft') {
    nextView = currentView > 0 ? currentView - 1 : currentView;
  } else {
    var index = getViewIndexByKeyName(keyName, views);
    nextView = index === -1 ? currentView : index;
  }
  return nextView;
}

function keyListener(event) {
  var keyName = event.key;

  if (liveKeys.includes(keyName)) {
    if (keyName === '.') {
      console.log(getZoomAndPan().join(', '));
    } else {
      currentView = getNextView(currentView, views, keyName);
      zoomAndPan(views[currentView]);
    }
  }
}

document.addEventListener('keydown', keyListener, false);
