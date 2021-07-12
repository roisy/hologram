const app = new App(true)
app.addAxis();

const model = new Model(app.scene);

//app.camera.position.set(0, 1, 2); // DON'T CHANGE THIS !!!
//app.scene.position.y = 1;
//app.camera.lookAt(0, 1, 0);

(function render() {
    requestAnimationFrame(render);
    model.animate();
    app.render();
  })();

const sock = new Sock('ws://192.168.0.19:8181/core', model);