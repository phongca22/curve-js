// paper.install(window);
var line;
var circles = [];
window.onload = function() {
    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    createCircle(80, 50, 50);
    createCircle(120, 60, 50);
    createCircle(110, 100, 50);
    // createCircle(120, 80, 50);
    // createCircle(122, 85, 50);

    dectectAll();

    paper.view.onMouseMove = function(ev) {
        // t2.fillColor = t2.contains(ev.point) ? "grey" : "white";
        // t3.fillColor = t3.contains(ev.point) ? "grey" : "white";
        // t6.fillColor = t6.contains(ev.point) ? "grey" : "white";
    };

    paper.view.onMouseDown = function(ev) {
        // if (line) line.remove();
        // line = new paper.Path();
        // line.strokeColor = '#00000';
        // line.add(ev.point);
    };

    paper.view.onMouseDrag = function(ev) {
        // line.add(ev.point);
        // setSelectedPath(t2, ev);
        // setSelectedPath(t3, ev);
        // setSelectedPath(t6, ev);
    };

    paper.view.onMouseUp = function() {
        // var t = p1.unite(p2);
        // t.fillColor = "white"
        // t.bringToFront();
        if (line) line.remove();
    };
}

function setSelectedPath(p, ev) {
    if (p.contains(ev.point)) {
        p.fillColor = "grey";
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createCircle(x, y, r) {
    var t = new paper.Path.Circle({
        center: new paper.Point(x, y),
        radius: r,
        strokeColor: "black"
    });

    circles.push(t);
}

function dectectAll() {
    detect01();
    detect02();
    detect03();
}


//get intersect of all
function detect01() {
    var t = null;
    for (var i = 0; i < circles.length; i++) {
        if (!t) {
            t = circles[0];
            continue;
        }

        t = t.intersect(circles[i]);
    }

    t.fillColor = "white";
    addHoverEvent(t);
}

//every shape subtract with all unite remaining
function detect02() {
    for (var i = 0; i < circles.length; i++) {
        var t = circles[i];
        var list = circles.slice(0);;
        list.splice(i, 1);
        var u = null;
        for (var k = 0; k < list.length; k++) {
            if (!u) {
                u = list[k];
                continue;
            }

            u = u.unite(list[k]);
        }

        // u.fillColor = getRandomColor();
        t = t.subtract(u);
        t.fillColor = "white";
        addHoverEvent(t);
    }
}

function detect03() {
    // var x = circles[0].intersect(circles[1]).subtract(circles[2].unite(circles[3]));
    // x.fillColor = "white";
    // addHoverEvent(x)
    // return;
    for (var i = 0; i < circles.length; i++) {
        var next = i + 1 >= circles.length ? 0 : i + 1;
        var remain = next + 1 >= circles.length  ? 0 : next + 1;
        var x = circles[i].intersect(circles[next]).subtract(circles[remain]);
        x.fillColor = "white";
        addHoverEvent(x);
    }
}

function addHoverEvent(a) {
    a.onMouseEnter = function(ev){
        a.fillColor = getRandomColor();
        console.log(ev)
    };

    a.onMouseLeave = function(){
        a.fillColor = "white";
    };
}
