// paper.install(window);
var line;
var shapes = [];
var selectedShape = null;
var cacheShapes = [];
var linkedShape = [];
var test = false;
var ids = [];
var temp = [];

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
        if (!line) return;
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
            test = true;
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
    ids.push(t.id);
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
        console.log("outside")
        return;
    }

    if (selectedShape && intersectData.id === selectedShape._sandentId) {
        // addLinkedShape();
        clearShape(intersectData.area);
        clearShape(intersectData.remain);
        clearShape(intersectData.shapes);
        console.log("inside shape")
        return;
    }

    if (intersectData.remain.length === 0 && intersectData.area) {
        if (selectedShape) {
            selectedShape.remove();
        }

        selectedShape = intersectData.area;
        selectedShape.fillColor = "#009688";

        clearShape(intersectData.area);
        clearShape(intersectData.remain);
        clearShape(intersectData.shapes);
        console.log("all intersect")
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
            linkedShape.push(selectedShape);
        } else {
            selectedShape.remove();
        }
    }

    selectedShape = shape;
    selectedShape.fillColor = "#009688";
    selectedShape._sandentId = intersectData.id;

    clearShape(uniteData);
    clearShape(intersectData.area);
    clearShape(intersectData.remain);
    clearShape(intersectData.shapes);
    clearShape(temp);

    if (line) {
        linkedShape.push(selectedShape);
    }
}

function createLinkedShape() {
    var a = linkedShape[0];
    a.translate(200, 100);
    var b = linkedShape[1];
    b.translate(200, 100);

    var c = a.unite(b);
    c.fillColor = getRandomColor();
    c.translate(new Point(100, 100));

    return;

    var t = linkedShape[0];
    for (var i = 1; i < linkedShape.length; i++) {
        t = t.unite(linkedShape[i]);
    }

    t.fillColor = "white";
    t.selected = true;
    console.log("link shape", t);

    // clearLinkedShape();
}

function clearShape(list) {
    if (list.constructor != Array) {
        list.remove();
        return;
    }

    for (var i = 0; i < list.length; i++) {
        list[i].remove();
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
