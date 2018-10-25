;(function (root, factory) {
	// 其实是有依赖 Three ThreeExtra 库的 以后再修改 现在只需要标签引用
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS 
        // module.exports=factory( require('./jquery'),require('./handlebars'));
    } else {
        // Browser globals
       root.renderCloud= factory(root.jQuery,root.Handlebars);
    }
}(this, function (){
	
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	// Bg gradient
	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = 150;
	//canvas.height = canvas.height;
	var context = canvas.getContext( '2d' );

	var gradient = context.createLinearGradient( 0, 0, 0, canvas.height );
	gradient.addColorStop(0, "#1e4877");
	gradient.addColorStop(0.5, "#4584b4");

	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	//document.body.style.background = 'url(' + canvas.toDataURL('image/png') + ')';

	// Clouds

	var container;
	var camera, scene, renderer, sky, mesh, geometry, material,
	i, h, color, colors = [], sprite, size, x, y, z;

	var mouseX = 0, mouseY = 0;
	var start_time = new Date().getTime();

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = canvas.height / 2;

	function createObjectURL(blob){
       if(window.URL){
           return window.URL.createObjectURL(blob);
       }else if(window.webkitURL){
           return window.webkitURL.createObjectURL(blob);
       }
           return null;
    }
    function renderCloud(id,url){
	    const image = new Image();
	     image.crossOrigin = "anonymous"
	     image.onload = function() {
	     	init(id,image);
	     	animate();
	     };
	     image.src = url;
    }

	// init();
	// animate();

	function init(id,img) {

		container = document.getElementById(id);
		// container.setAttribute("class", "canvasTwo");

		camera = new THREE.Camera( 30, window.innerWidth / canvas.height, 1, 3000 );
		camera.position.z = 6000;

		scene = new THREE.Scene();

		geometry = new THREE.Geometry();
		// THREE.ImageUtils.crossOrigin = 'anonymous'
		// var texture = THREE.ImageUtils.loadTexture('./2_files/cloud10.png');
		var texture = new THREE.Texture()
		texture.image=img;
		texture.needsUpdate = true;
		texture.magFilter = THREE.LinearMipMapLinearFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;

		var fog = new THREE.Fog( 0x4584b4, - 100, 3000 );

		material = new THREE.MeshShaderMaterial( {

			uniforms: {

				"map": { type: "t", value:2, texture: texture },
				"fogColor" : { type: "c", value: fog.color },
				"fogNear" : { type: "f", value: fog.near },
				"fogFar" : { type: "f", value: fog.far },

			},
			vertexShader: document.getElementById( 'vs' ).textContent,
			fragmentShader: document.getElementById( 'fs' ).textContent,
			depthTest: false

		} );

		var plane = new THREE.Mesh( new THREE.Plane( 64, 64 ) );

		for ( i = 0; i < 8000; i++ ) {

			plane.position.x = Math.random() * 1000 - 500;
			plane.position.y = - Math.random() * Math.random() * 200 - 15;
			plane.position.z = i;
			plane.rotation.z = Math.random() * Math.PI;
			plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

			GeometryUtils.merge( geometry, plane );

		}

		mesh = new THREE.Mesh( geometry, material );
		scene.addObject( mesh );

		mesh = new THREE.Mesh( geometry, material );
		mesh.position.z = - 8000;
		scene.addObject( mesh );

		renderer = new THREE.WebGLRenderer( { antialias: false } );
		renderer.setSize( window.innerWidth, canvas.height );
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		window.addEventListener( 'resize', onWindowResize, false );

	}

	function onDocumentMouseMove( event ) {

		mouseX = ( event.clientX - windowHalfX ) * 0.25;
		mouseY = ( event.clientY - windowHalfY ) * 0.15;

	}

	function onWindowResize( event ) {

		camera.aspect = window.innerWidth / canvas.height;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, canvas.height );

	}

	function animate() {

		requestAnimationFrame( animate );
		render();

	}

	function render() {

		position = ( ( new Date().getTime() - start_time ) * 0.03 ) % 8000;

		camera.position.x += ( mouseX - camera.target.position.x ) * 0.01;
		camera.position.y += ( - mouseY - camera.target.position.y ) * 0.01;
		camera.position.z = - position + 8000;

		camera.target.position.x = camera.position.x;
		camera.target.position.y = camera.position.y;
		camera.target.position.z = camera.position.z - 1000;

		renderer.render( scene, camera );

	}
	return renderCloud;
}))

