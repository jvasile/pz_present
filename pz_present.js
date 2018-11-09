// The svgPanZoom object instance.
var svgpz;

// views is an array of arrays representing preset views.
// each array is: [zoomLevel, x, y, keyName]
// keyName is an optional shortcut key.
var views;

// Index of the last activated view in views.
var currentView = 0;

// Array of names of the keyboard keys that do something.
var liveKeys;

var animationIntervalId;

function loadJson(callback) {
  var request = new XMLHttpRequest();
  request.overrideMimeType('application/json');
  request.open('GET', 'views.json', true);

  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      // Required use of a callback as .open will NOT return a
      // value but simply returns undefined in asynchronous mode.
      callback(request.responseText);
    }
  };
  request.send();
}

window.addEventListener(
  'load',
  function() {
    svgpz = svgPanZoom('#mindmap', {
      zoomEnabled: true,
      controlIconsEnabled: false,
    });

    document
      .getElementById('edit-views-done')
      .addEventListener('click', function() {
        document.getElementById('edit-views').classList.add('hidden');
        document.getElementById('mindmap').classList.remove('hidden');
      });

    loadJson(function(response) {
      views = JSON.parse(response);

      // Set view 0 to initial page rendering.
      views[0] = getZoomAndPan();

      liveKeys = ['.', ',', 'ArrowRight', 'ArrowLeft'];
      views.forEach(function(view, index) {
        liveKeys.push(index.toString());
        if (view.shortcutKey) {
          liveKeys.push(view.shortcutKey);
        }
      });
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
  return { zoomLevel: zoomLevel, x: relativeX, y: relativeY };
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

function zoomAndPan({ zoomLevel: targetZoomLevel, x, y }) {
  // times are in milliseconds
  var animationTime = 450;
  var animationStepTime = 15;
  var remainingSteps = animationTime / animationStepTime;
  var panTarget = getAbsoluteCoordinates(x, y);

  clearInterval(animationIntervalId);

  animationIntervalId = setInterval(function() {
    if (remainingSteps > 0) {
      // Zoom come before pan, because the current zoomLevel affects
      // required pan values. Thus we fully arrive at target position.

      var currentZoomLevel = svgpz.getZoom();
      var stepZoom = (targetZoomLevel - currentZoomLevel) / remainingSteps;
      svgpz.zoom(stepZoom + currentZoomLevel);

      var panBy = getPanBy(panTarget);
      var stepX = panBy.x / remainingSteps;
      var stepY = panBy.y / remainingSteps;
      svgpz.panBy({ x: stepX, y: stepY });

      remainingSteps -= 1;
    } else {
      clearInterval(animationIntervalId);
    }
  }, animationStepTime);
}

function getViewIndexByKeyName(keyName, views) {
  return views.findIndex(function(view) {
    return view.shortcutKey === keyName;
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

function saveViews(views) {
  request = new XMLHttpRequest();
  request.open('POST', 'save-views');
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(JSON.stringify(views));
}

function removeChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function renderViewsTableRows() {
  var tbody = document.getElementById('edit-views-tbody');
  removeChildNodes(tbody);
  views.forEach((view, index) => {
    var row = document.createElement('tr');
    var numberTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var shortcutTd = document.createElement('td');
    var actionsTd = document.createElement('td');

    numberTd.textContent = String(index);
    nameTd.textContent = view.name || '';
    shortcutTd.textContent = view.shortcutKey || '';

    row.appendChild(numberTd);
    row.appendChild(nameTd);
    row.appendChild(shortcutTd);
    row.appendChild(actionsTd);
    tbody.appendChild(row);
  });
}

function addNewView(views) {
  var view = getZoomAndPan();
  var name = prompt(
    'Adding a new preset view, optionally enter a name for this view, or leave it blank (unnamed).',
    ''
  );
  if (name === null) return;
  var shortcut = prompt(
    'Adding a new preset view, optionally enter a keyboard shortcut.',
    ''
  );
  if (shortcut === null) return;

  if (name) {
    view.name = name;
  }
  if (shortcut) {
    view.shortcutKey = shortcut;
    liveKeys.push(shortcut);
  }
  views.push(view);
  liveKeys.push(String(views.length - 1));
  saveViews(views);
}

function toggleEditViews() {
  var mindmap = document.getElementById('mindmap');
  var editViews = document.getElementById('edit-views');
  if (mindmap.classList.contains('hidden')) {
    editViews.classList.add('hidden');
    mindmap.classList.remove('hidden');
  } else {
    renderViewsTableRows();
    mindmap.classList.add('hidden');
    editViews.classList.remove('hidden');
  }
}

function keyListener(event) {
  var keyName = event.key;

  if (liveKeys.includes(keyName)) {
    if (keyName === '.') {
      addNewView(views);
    } else if (keyName === ',') {
      toggleEditViews();
    } else {
      currentView = getNextView(currentView, views, keyName);
      zoomAndPan(views[currentView]);
    }
  }
}

document.addEventListener('keydown', keyListener, false);
