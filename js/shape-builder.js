// paper.install(window);
var line;
var shapes = [];
var selectedShape = null;
var cacheShapes = [];
paper.install(window);
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    createCircle(80, 50, 50);
    createCircle(120, 60, 50);
    createCircle(110, 100, 50);
    createCircle(120, 80, 50);
    // createCircle(122, 85, 50);

    view.onMouseMove = function(ev) {
        var intersectData = getIntersectData(ev.point);
        if (!intersectData.area) {
            if (selectedShape) {
                selectedShape.remove();
            }

            selectedShape = null;
            console.log("empty")
            return;
        }

        if (selectedShape && intersectData.id === selectedShape._sandentId) {
            console.log("skip")
            return;
        }

        if (intersectData.remain.length === 0 && intersectData.area) {
            if (selectedShape) {
                selectedShape.remove();
                console.log("remove shape");
            }

            selectedShape = intersectData.area;
            selectedShape.fillColor = "#009688";
            return;
        }

        var uniteData = getUniteData(intersectData.remain);
        if (!uniteData) return;

        var shape = intersectData.area.subtract(uniteData);
        if (selectedShape) {
            selectedShape.remove();
            console.log("remove shape");
        }

        selectedShape = shape;
        selectedShape.fillColor = "#009688";
        console.log("select new shape")
        selectedShape._sandentId = intersectData.id;
        uniteData.removeOnMove();
    };

    view.onMouseDown = function(ev) {
        // if (line) line.remove();
        // line = new paper.Path();
        // line.strokeColor = '#00000';
        // line.add(ev.point);
    };

    view.onMouseDrag = function(ev) {
        // line.add(ev.point);
        // setSelectedPath(t2, ev);
        // setSelectedPath(t3, ev);
        // setSelectedPath(t6, ev);
    };

    view.onMouseUp = function() {
        // var t = p1.unite(p2);
        // t.fillColor = "white"
        // t.bringToFront();
        if (line) line.remove();
    };
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getIntersectData(point) {
    var area = null;
    var remain = [];
    var id = [];
    var list = cloneShapes();
    for (var i = 0; i < list.length; i++) {
        var shape = list[i];
        if (shape.contains(point)) {
            if (!area) {
                area = shape;
            } else {
                area = area.intersect(shape);
                area.removeOnMove();
            }

            id.push(i);
        } else {
            remain.push(shape);
        }
    }

    return {
        area: area,
        remain: remain,
        id: id.join("_"),
        shapes: list
    };
}

function cloneShapes() {
    var list = [];
    for (var i = 0; i < shapes.length; i++) {
        var t = shapes[i].clone();
        t.removeOnMove();
        list.push(t);
    }

    return list;
}

function getUniteData(remain) {
    var area = null;
    for (var i = 0; i < remain.length; i++) {
        if (!area) {
            area = remain[i];
        } else {
            area = area.unite(remain[i]);
            area.removeOnMove();
        }

    }

    return area;
}

function createCircle(x, y, r) {
    var t = new paper.Path.Circle({
        center: new paper.Point(x, y),
        radius: r,
        strokeColor: "black"
    });

    shapes.push(t);
}
