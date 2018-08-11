function Intro_scene(pixi) {
    let scene = new Container();

    const margin_left = 250;

    let background = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();

    scene.addChild(background);


    {
        let message = new Text("OUTCEPTION RUN", DARK_STYLE_H1);
        message.position.set(pixi.screen.width/2 - margin_left, 50);
        scene.addChild(message);
    }

    this.points = [];
    this.edges = [];

    {
        this.cube_points = [
            {x:-1, y:-1, z: -1},
            {x:1, y:-1, z: -1},
            {x:1, y:1, z: -1},
            {x:-1, y:1, z: -1},

            {x:-1, y:-1, z: 1},
            {x:1, y:-1, z: 1},
            {x:1, y:1, z: 1},
            {x:-1, y:1, z: 1},
        ];

        this.cube2_points = [
            {x:-1, y:-1, z: -1},
            {x:1, y:-1, z: -1},
            {x:1, y:1, z: -1},
            {x:-1, y:1, z: -1},

            {x:-1, y:-1, z: 1},
            {x:1, y:-1, z: 1},
            {x:1, y:1, z: 1},
            {x:-1, y:1, z: 1},
        ];

        // this.cube2_points = new Array(this.cube_points);

        this.cube_points.forEach(point => this.points.push(point));
        this.cube2_points.forEach(point => this.points.push(point));

        this.cube_points.forEach(point => {
            point.x *= 100;
            point.y *= 100;
            point.z *= 100;
        });
        this.cube2_points.forEach(point => {
            point.x *= 100;
            point.y *= 100;
            point.z *= 100;
        });

        this.cube_points.forEach(point => {
            point.x += 0;
            point.y += 0;
            point.z += 0;
        });
        this.cube2_points.forEach(point => {
            point.x += 200;
            point.y += 10;
            point.z += 200;
        });

        

        [
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
        ].forEach(item => {
            let ab = new Line([
                this.cube_points[item[0]],
                this.cube_points[item[1]]
            ], 5, 0xffffaa);

            this.edges.push(ab);
            scene.addChild(ab);
        });

        [
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
        ].forEach(item => {
            let ab = new Line([
                this.cube2_points[item[0]],
                this.cube2_points[item[1]]
            ], 5, 0xffffaa);

            this.edges.push(ab);
            scene.addChild(ab);
        });
    }

    this.pov = {
        x:0,
        y:0,
        z:-1000
    };

    this.view_angle = [0, 0];

    scene.update = (delta, now) => {
        const alpha = 2000;

        // this.view_angle[0] = Math.cos(now/1000) * 0.2;

        this.cube_points.forEach(point => {
            // point.x += 2;
            // point.y += 0.01;
            // point.z += 2;
        });

        // console.log(Math.floor(now) % 2);
        // this.b.y = Math.sin(now/100) * 100;

        this.points.forEach(point => {
            point.d2 = perspective_projection(point, alpha, this.pov, this.view_angle);
            // point.d2 = ortho_projection(point, pov, null);
        });

        this.edges.forEach(edge => {
            edge.update([
                edge.points[0].d2.x + pixi.screen.width/2, edge.points[0].d2.y + pixi.screen.height/2,
                edge.points[1].d2.x + pixi.screen.width/2, edge.points[1].d2.y + pixi.screen.height/2,
            ]);
        });
    };

    scene.key_handler = (key, isPress) => {
        // console.log("key handler");

        if(isPress === true) {
            if(isPress && key === 39) {
                this.view_angle[0] += 0.1;
            }

            if(isPress && key === 37) {
                this.view_angle[0] -= 0.1;
            }

            if(isPress && key === 38) {
                this.view_angle[1] += 0.1;
            }

            if(isPress && key === 40) {
                this.view_angle[1] -= 0.1;
            }
        }
    };

    scene.select = () => {

    };

    return scene;
}