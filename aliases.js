const Graphics = PIXI.Graphics;
const Text = PIXI.Text;
const Container = PIXI.Container;
const Point = PIXI.Point;

let DARK_STYLE_H1 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 56,
  fill: "white",
  stroke: '#aaaaaa',
  strokeThickness: 1,
  dropShadow: true,
  dropShadowColor: "#cccccc",
  dropShadowBlur: 15,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

let RED_STYLE_H1 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 56,
  fill: "red",
  stroke: '#aaaaaa',
  strokeThickness: 1,
  dropShadow: true,
  dropShadowColor: "#cccccc",
  dropShadowBlur: 15,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

let DARK_STYLE_H2 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fill: "white",
  stroke: '#aaaaaa',
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#cccccc",
  dropShadowBlur: 10,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

let BLUE_STYLE_H2 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 36,
  fill: "0x55DDFF",
  stroke: '0x55DDFF',
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#cccccc",
  dropShadowBlur: 10,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

let BLUE_STYLE_H4 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 30,
  fill: "0x55DDFF",
  stroke: '0x55DDFF',
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#cccccc",
  dropShadowBlur: 10,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

let DARK_STYLE_H4 = new PIXI.TextStyle({
  fontFamily: "Arial",
  fontSize: 24,
  fill: "white",
  stroke: '#aaaaaa',
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#cccccc",
  dropShadowBlur: 10,
  dropShadowAngle: Math.PI / 7,
  dropShadowDistance: 3,
});

function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

// x axis
function phi(p, a) {
    return {
        x: p.x * 1 + p.y * 0 + p.z * 0,
        y: p.x * 0 + p.y * Math.cos(a) + p.z * -Math.sin(a),
        z: p.x * 0 + p.y * Math.sin(a) + p.z * Math.cos(a)
    }
}

// y axis
function theta(p, a) {
    return {
        x: p.x * Math.cos(a) + p.y * 0 + p.z * Math.sin(a),
        y: p.x * 0 + p.y * 1 + p.z * 0,
        z: p.x * -Math.sin(a) + p.y * 0 + p.z * Math.cos(a)
    };
}

// z axis
function rho(p, a) {
    return {
        x: p.x * Math.cos(a) + p.y * -Math.sin(a) + p.z * 0,
        y: p.x * Math.sin(a) + p.y * Math.cos(a) + p.z * 0,
        z: p.x * 0 + p.y * 0 + p.z * 1
    };
}

function local(point, C, angles) {
    let _point = {
        x: point.x - C.x,
        y: point.y - C.y,
        z: point.z - C.z
    };

    return phi(theta(_point, angles[0]), -angles[1])
}

// C is PoV, n is view vector
function perspective_projection(point, alpha, C, angles) {
    let local_point = local(point, C, angles);

    let factor = Math.abs(alpha/local_point.z);
    return {
        x: factor * local_point.x,
        y: factor * local_point.y
    };
}

function ortho_projection(point, C, angles) {
    let local_point = local(point, C, angles);

    return {
        x: local_point.x,
        y: local_point.y
    };
}

class Line extends PIXI.Graphics {
    constructor(points, lineSize, lineColor) {
        super();
        
        var s = this.lineWidth = lineSize || 5;
        var c = this.lineColor = lineColor || "0x000000";
        
        this.points = points;

        this.lineStyle(s, c)

        this.moveTo(10, 20);
        this.lineTo(100, 200);
    }
    
    update(p) {
        // console.log("p:", p);
        let s = this.lineWidth, c = this.lineColor;

        this.clear();
        this.lineStyle(s, c);
        this.moveTo(p[0], p[1]);
        this.lineTo(p[2], p[3]);
    }
}

class Cube {
    constructor(size, scene) {
        this.raw_points = [
            {x:-1, y:-1, z: -1},
            {x:1, y:-1, z: -1},
            {x:1, y:1, z: -1},
            {x:-1, y:1, z: -1},

            {x:-1, y:-1, z: 1},
            {x:1, y:-1, z: 1},
            {x:1, y:1, z: 1},
            {x:-1, y:1, z: 1},
        ];

        this.points = this.raw_points.map(x => ({x:0, y:0, z:0}));

        this.edges = [];

        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.phi = 0;
        this.theta = 0;
        this.rho = 0;

        this.size = size;

        this.edges = [
            [0,1],
            [1,2],
            [2,3],
            [3,0],

            [4,5],
            [5,6],
            [6,7],
            [7,4],

            [0,4],
            [1,5],
            [2,6],
            [3,7],
        ].map(item => {
            let ab = new Line([
                this.points[item[0]],
                this.points[item[1]]
            ], 5, 0xffffaa);

            scene.addChild(ab);
            return ab;
        });
    }

    update() {
        // console.log("this.points", this.points);

        this.raw_points.forEach((point, idx) => {
            let p1 = {
                x: point.x * this.size/2,
                y: point.y * this.size/2,
                z: point.z * this.size/2
            };

            p1 = rho(
                phi(
                    theta(p1, this.theta),
                    this.phi),
                this.rho
            );

            this.points[idx].x = p1.x + this.x;
            this.points[idx].y = p1.y + this.y;
            this.points[idx].z = p1.z + this.z;
        });
    }
}