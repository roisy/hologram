let container, stats, clock, gui, mixer, actions, activeAction, previousAction;
let camera, scene, renderer, model, face;

init();
animate();

function init() {

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera(30.0, window.innerWidth / window.innerHeight, 0.1, 20.0);
	camera.position.set(0.0, 1.4, 0.9);

	scene = new THREE.Scene();

	clock = new THREE.Clock();

	// lights
	const light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1.0, 1.0, 1.0 ).normalize();
	scene.add( light );

	// model

	const loader = new THREE.GLTFLoader();
	loader.crossOrigin = 'anonymous';
	loader.load( 'models/Rem.vrm', function ( gltf ) {

		THREE.VRMUtils.removeUnnecessaryJoints( gltf.scene );

		THREE.VRM.from( gltf ).then( ( vrm ) => {

			model = vrm.scene;
			scene.add( model );

			currentVrm = vrm;

			vrm.humanoid.getBoneNode( THREE.VRMSchema.HumanoidBoneName.Hips ).rotation.y = Math.PI;

			console.log( vrm );

			createGUI( vrm, vrm.animations );
		} );

	},
	
		( progress ) => console.log( 100.0 * ( progress.loaded / progress.total ) + '%'),

		( error ) => console.error( error )
	
	);

	// helpers
	const gridHelper = new THREE.GridHelper( 10, 10 );
	scene.add( gridHelper );

	const axesHelper = new THREE.AxesHelper( 5 );
	scene.add( axesHelper );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.outputEncoding = THREE.sRGBEncoding;
	container.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize );

	// stats
	stats = new Stats();
	container.appendChild( stats.dom );

}

function createGUI( model, animations ) {
	gui = new dat.gui.GUI();

	mixer = new THREE.AnimationMixer( model );

	actions = {}

	// Expressions
	const expressions = model.blendShapeProxy.expressions;
	const expressionFolder = gui.addFolder( 'Expressions' );
	for ( let i = 0; i < expressions.length; i ++ ) {
		expressionFolder.add( THREE.VRMSchema.BlendShapePresetName[expressions[i]], i, 0, 1, 0.01 ).name( expressions[ i ] );
	}
	expressionFolder.open();
}

function animate() {

	const dt = clock.getDelta();

	if ( mixer ) mixer.update( dt );

	requestAnimationFrame( animate );

	renderer.render( scene, camera );

	stats.update();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}