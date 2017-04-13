$(document).ready(function() {
    DrawCanvas();

    window.requestAnimationFrame(AnimateCanvas);
})


var goodRatio = 0.5;
var initialRatio = 0.1;

var circleStrokeWidth = 2;
var circleRadius = 3;
var lineStrokeWidth = 3;

var spacingX = 50;
var spacingY = 50;
var offsetX = 10;
var offsetY = 10;

function Point(ctx, x, y) {
    this.ctx = ctx;
    this.x = (x * spacingX) - offsetX;
    this.y = (y * spacingY) - offsetY;
    this.i = x;
    this.j = y;

    this.connections = [this];

    this.chosen = false;
}

Point.prototype.isConnected = function(other) {
    return (this.connections.indexOf(other) > -1);
}

Point.prototype.choose = function() {
    this.chosen = true;
}

Point.prototype.isChosen = function() {
    return this.chosen;
}

Point.prototype.draw = function() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, circleRadius, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.lineWidth = circleStrokeWidth;
    this.ctx.stroke();
    this.ctx.closePath();
}

Point.prototype.drawConnection = function(other) {
    var x1 = this.x;
    var y1 = this.y;
    var x2 = other.x;
    var y2 = other.y;

    var change = circleRadius / 2 + circleStrokeWidth / 2;

    if (x1 == x2 && y1 == y2) {
        // Never happens
    } else if (x1 == x2 && y1 < y2) { // Down
        y1 = y1 + change;
        y2 = y2 - change;
    } else if (x1 == x2 && y1 > y2) { // Up
        y1 = y1 - change;
        y2 = y2 + change;
    } else if (x1 < x2 && y1 == y2) { // Right
        x1 = x1 + change;
        x2 = x2 - change;
    } else if (x1 > x2 && y1 == y2) { // Left
        x1 = x1 - change;
        x2 = x2 + change;
    } else if (x1 > x2 && y1 > y2) { // Up-Left
        x1 = x1 - change;
        x2 = x2 + change;
        y1 = y1 - change;
        y2 = y2 + change;
    } else if (x1 < x2 && y1 < y2) { // Down-Right
        x1 = x1 + change;
        x2 = x2 - change;
        y1 = y1 + change;
        y2 = y2 - change;
    } else if (x1 > x2 && y1 < y2) { // Down-Left
        x1 = x1 - change;
        x2 = x2 + change;
        y1 = y1 + change;
        y2 = y2 - change;
    } else if (x1 < x2 && y1 > y2) { // Up-Right
        x1 = x1 + change;
        x2 = x2 - change;
        y1 = y1 - change;
        y2 = y2 + change;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.lineWidth = lineStrokeWidth;
    this.ctx.stroke();
    this.ctx.closePath();
}

Point.prototype.chooseNeighbour = function() {
    var x = this.i;
    var y = this.j;

    var startX, endX;
    var startY, endY;

    if (x > 0 && x < grid.length - 1) {
        startX = x - 1;
        endX = x + 1;
    } else if (x == 0) {
        startX = x;
        endX = x + 1;
    } else if (x == grid.length - 1) {
        startX = x - 1;
        endX = x;
    }

    if (y > 0 && y < grid[0].length - 1) {
        startY = y - 1;
        endY = y + 1;
    } else if (y == 0) {
        startY = y;
        endY = y + 1;
    } else if (y == grid[0].length - 1) {
        startY = y - 1;
        endY = y;
    }

    var points = [];

    for (var i = startX; i <= endX; i++) {
        for (var j = startY; j <= endY; j++) {
            var point = grid[i][j];

            if (point != null && !point.isChosen()) {
                points.push(point);
            }
        }
    }

    if (points.length > 0) {
        var chosenPoint = points[Math.floor(Math.random() * points.length)];
        chosenPoint.choose();
    }
}

Point.prototype.neighbourCount = function() {
    var x = this.i;
    var y = this.j;

    var startX, endX;
    var startY, endY;

    if (x > 0 && x < grid.length - 1) {
        startX = x - 1;
        endX = x + 1;
    } else if (x == 0) {
        startX = x;
        endX = x + 1;
    } else if (x == grid.length - 1) {
        startX = x - 1;
        endX = x;
    }

    if (y > 0 && y < grid[0].length - 1) {
        startY = y - 1;
        endY = y + 1;
    } else if (y == 0) {
        startY = y;
        endY = y + 1;
    } else if (y == grid[0].length - 1) {
        startY = y - 1;
        endY = y;
    }

    var count = 0;

    for (var i = startX; i <= endX; i++) {
        for (var j = startY; j <= endY; j++) {
            var point = grid[i][j];

            if (point != null && point.isChosen()) {
                count++;
            }
        }
    }

    return count;
}

Point.prototype.connect = function() {
    var x = this.i;
    var y = this.j;

    var startX, endX;
    var startY, endY;

    if (x > 0 && x < grid.length - 1) {
        startX = x - 1;
        endX = x + 1;
    } else if (x == 0) {
        startX = x;
        endX = x + 1;
    } else if (x == grid.length - 1) {
        startX = x - 1;
        endX = x;
    }

    if (y > 0 && y < grid[0].length - 1) {
        startY = y - 1;
        endY = y + 1;
    } else if (y == 0) {
        startY = y;
        endY = y + 1;
    } else if (y == grid[0].length - 1) {
        startY = y - 1;
        endY = y;
    }

    for (var i = startX; i <= endX; i++) {
        for (var j = startY; j <= endY; j++) {
            var point = grid[i][j];

            if (point != null && !point.isConnected(this) && point.isChosen()) {
                this.connections.push(point);
                point.connections.push(this);
                this.drawConnection(point);
            }
        }
    }
}

function getRandomBoolean() {
    return Math.random() >= (1 - initialRatio);
}

var grid = [];

function getTotalChosen() {
    count = 0;

    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[j].length; j++) {
            if (grid[i][j].isChosen()) {
                count++;
            }
        }
    }

    return count;
}

function DrawCanvas() {
    var canvas = document.getElementById("background-canvas");

    // Safety check for non-compliant browsers
    if (!canvas.getContext) {
        return;
    }
    
    var ctx = canvas.getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    var startX = ctx.canvas.width / 2;
    var startY = ctx.canvas.height / 2;

    console.log(ctx, startX, startY);

    var xLength = Math.ceil(ctx.canvas.width / 50) + 1;
    var yLength = Math.ceil(ctx.canvas.height / 50) + 1;

    // Create the points
    for (var i = 0; i < xLength; i++) {
        grid[i] = [];
        for (var j = 0; j < yLength; j++) {
            grid[i][j] = new Point(ctx, i, j);
            
            if (getRandomBoolean()) {
                grid[i][j].choose();
            }
        }
    }

    while (getTotalChosen() / (grid.length * grid[0].length) < goodRatio) {
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[j].length; j++) {
                if (grid[i][j].neighbourCount() < 3) {
                    grid[i][j].chooseNeighbour();
                }
            }
        }
    }

    for (var i = 0; i < xLength; i++) {
        for (var j = 0; j < yLength; j++) {
            if (grid[i][j].isChosen()) {
                grid[i][j].draw();
            }
        }
    }

    for (var i = 0; i < xLength; i++) {
        for (var j = 0; j < yLength; j++) {
            if (grid[i][j].isChosen()) {
                grid[i][j].connect();
            }
        }
    }
}

function AnimateCanvas() {
    var ctx = document.getElementById("background-canvas").getContext("2d");

}