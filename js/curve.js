var currentPath;
var allPaths = [];
var path;
var pathHelper;
var pathHelper2;
var firstPointHelper;
var isFirstPoint = false;
var isSecondPoint = false;
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

// paper.install(window);
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    paper.view.onMouseDown = function(ev) {
        var ex = ev.point.x;
        var ey = ev.point.y;
        if (!isFirstPoint) {
            isFirstPoint = true;
            pointA.x = ex;
            pointA.y = ey;
            firstPointHelper = new paper.Path.Circle({
                center: new paper.Point(ex, ey),
                radius: 3,
                fillColor: "green"
            });

            firstPointHelper.onClick = function(){
                currentPath.closed = true;
                isFirstPoint = false;
                isSecondPoint = false;
                allPaths.push(currentPath);
                currentPath = null;
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
                var b = new paper.Point(ex, ey);
                var a = new paper.Point(pointA.x, pointA.y);
                var vector = b.subtract(a);
                pointB.vector.length = 0;
                pointB.vector.distance = 0;
                drawLine();
            }
        }
    }

    paper.view.onMouseDrag = function(ev) {
        if (!isFirstPoint || !isSecondPoint) return;
        var a = new paper.Point(ev.point.x, ev.point.y);
        var b = new paper.Point(pointB.x, pointB.y);
        var v = b.subtract(a);
        pointB.vector.length = v.length;
        pointB.vector.angle = v.angle;
        if (pathHelper) pathHelper.remove();
        pathHelper = new paper.Path(b, a);
        pathHelper.strokeColor = "red";

        var t = new paper.Point(2 * b.x - a.x, 2 * b.y - a.y);
        if (pathHelper2) pathHelper2.remove();
        pathHelper2 = new paper.Path(b, t);
        pathHelper2.strokeColor = "green";
        drawLine();
    };

    paper.view.onMouseUp = function(ev) {
        if (!isSecondPoint)  return;
        if (pathHelper) pathHelper.remove();
        if (pathHelper2) pathHelper2.remove();

        if (!currentPath) {
            currentPath = createPath();
        } else {
            currentPath.addSegments([[[pointB.x, pointB.y], new paper.Point({
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
    return new paper.Path({
        segments: [
            [[pointA.x, pointA.y], new paper.Point({
                angle: 0,
                length: pointA.vector.length
            })],
            [[pointB.x, pointB.y], new paper.Point({
                angle: pointB.vector.angle,
                length: pointB.vector.length
            })]
        ],
        fullySelected: false,
        strokeColor: "black"
    });
}
