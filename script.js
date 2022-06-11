// モジュールをTHREEという名前でインポート
import * as THREE from "./build/three.module.js";
import { FlyControls } from "./jsm/controls/FlyControls.js";
import { Lensflare, LensflareElement } from "./jsm/objects/Lensflare.js";

// 変数を宣言
let camera, scene, renderer;
let controls;

const clock = new THREE.Clock();

init();

// 初期化関数
function init() {
	// camera作成
	camera = new THREE.PerspectiveCamera(
		// 視野角
		40,
		// アスペクト比
		window.innerWidth / window.innerHeight,
		// 開始距離
		1,
		// 終了距離
		15000
	);
	camera.position.z = 250;

	// scene
	scene = new THREE.Scene();

	// geometry
	const size = 250;
	// 立方体
	const geometry = new THREE.BoxGeometry(size, size, size);
	// 材質、色
	const material = new THREE.MeshPhongMaterial({
		// 16進数
		color: 0xffffff,
		specular: 0xffffff, // 共鳴反射
		shininess: 50, //輝度
	});

	// ボックスを2500個作る
	for (let i = 0; i < 2500; i++) {
		const mesh = new THREE.Mesh(geometry, material);

		// ランダムにボックスを配置
		mesh.position.x = 8000 * (2.0 * Math.random() - 1.0);
		mesh.position.y = 8000 * (2.0 * Math.random() - 1.0);
		mesh.position.z = 8000 * (2.0 * Math.random() - 1.0);

		// 回転度合いをランダムに決める
		mesh.rotation.x = Math.random() * Math.PI;
		mesh.rotation.y = Math.random() * Math.PI;
		mesh.rotation.z = Math.random() * Math.PI;

		scene.add(mesh);
	}

	// 平行光源
	const dirLight = new THREE.DirectionalLight(0xffffff, 0.03);
	scene.add(dirLight);

	// レンズフレアを追加する
	const textureLoader = new THREE.TextureLoader();
	const textureFlare = textureLoader.load("./images/LensFlare2.png");

	addLight(0.08, 0.3, 0.9, 0, 0, -1000);

	// ポイント光源を追加
	function addLight(h, s, l, x, y, z) {
		const light = new THREE.PointLight(0xffffff, 1.5, 2000);
		light.color.setHSL(h, s, l);
		light.position.set(x, y, z);
		scene.add(light);

		const lensflare = new Lensflare();
		lensflare.addElement(
			new LensflareElement(textureFlare, 700, 0, light.color)
		);

		scene.add(lensflare);
	}

	// renderer
	renderer = new THREE.WebGLRenderer();
	// 画面いっぱいに表示
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	document.body.appendChild(renderer.domElement);

	// マウス操作を行う
	controls = new FlyControls(camera, renderer.domElement);

	// 左クリック、右クリックのスピード
	controls.movementSpeed = 2000;
	// マウス追従
	controls.rollSpeed = Math.PI / 20;

	animate();
}

function animate() {
	requestAnimationFrame(animate);

	// 経過した時間を取得
	const delta = clock.getDelta();
	controls.update(delta);
	renderer.render(scene, camera);
}
