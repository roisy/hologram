
class Model {
    constructor(scene) {
        this.scene = scene;
        this.loader = new THREE.GLTFLoader();
        this.clock = new THREE.Clock();
        this.load();
        this.action = {};
        this.obj = {};
        this.state = {
            entering: false,
            leaving: false
        }
        this.visemevel = 0.1;
        this.visemes = {
            A: 0.0,
            E: 0.0,
            I: 0.0,
            O: 0.0,
            U: 0.0
        }
        this.visemesActive = {
            A: 0.0,
            E: 0.0,
            I: 0.0,
            O: 0.0,
            U: 0.0
        }
        this.visemeList = []
        this.visemeTime = 0.0
    }

    load() {
        this.loader.crossOrigin = 'anonymous';
        this.loader.load('models/Rem2.vrm', (gltf) => {

            THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

            THREE.VRM.from(gltf).then((vrm) => {

                this.vrm = vrm;
                this.scene.add(this.vrm.scene);

                this.mixer = new THREE.AnimationMixer(this.vrm.scene);

                //this.action.walk = this.mixer.clipAction(gltf.animations[4]);
                //this.action.think = this.mixer.clipAction(gltf.animations[3]);
                //this.action.swipe = this.mixer.clipAction(gltf.animations[2]);
                //this.action.idle = this.mixer.clipAction(gltf.animations[0]);

                //this.action.swipe.setLoop(THREE.LoopOnce, 0);
                //this.action.swipe.clampWhenFinished = true;

                //this.action.idle.play();

                this.vrm.scene.visible = true;

                this.vrm.humanoid.getBoneNode(THREE.VRMSchema.HumanoidBoneName.Hips).rotation.y = Math.PI;
                console.log(vrm);
            });

        },
            (progress) => console.log(100.0 * (progress.loaded / progress.total) + '%'),
            (error) => console.error(error)
        );
    }

    enter() {
        this.vrm.scene.position.z = -2;
        this.vrm.scene.visible = true;
        this.state.entering = true;
        this.fadeAction('idle', 'walk');
    }

    leave() {
        this.vrm.scene.position.z = 0;
        this.vrm.scene.visible = true;
        this.vrm.scene.rotation.set(0, Math.PI, 0);
        this.state.leaving = true;
        this.fadeAction('idle', 'walk');
        // obj.position.set(0,0,3.67989 * 2);
    }

    swipe() {
        this.fadeAction('idle', 'swipe');
    }

    updateViseme(delta) {

        for (const viseme in this.visemesActive) {
            let newvalue = this.visemes[viseme] + (this.visemesActive[viseme] - this.visemes[viseme]) //* delta / this.visemevel
            this.visemes[viseme] = newvalue
            this.vrm.blendShapeProxy.setValue(THREE.VRMSchema.BlendShapePresetName[viseme], newvalue);
        }
    }

    animate() {
        if (this.state.entering) {
            this.vrm.scene.position.z += 0.035;
            if (this.vrm.scene.position.z >= 0) {
                this.state.entering = false;
                this.fadeAction('walk', 'idle');
            }
        }
        if (this.state.leaving) {
            this.vrm.scene.position.z -= 0.039;
            if (this.vrm.scene.position.z <= -5) {
                this.state.leaving = false;
                this.vrm.scene.rotation.set(0, 0, 0);
                this.vrm.scene.visible = false;
                this.fadeAction('walk', 'idle');
            }
        }

        let deltaTime = this.clock.getDelta()

        if (this.mixer)
            this.mixer.update(deltaTime);

        if (this.vrm) {
            if (this.visemeList.length > 0) {
                let viseme = this.visemeList[0][0]
                let time = this.visemeList[0][1]

                console.log(time, viseme)
                if (viseme == 0){
                    this.visemesActive.A = 0.0
                    this.visemesActive.E = 0.0
                    this.visemesActive.I = 1.0
                    this.visemesActive.O = 0.0
                    this.visemesActive.U = 0.0
                }else if (viseme == 1){
                    this.visemesActive.A = 0.2
                    this.visemesActive.E = 0.0
                    this.visemesActive.I = 0.0
                    this.visemesActive.O = 0.0
                    this.visemesActive.U = 0.8
                }else if (viseme == 2){
                    this.visemesActive.A = 0.0
                    this.visemesActive.E = 0.0
                    this.visemesActive.I = 1.0
                    this.visemesActive.O = 0.5
                    this.visemesActive.U = 0.5
                }else if (viseme == 3){
                    this.visemesActive.A = 0.0
                    this.visemesActive.E = 1.0
                    this.visemesActive.I = 0.0
                    this.visemesActive.O = 0.0
                    this.visemesActive.U = 0.0
                }else if (viseme == 4){
                    this.visemesActive.A = 0.0
                    this.visemesActive.E = 0.0
                    this.visemesActive.I = 0.0
                    this.visemesActive.O = 0.0
                    this.visemesActive.U = 0.0
                }else if (viseme == 5){
                    this.visemesActive.A = 0.0
                    this.visemesActive.E = 5.0
                    this.visemesActive.I = 5.0
                    this.visemesActive.O = 0.0
                    this.visemesActive.U = 0.0
                }else if (viseme == 6){
                    this.visemesActive.A = 0.7
                    this.visemesActive.E = 0.0
                    this.visemesActive.I = 0.0
                    this.visemesActive.O = 0.3
                    this.visemesActive.U = 0.0
                }

                this.visemeTime += deltaTime
                while ((this.visemeList.length > 1) && (this.visemeTime > time)) {
                    this.visemeList.shift()
                    viseme = this.visemeList[0][0]
                    time = this.visemeList[0][1]
                }

                if (this.visemeTime > time) {
                    this.visemeList.shift()       
                } 
                
            }else{
                this.visemeTime = 0;
            }

            this.updateViseme(deltaTime);
            this.vrm.update(deltaTime);
        }
    }

    fadeAction(from, to) {
        var from = this.action[from].play();
        var to = this.action[to].play();

        from.enabled = true;
        to.enabled = true;

        if (to.loop === THREE.LoopOnce) {
            to.reset();
        }

        from.crossFadeTo(to, 0.3);
    }
}