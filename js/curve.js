var currentPath;
var allPaths = [];
var path;
var pathHelper;
var pathHelper2;
var firstPointHelper;
var isFirstPoint = false;
var isSecondPoint = false;
var smoothLine;
var createdPath = false;
var pointA = {
    x: 0,
    y: 0,
    vector: {
        angle: 0,
        alpha: 0
    }
};

var pointB = {
    x: 0,
    y: 0,
    vector: {
        angle: 0,
        alpha: 0
    }
};

var helper = {
    x: 0,
    y: 0,
    angle: 0,
    length: 0
};

paper.install(window);
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    paper.view.onMouseDown = function(ev) {
        var ex = ev.point.x;
        var ey = ev.point.y;
        if (createdPath) {
            if (!smoothLine) {
                smoothLine = new Path();
                smoothLine.strokeColor = "black";
                smoothLine.add(ev.point);
            }

            return;
        }

        if (!isFirstPoint) {
            isFirstPoint = true;
            pointA.x = ex;
            pointA.y = ey;
            firstPointHelper = new Path.Circle({
                center: new Point(ex, ey),
                radius: 3,
                fillColor: "green"
            });

            firstPointHelper.onClick = function(){
                currentPath.closed = true;
                isFirstPoint = false;
                isSecondPoint = false;
                createdPath = true;
            };
        } else {
            if (!isSecondPoint) {
                if (currentPath) {
                    pointA = JSON.parse(JSON.stringify(pointB));
                    pointA.vector.angle = 0;
                    pointB.vector.length = 0;
                }

                isSecondPoint = true;
                pointB.x = ex;
                pointB.y = ey;
                var b = new Point(ex, ey);
                var a = new Point(pointA.x, pointA.y);
                var vector = b.subtract(a);
                pointB.vector.length = 0;
                pointB.vector.distance = 0;
                drawLine();
            }
        }
    }

    paper.view.onMouseDrag = function(ev) {
        if (createdPath) {
            smoothLine.add(ev.point);
            return;
        }

        if (!isFirstPoint || !isSecondPoint) return;
        var a = new Point(ev.point.x, ev.point.y);
        var b = new Point(pointB.x, pointB.y);
        var v = b.subtract(a);
        pointB.vector.length = v.length;
        pointB.vector.angle = v.angle;
        if (pathHelper) pathHelper.remove();
        pathHelper = new Path(b, a);
        pathHelper.strokeColor = "red";

        var t = new Point(2 * b.x - a.x, 2 * b.y - a.y);
        if (pathHelper2) pathHelper2.remove();
        pathHelper2 = new Path(b, t);
        pathHelper2.strokeColor = "green";
        drawLine();
    };

    paper.view.onMouseUp = function(ev) {
        if (createdPath) {
            smoothPath();
            smoothLine.remove();
            smoothLine = null;
            return;
        }

        if (!isSecondPoint)  return;
        if (pathHelper) pathHelper.remove();
        if (pathHelper2) pathHelper2.remove();

        if (!currentPath) {
            currentPath = createPath();
        } else {
            currentPath.addSegments([[[pointB.x, pointB.y], new Point({
                angle: pointB.vector.angle,
                length: pointB.vector.length
            })]]);
        }

        isSecondPoint = false;
    };
}

function drawLine() {
    if (path) path.remove();
    path = createPath();
    // paper.view.draw();
}

function createPath() {
    return new Path({
        segments: [
            [[pointA.x, pointA.y], new Point({
                angle: 0,
                length: pointA.vector.length
            })],
            [[pointB.x, pointB.y], new Point({
                angle: pointB.vector.angle,
                length: pointB.vector.length
            })]
        ],
        fullySelected: false,
        strokeColor: "black"
    });
}

function download() {
    var a = paper.project.exportSVG();
}

function smoothPath() {
    var points = currentPath.getIntersections(smoothLine);
    var segmentIndex = getSegmentIndexByPoint(points);
    if (segmentIndex.length < 2) return;
    currentPath.smooth({
        type: "continuous",
        from: segmentIndex[0],
        to: segmentIndex[segmentIndex.length - 1] + 1
    });
}

function getSegmentIndexByPoint(points) {
    var list = currentPath.segments;
    var segmentIndex = [];
    for (var i = 0; i < list.length; i++) {
        var x = list[i];
        var y = list[i + 1];
        if (y) {
            var z = new Path({
                segments: [x, y],
            });

            if (isContains(z, points)) {
                if (segmentIndex.indexOf(i) == -1) {
                    segmentIndex.push(i);
                }
            }

            z.remove();
        }
    }

    return segmentIndex;
}

function isContains(p, points) {
    for (var i = 0; i < points.length; i++) {
        if (p.contains(points[i].point)) {
            return true;
        }
    }

    return false;
}
