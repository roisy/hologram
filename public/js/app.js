class App {
    constructor(pepper = false) {
        this.pepper = pepper;
        this.scene = new THREE.Scene();

        this.initRenderer();
        this.addLight();

        let container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);

        //if (pepper)
        //    this.initPepper();

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(0, 1.4, 0.9);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target = new THREE.Vector3(0, 1.4, 0);
    }

    /* initPepper() {
        let effect = new THREE.PeppersGhostEffect(this.renderer);
        effect.setSize(window.innerWidth, window.innerHeight);
        effect.cameraDistance = 10;
        effect.reflectFromAbove = true;
        this.renderer = effect;
    } */

    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    addAxis() {
        this.axesHelper = new THREE.AxesHelper(5);
        this.scene.add(this.axesHelper);
    }

    showAxis() {
        this.axesHelper.visible = true;
    }

    hideAxis() {
        this.axesHelper.visible = false;
    }

    addLight() {
        let light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);
    }

    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}