// paper.install(window);
var line;
var shapes = [];
var selectedShape = null;
var cacheShapes = [];
var linkedShape = [];
paper.install(window);
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    createCircle(300, 200, 100);
    createCircle(400, 300, 100);
    createCircle(500, 400, 100);
    createCircle(400, 200, 100);
    // createCircle(122, 85, 50);

    // var a = shapes[0].intersect(shapes[2]);
    // var b = shapes[0].subtract(shapes[1].unite(shapes[2]));
    // var c = a.unite(b);
    // c.fillColor = "red";
    // c.translate(new Point(250, 250));

    view.onMouseMove = function(ev) {
        detectShape(ev);
    };

    view.onMouseDown = function(ev) {
        if (line) line.remove();
        line = new Path();
        line.strokeColor = '#00000';
        line.add(ev.point);
    };

    view.onMouseDrag = function(ev) {
        line.add(ev.point);
        detectShape(ev);
    };

    view.onMouseUp = function() {
        // var t = p1.unite(p2);
        // t.fillColor = "white"
        // t.bringToFront();
        if (line) {
            line.remove();
            line = null;
        }

        createLinkedShape();
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
            area.removeOnMove();
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

function detectShape(ev) {
    var intersectData = getIntersectData(ev.point);
    if (!intersectData.area) {
        if (selectedShape) {
            selectedShape.remove();
        }

        selectedShape = null;
        return;
    }

    if (selectedShape && intersectData.id === selectedShape._sandentId) {
        addLinkedShape();
        return;
    }

    if (intersectData.remain.length === 0 && intersectData.area) {
        if (selectedShape) {
            selectedShape.remove();
        }

        selectedShape = intersectData.area;
        selectedShape.fillColor = "#009688";
        return;
    }

    var uniteData = getUniteData(intersectData.remain);
    if (!uniteData) return;

    var shape = intersectData.area.subtract(uniteData);
    if (selectedShape) {
        if (line) {
            linkedShape.push(selectedShape);
            console.log("push");
        } else {
            selectedShape.remove();
        }
    }

    selectedShape = shape;
    selectedShape.fillColor = "#009688";
    selectedShape._sandentId = intersectData.id;
    uniteData.removeOnMove();
}

function createLinkedShape() {
    var t = null;
    for (var i = 0; i < linkedShape.length; i++) {
        var s = linkedShape[i];
        s.fillColor = "white";
        if (!t) {
            t = s;
        } else {
            t = t.unite(s);
        }

        t.fillColor = "green";
        t.translate(new Point(300, 0));
    }

    // clearLinkedShape();
}

function clearLinkedShape() {
    for (var i = 0; i < linkedShape.length; i++) {
        linkedShape[i].remove();
    }
}

function addLinkedShape() {
    // if (!line) return;
    // var list = [];
    // for (var i = 0; i < linkedShape.length; i++) {
    //     if (linkedShape[i]._sandentId == selectedShape._sandentId) continue;
    //     list.push(selectedShape);
    // }
    //
    // linkedShape = list;
}
