var path;
var pathHelper;
var pathHelper2;
var isFirstPoint = false;
var isSecondPoint = false;
var pointA = {
    x: 0,
    y: 0,
    vector: {
        angle: 0,
    }
};

var pointB = {
    x: 0,
    y: 0,
    vector: {
        angle: -180,
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
        if (!isFirstPoint) {
            isFirstPoint = true;
            pointA.x = ev.point.x;
            pointA.y = ev.point.y;
        } else {
            if (!isSecondPoint) {
                isSecondPoint = true;
                pointB.x = ev.point.x;
                pointB.y = ev.point.y;
                var b = new paper.Point(ev.point.x, ev.point.y);
                var a = new paper.Point(pointA.x, pointA.y);
                var vector = b.subtract(a);
                pointB.vector.length = 0;
                pointB.vector.distance = vector.length / 2;
                createPath();
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
        createPath();
    };
}

function createPath() {
    if (path) path.remove();
    path = new paper.Path({
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

    paper.view.draw();
}
