function Intro_scene(pixi) {
    let scene = new Container();

    const margin_left = 250;

    let background = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();

    scene.addChild(background);

    let left_eye = new Container();
    let right_eye = new Container();

    
    // right_eye.width = 1;

    

    scene.addChild(left_eye);
    scene.addChild(right_eye);
    left_eye.mask = new Graphics().drawRect(pixi.screen.width/2 - 205,300, 200, 200);
    right_eye.mask =  new Graphics().drawRect(pixi.screen.width/2,300, 200, 200);

    // 
    // right_eye.filterArea = new PIXI.Rectangle(0,0,100,100);

    // let eyes = [right_eye];
    let eyes = [left_eye, right_eye];
    eyes.forEach(item => {
        let eye_background = new Graphics()
        .beginFill(0x010101)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();

        item.addChild(eye_background);
    });

    {
        let message = new Text("OUTCEPTION RUN", DARK_STYLE_H1);
        message.position.set(pixi.screen.width/2 - margin_left, 50);
        scene.addChild(message);
    }

    this.points = [];
    this.edges = [];
    this.objects = [];

    {
        this.cube = new Cube(100, eyes);
        this.objects.push(this.cube);
        this.cube.points.forEach(point => this.points.push(point));
        this.cube.edges.forEach(edge => this.edges.push(edge));

        this.hypercube = new Hypercube(100, eyes);
        this.objects.push(this.hypercube);
        this.hypercube.points.forEach(point => this.points.push(point));
        this.hypercube.edges.forEach(edge => this.edges.push(edge));

        // this.cube2 = new Cube(200, scene);
        // this.objects.push(this.cube2);
        // this.cube2.points.forEach(point => this.points.push(point));
        // this.cube2.edges.forEach(edge => this.edges.push(edge));

        this.cube.x = 1000;
        this.cube.y = 0;
        this.cube.z = 0;
        this.cube.u = 100;

        this.hypercube.x = 10;
    }

    this.eye_diff = -85;
    this.eye_a_diff = 105;

    this.pov = {
        x:0,
        y:0,
        z:-1000,
        u: 0
    };

    this.pov_s = {
        x:0,
        y:0,
        z:0,
        u:0
    };

    this.view_angle = [0, 0];
    this.view_angle_s = [0, 0];
    this.alpha = 800;

    scene.update = (delta, now) => {
        let mouse = pixi.renderer.plugins.interaction.mouse.getLocalPosition(scene);

        // this.view_angle[0] += this.view_angle_s[0];
        // this.view_angle[1] += this.view_angle_s[1];

        this.view_angle[0] = mouse.x/1000 - 0.5;
        this.view_angle[1] = mouse.y/1000 - 0.5;

        this.pov.x += this.pov_s.x;
        this.pov.y += this.pov_s.y;
        this.pov.z += this.pov_s.z;

        // this.eye_a_diff += this.pov_s.x;
        // this.eye_diff += this.pov_s.z;

        // this.alpha += this.pov_s.z;

        // this.cube.u += 1;
        // this.cube.y += 0.01;
        // this.cube.z += 2;
        // this.cube.phi += 0.01;
        // this.cube.theta += 0.01;
        // this.cube.sigma_0 += 0.1;

        this.hypercube.theta += 0.015;
        // this.hypercube.u += 1;
        this.hypercube.theta += 0.005;
        this.hypercube.rho += 0.01;
        this.hypercube.sigma_2 += 0.018;
        this.hypercube.sigma_0 += 0.0096;

        // this.cube2.rho += 0.02;

        this.objects.forEach(object => {
            object.update();
        });

        this.points.forEach(point => {
            point.d2 = [
                perspective_projection(point, this.alpha, this.alpha,
                    {
                        x: this.pov.x + this.eye_diff,
                        y: this.pov.y,
                        z: this.pov.z,
                        u: this.pov.u
                    },
                    [
                        this.view_angle[0] - this.eye_a_diff/1000,
                        this.view_angle[1],
                    ]

                ),
                perspective_projection(point, this.alpha, this.alpha,
                    {
                        x: this.pov.x - this.eye_diff,
                        y: this.pov.y,
                        z: this.pov.z,
                        u: this.pov.u
                    },
                    [
                        this.view_angle[0] + this.eye_a_diff/1000,
                        this.view_angle[1],
                    ]
                )
            ];
            // point.d2 = ortho_projection(point, pov, null);
        });

        this.edges.forEach(edge => {
            edge.forEach((eye_edge, idx) => {
                eye_edge.update([
                    eye_edge.points[0].d2[idx].x + pixi.screen.width/2, eye_edge.points[0].d2[idx].y + pixi.screen.height/2,
                    eye_edge.points[1].d2[idx].x + pixi.screen.width/2, eye_edge.points[1].d2[idx].y + pixi.screen.height/2,
                ]);
            });
        });

        left_eye.position.x = -200;
    };

    const POV_SPEED = 5;

    scene.key_handler = (key, isPress) => {
        console.log("angle", this.eye_a_diff, "diff", this.eye_diff);

        if(isPress && key === 39) {
            // this.view_angle_s[0] = 0.05;
            this.pov_s.x = POV_SPEED;
        }
        if(isPress && key === 37) {
            // this.view_angle_s[0] = -0.05;
            this.pov_s.x = -POV_SPEED;
        }
        if(!isPress && (key === 37 || key === 39)) {
            this.pov_s.x = 0;
        }

        if(isPress && key === 38) {
            this.pov_s.z = POV_SPEED;
        }
        if(isPress && key === 40) {
            this.pov_s.z = -POV_SPEED;
        }
        if(!isPress && (key === 38 || key === 40)) {
            this.pov_s.z = 0;
        }
    };

    scene.select = () => {

    };

    return scene;
}