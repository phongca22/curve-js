// paper.install(window);
var line;
var shapes = [];
var selectedShape = null;
var cacheShapes = [];
var linkedShape = [];
var temp = [];
var linkedTemp = [];

var clones = [];

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
        var layer = project.layers[0];
        var children = layer.children;
        console.log("child: " + children.length);
        console.log("linked: " + linkedShape.length);
    };

    view.onMouseDown = function(ev) {
        if (line) line.remove();
        line = new Path();
        line.strokeColor = '#00000';
        line.add(ev.point);
    };

    view.onMouseDrag = function(ev) {
        if (!line) return;
        line.add(ev.point);
        detectShape(ev);
        var layer = project.layers[0];
        var children = layer.children;
        console.log("child: " + children.length);
    };

    view.onMouseUp = function() {
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
                temp.push(area);
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
        t.strokColor = "white";
        t.fillColor = "white";
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
            temp.push(area);
        }
    }

    return area;
}

function createCircle(x, y, r) {
    var t = new Path.Circle({
        center: new Point(x, y),
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
        clearShape(intersectData.remain);
        clearShape(intersectData.shapes);
        clearShape(temp);
        console.log("outside")
        return;
    }

    if (selectedShape && intersectData.id === selectedShape._sandentId) {
        clearShape(intersectData.area);
        clearShape(intersectData.remain);
        clearShape(intersectData.shapes);
        clearShape(temp);
        console.log("inside shape")
        return;
    }

    var uniteData = getUniteData(intersectData.remain);

    if (!uniteData) {
        clearShape(intersectData.area);
        clearShape(intersectData.remain);
        clearShape(intersectData.shapes);
        return;
    }

    var shape = intersectData.area.subtract(uniteData);
    if (selectedShape) {
        if (line) {
            addLinkedShape(selectedShape, ev.point);
        } else {
            selectedShape.remove();
        }
    }

    selectedShape = shape;
    selectedShape.fillColor = "#ababab";
    selectedShape.strokeColor = "red";
    selectedShape._sandentId = intersectData.id;

    clearShape(uniteData);
    clearShape(intersectData.area);
    clearShape(intersectData.remain);
    clearShape(intersectData.shapes);
    clearShape(temp);

    if (line) {
        addLinkedShape(selectedShape, ev.point);
    }
}

function createLinkedShape() {
    if (linkedShape.length <= 1) return;

    var t1 = uniteLinkedShape();
    var t2 = uniteLinkedShape();
    var t = t1.unite(t2);
    t.fillColor = "white";
    t.strokeColor = "black";
    t.bringToFront();

    clearShape(linkedTemp);
    linkedShape = [t];
}

function uniteLinkedShape() {
    var t = null;
    for (var i = 0; i < linkedShape.length; i++) {
        if (!t) {
            t = linkedShape[i];
        } else {
            t = t.unite(linkedShape[i]);
            linkedTemp.push(t);
        }
    }

    return t;
}

function clearShape(list) {
    if (list.constructor !== Array) {
        list.remove();
        return;
    }

    for (var i = 0; i < list.length; i++) {
        list[i].remove();
    }

    list = [];
}

function addLinkedShape(shape, point) {
    for (var i = 0; i < linkedShape.length; i++) {
        if (linkedShape[i].contains(point)) {
            return;
        }
    }

    linkedShape.push(shape);
}
