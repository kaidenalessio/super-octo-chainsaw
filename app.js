class Vec3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	clone() {
		return new Vec3(this.x, this.y, this.z);
	}
	reset() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	add(x, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		this.x += x;
		this.y += y;
		this.z += z;
	}
	addXY(x, y) {
		if (y === undefined) y = x;
		this.x += x;
		this.y += y;
	}
	multiplyXY(x, y) {
		if (y === undefined) y = x;
		this.x *= x;
		this.y *= y;
	}
	toString() {
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
}

class Triangle {
	/**
	 * @param {object} points Array of `Vec3`.
	 */
	constructor(points) {
		this.p = points;
	}

	clone() {
		return new Triangle([
			this.p[0].clone(),
			this.p[1].clone(),
			this.p[2].clone()
		]);
	}

	onAllPoints(fn) {
		for (let i = 0; i < 3; i++) {
			fn(this.p[i]);
		}
	}
}

class Mat4 {
	constructor() {
		this.m = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0]
		];
	}

	static makeProjection(aspectRatio=0.5625, fovDeg=90, near=0.1, far=1000) {
		const fovRad = 1 / Math.tan(fovDeg * 0.5 * Math.PI / 180);
		const m = new Mat4();
		m.m[0][0] = aspectRatio * fovRad;
		m.m[1][1] = fovRad;
		m.m[2][2] = far / (far - near);
		m.m[3][2] = (-far * near) / (far - near);
		m.m[2][3] = 1;
		return m;
	}

	static makeRotationX(angleDeg, m) {
		if (m === undefined) m = new Mat4();
		angleDeg = angleDeg * Math.PI / 180;
		m.m[0][0] = 1;
		m.m[1][1] = Math.cos(angleDeg);
		m.m[1][2] = Math.sin(angleDeg);
		m.m[2][1] = -Math.sin(angleDeg);
		m.m[2][2] = Math.cos(angleDeg);
		m.m[3][3] = 1;
		return m;
	}

	static makeRotationY(angleDeg, m) {
		if (m === undefined) m = new Mat4();
		angleDeg = angleDeg * Math.PI / 180;
		m.m[0][0] = Math.cos(angleDeg);
		m.m[0][2] = -Math.sin(angleDeg);
		m.m[1][1] = 1;
		m.m[2][0] = Math.sin(angleDeg);
		m.m[2][2] = Math.cos(angleDeg);
		m.m[3][3] = 1;
		return m;
	}

	static makeRotationZ(angleDeg, m) {
		if (m === undefined) m = new Mat4();
		angleDeg = angleDeg * Math.PI / 180;
		m.m[0][0] = Math.cos(angleDeg);
		m.m[0][1] = Math.sin(angleDeg);
		m.m[1][0] = -Math.sin(angleDeg);
		m.m[1][1] = Math.cos(angleDeg);
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
	}
}

class Mesh {
	/**
	 * @param {object} tris Array of `Triangle`.
	 */
	constructor(tris) {
		this.tris = tris;
		this.transform = {
			position: new Vec3(0, 0, 0),
			rotation: new Vec3(0, 0, 0)
		};
	}

	applyTransform() {
		for (let i = this.tris.length - 1; i >= 0; --i) {
			const tri = this.tris[i];

			// Rotate (Z -> X -> Y)
			const matRotZ = Mat4.makeRotationZ(this.transform.rotation.z);
			const matRotX = Mat4.makeRotationX(this.transform.rotation.x);
			const matRotY = Mat4.makeRotationY(this.transform.rotation.y);

			tri.p[0] = multiplyMatrix(tri.p[0], matRotZ);
			tri.p[1] = multiplyMatrix(tri.p[1], matRotZ);
			tri.p[2] = multiplyMatrix(tri.p[2], matRotZ);

			tri.p[0] = multiplyMatrix(tri.p[0], matRotX);
			tri.p[1] = multiplyMatrix(tri.p[1], matRotX);
			tri.p[2] = multiplyMatrix(tri.p[2], matRotX);

			tri.p[0] = multiplyMatrix(tri.p[0], matRotY);
			tri.p[1] = multiplyMatrix(tri.p[1], matRotY);
			tri.p[2] = multiplyMatrix(tri.p[2], matRotY);

			// Translate
			tri.onAllPoints((p) => {
				p.add(this.transform.position);
			});
		}

		this.transform.position.reset();
		this.transform.rotation.reset();
	}

	loadFromFile(fileText) {
		this.tris.length = 0;
		const h = [];
		for (const i of fileText.split(/\r\n|\n/)) {
			const j = i.split(' ');
			if (j.length > 3) {
				switch (j[0]) {
					case 'v': h.push(new Vec3(j[1], j[2], j[3])); break;
					case 'f': this.tris.push(new Triangle([h[j[1]-1], h[j[2]-1], h[j[3]-1]])); break;
				}
			}
		}
	}

	static makeSouthTriangle() {
		return new Mesh([
			new Triangle([new Vec3(-0.5, 0, 0), new Vec3(0.5, 0, 0), new Vec3(0, 1, 0)])
		]);
	}

	/**
	 * @param {number} x The size of the cube.
	 */
	static makeCube(x=1) {
		const xx = x * 0.5;
		const m = new Mesh([
			// SOUTH
			new Triangle([new Vec3(0, 0, 0), new Vec3(0, x, 0), new Vec3(x, x, 0)]),
			new Triangle([new Vec3(0, 0, 0), new Vec3(x, x, 0), new Vec3(x, 0, 0)]),
			// EAST
			new Triangle([new Vec3(x, 0, 0), new Vec3(x, x, 0), new Vec3(x, x, x)]),
			new Triangle([new Vec3(x, 0, 0), new Vec3(x, x, x), new Vec3(x, 0, x)]),
			// NORTH
			new Triangle([new Vec3(x, 0, x), new Vec3(x, x, x), new Vec3(0, x, x)]),
			new Triangle([new Vec3(x, 0, x), new Vec3(0, x, x), new Vec3(0, 0, x)]),
			// WEST
			new Triangle([new Vec3(0, 0, x), new Vec3(0, x, x), new Vec3(0, x, 0)]),
			new Triangle([new Vec3(0, 0, x), new Vec3(0, x, 0), new Vec3(0, 0, 0)]),
			// TOP
			new Triangle([new Vec3(0, x, 0), new Vec3(0, x, x), new Vec3(x, x, x)]),
			new Triangle([new Vec3(0, x, 0), new Vec3(x, x, x), new Vec3(x, x, 0)]),
			// BOTTOM
			new Triangle([new Vec3(0, 0, x), new Vec3(0, 0, 0), new Vec3(x, 0, 0)]),
			new Triangle([new Vec3(0, 0, x), new Vec3(x, 0, 0), new Vec3(x, 0, x)]),
			// X Rotation Gizmo
			new Triangle([new Vec3(0, xx, xx), new Vec3(xx, xx * 0.5, xx), new Vec3(x, xx, xx)])
		]);

		// Center the cube
		m.transform.position.add(-x * 0.5);
		m.applyTransform();

		return m;
	}
}

const multiplyMatrix = (i, m) => {
	let o = new Vec3(0, 0, 0);

	o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
	o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
	o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];

	let w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];

	if (w !== 0) {
		w = 1 / w;
		o.x *= w;
		o.y *= w;
		o.z *= w;
	}

	return o;
};

const processMesh = (mesh, matProj) => {
	const tris = [];
	for (let i = mesh.tris.length - 1; i >= 0; --i) {
		const tri = mesh.tris[i].clone();

		// Rotate (Z -> X -> Y)
		const matRotZ = Mat4.makeRotationZ(mesh.transform.rotation.z);
		const matRotX = Mat4.makeRotationX(mesh.transform.rotation.x);
		const matRotY = Mat4.makeRotationY(mesh.transform.rotation.y);

		tri.p[0] = multiplyMatrix(tri.p[0], matRotZ);
		tri.p[1] = multiplyMatrix(tri.p[1], matRotZ);
		tri.p[2] = multiplyMatrix(tri.p[2], matRotZ);

		tri.p[0] = multiplyMatrix(tri.p[0], matRotX);
		tri.p[1] = multiplyMatrix(tri.p[1], matRotX);
		tri.p[2] = multiplyMatrix(tri.p[2], matRotX);

		tri.p[0] = multiplyMatrix(tri.p[0], matRotY);
		tri.p[1] = multiplyMatrix(tri.p[1], matRotY);
		tri.p[2] = multiplyMatrix(tri.p[2], matRotY);

		// Translate
		tri.onAllPoints((p) => {
			p.add(mesh.transform.position);
		});

		// Project 3D -> 2D
		tri.p[0] = multiplyMatrix(tri.p[0], matProj);
		tri.p[1] = multiplyMatrix(tri.p[1], matProj);
		tri.p[2] = multiplyMatrix(tri.p[2], matProj);

		// Scale (-1 to 1) -> (0 to screen size)
		tri.onAllPoints((p) => {
			p.addXY(1);
			p.multiplyXY(Room.mid.w, Room.mid.h);
		});

		tris.push(tri);
	}
	return tris;
};

let matProj = Mat4.makeProjection();

const meshTri = Mesh.makeCube();
meshTri.transform.position.z += 3;

const Game = new BranthRoom('Game');
Game.render = () => {

	const spd = 2 + Input.keyHold(KeyCode.Shift) * 8;

	matProj = Mat4.makeProjection(Room.h / Room.w);

	meshTri.transform.position.x += (Input.keyHold(KeyCode.D) - Input.keyHold(KeyCode.A)) * spd * 0.1;
	meshTri.transform.position.y += (Input.keyHold(KeyCode.E) - Input.keyHold(KeyCode.Q)) * spd * 0.1;
	meshTri.transform.position.z += (Input.keyHold(KeyCode.W) - Input.keyHold(KeyCode.S)) * spd * 0.1;

	meshTri.transform.rotation.z += (Input.keyHold(KeyCode.C) - Input.keyHold(KeyCode.Z)) * spd;
	meshTri.transform.rotation.x += (Input.keyHold(KeyCode.Down) - Input.keyHold(KeyCode.Up)) * spd;
	meshTri.transform.rotation.y += (Input.keyHold(KeyCode.Left) - Input.keyHold(KeyCode.Right)) * spd;

	const trianglesToRaster = processMesh(meshTri, matProj);

	Draw.CTX.lineJoin = LineJoin.round;
	Draw.CTX.strokeStyle = C.white;
	for (let i = trianglesToRaster.length - 1; i >= 0; --i) {
		const tri = trianglesToRaster[i];
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(tri.p[0].x, tri.p[0].y);
		Draw.CTX.lineTo(tri.p[1].x, tri.p[1].y);
		Draw.CTX.lineTo(tri.p[2].x, tri.p[2].y);
		Draw.CTX.closePath();
		Draw.CTX.stroke();
	}
};

Game.renderUI = () => {
	Draw.setColor(C.white);
	Draw.setFont(Font.m);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(16, 48, `${meshTri.transform.position.toString()}\n${meshTri.transform.rotation.toString()}`);
};

Room.add(Game);

const file = document.createElement('input');
file.type = 'file';
file.onchange = (e) => {
	const f = e.target.files[0];
	const reader = new FileReader();
	reader.onload = (e) => {
		meshTri.loadFromFile(e.target.result);
	};
	reader.readAsText(f);
}
document.body.appendChild(file);

BRANTH.start();
Room.start('Game');