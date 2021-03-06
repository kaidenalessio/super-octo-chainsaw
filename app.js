let firebaseInitialized = false;

const firebaseConfig = {
	apiKey: "*",
	authDomain: "*",
	databaseURL: "*",
	projectId: "*",
	storageBucket: "*",
	messagingSenderId: "*",
	appId: "*"
};

if (firebase) {
	firebase.initializeApp(firebaseConfig);
	try {
		firebase.database();
		firebaseInitialized = true;
	}
	catch {
		firebaseInitialized = false;
	}
}

let database;
if (firebaseInitialized) {
	database = firebase.database();
}

const writeUserData = (id, x, y, z) => {
	database.ref(`users/${id}`).set({ x, y, z });
};

const otherPlayersId = [];

const updateOtherPlayers = (id, pos) => {
	if (otherPlayersId.indexOf(id) < 0) {
		const rgbVec = new Vec3(Math.range(0.5, 1), Math.range(0.5, 1), Math.range(0.5, 1));
		const n = new My3DObject(Mesh.makeCube(), id, rgbVec);
		otherPlayersId.push(id);
		my3DObjects.push(n);
	}

	for (let i = my3DObjects.length - 1; i >= 0; --i) {
		const m = my3DObjects[i].mesh;
		if (m.name === id) {
			m.transform.position.set(new Vec3(pos.x, pos.y, pos.z));
		}
	}
};

const updateUsersData = (data) => {
	const keys = Object.keys(data);
	const values = Object.values(data);
	for (let i = keys.length - 1; i >= 0; --i) {
		if (keys[i] !== GLOBAL.key) {
			updateOtherPlayers(keys[i], values[i]);
		}
	}
};

if (firebaseInitialized) {
	database.ref('users').on('value', (snapshot) => {
		updateUsersData(snapshot.val());
	});
}

const updateNetwork = () => {
	if (firebaseInitialized) {
		if (player.isMoving) {
			if (Time.frameCount % 10 === 0) {
				const p = mainCamera.transform.position;
				writeUserData(GLOBAL.key, p.x, p.y, p.z);
			}
		}
	}
};

Sound.add('r99', 'r99.mp3');
Sound.add('reload', 'reload.mp3');
Sound.add('ammograb', 'ammograb.mp3');

const makeRGBLum = (rgb, lum) => {
	return `rgb(${rgb.r * lum}, ${rgb.g * lum}, ${rgb.b * lum})`;
};

class Vec3 {
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = 1;
	}
	clone() {
		return new Vec3(this.x, this.y, this.z);
	}
	toRGB() {
		return {
			r: this.x,
			g: this.y,
			b: this.z
		};
	}
	reset() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
	}
	set(x, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		this.x = x;
		this.y = y;
		this.z = z;
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
	sub(x, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		this.x -= x;
		this.y -= y;
		this.z -= z;
	}
	mul(x, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		this.x *= x;
		this.y *= y;
		this.z *= z;
	}
	div(x, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		this.x /= x;
		this.y /= y;
		this.z /= z;
	}
	addXY(x, y) {
		if (x instanceof Vec3) {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		this.x += x;
		this.y += y;
	}
	subXY(x, y) {
		if (x instanceof Vec3) {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		this.x -= x;
		this.y -= y;
	}
	mulXY(x, y) {
		if (x instanceof Vec3) {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		this.x *= x;
		this.y *= y;
	}
	divXY(x, y) {
		if (x instanceof Vec3) {
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		this.x /= x;
		this.y /= y;
	}
	get length() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
	}
	normalize() {
		let l = this.length;
		if (l !== 0) {
			l = 1 / l;
			this.x *= l;
			this.y *= l;
			this.z *= l;
		}
	}
	toString(fractionDigits=-1) {
		if (fractionDigits > -1) return `(${this.x.toFixed(fractionDigits)}, ${this.y.toFixed(fractionDigits)}, ${this.z.toFixed(fractionDigits)})`;
		return `(${this.x}, ${this.y}, ${this.z})`;
	}
	equal(v) {
		return (this.x === v.x &&
				this.y === v.y &&
				this.z === v.z);
	}
	static distance(v1, v2) {
		return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x) + (v2.y-v1.y)*(v2.y-v1.y) + (v2.z-v1.z)*(v2.z-v1.z));
	}
	static add(v1, v2) {
		if (typeof v2 === 'number') return new Vec3(v1.x+v2, v1.y+v2, v1.z+v2);
		return new Vec3(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
	}
	static sub(v1, v2) {
		if (typeof v2 === 'number') return new Vec3(v1.x-v2, v1.y-v2, v1.z-v2);
		return new Vec3(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z);
	}
	static mul(v1, v2) {
		if (typeof v2 === 'number') return new Vec3(v1.x*v2, v1.y*v2, v1.z*v2);
		return new Vec3(v1.x*v2.x, v1.y*v2.y, v1.z*v2.z);
	}
	static div(v1, v2) {
		if (typeof v2 === 'number') return new Vec3(v1.x/v2, v1.y/v2, v1.z/v2);
		return new Vec3(v1.x/v2.x, v1.y/v2.y, v1.z/v2.z);
	}
	static dot(v1, v2) {
		return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
	}
	static cross(v1, v2) {
		return new Vec3(
			v1.y * v2.z - v1.z * v2.y,
			v1.z * v2.x - v1.x * v2.z,
			v1.x * v2.y - v1.y * v2.x
		);
	}
	static random(x=1, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		if (y === undefined) y = x;
		if (z === undefined) z = x;
		return new Vec3(Math.range(-x, x), Math.range(-y, y), Math.range(-z, z));
	}
	static get up() {
		return new Vec3(0, 1, 0);
	}
	static get forward() {
		return new Vec3(0, 0, 1);
	}
	static get right() {
		return new Vec3(1, 0, 0);
	}
	static get zero() {
		return new Vec3(0, 0, 0);
	}
	// #### From javid #####
	// https://github.com/OneLoneCoder/videos/blob/master/OneLoneCoder_olcEngine3D_Part3.cpp
	static intersectPlane(plane_p, plane_n, lineStart, lineEnd)
	{
		plane_n.normalize();
		const plane_d = -Vec3.dot(plane_n, plane_p);
		const ad = Vec3.dot(lineStart, plane_n);
		const bd = Vec3.dot(lineEnd, plane_n);
		const t = (-plane_d - ad) / (bd - ad);
		const lineStartToEnd = Vec3.sub(lineEnd, lineStart);
		const lineToIntersect = Vec3.mul(lineStartToEnd, t);
		return Vec3.add(lineStart, lineToIntersect);
	}
	// #####################
	static normalize(i) {
		const v = i.clone();
		v.normalize();
		return v;
	}
}

class Triangle {
	/**
	 * @param {object} points Array of `Vec3`.
	 */
	constructor(points) {
		this.p = points || [Vec3.zero, Vec3.zero, Vec3.zero];
		this.c = 0;
		this.dp = 0;
		this.depth = 0;
		this.meshReference = null;
	}

	clone() {
		const t = new Triangle([
			this.p[0].clone(),
			this.p[1].clone(),
			this.p[2].clone()
		]);
		t.c = this.c;
		t.dp = this.dp;
		t.depth = this.depth;
		t.meshReference = this.meshReference;
		return t;
	}

	onAllPoints(fn) {
		for (let i = 0; i < 3; i++) {
			fn(this.p[i]);
		}
	}

	calculateDepth() {
		this.depth =  (this.p[0].z + this.p[1].z + this.p[2].z) * 0.3333333333333333;
	}

	contains(p) {
		const a = this.p[0];
		const b = this.p[1];
		const c = this.p[2];
		const w1 = (a.x*(c.y-a.y) + (p.y-a.y)*(c.x-a.x) - p.x*(c.y-a.y)) / ((b.y-a.y)*(c.x-a.x) - (b.x-a.x)*(c.y-a.y));
		const w2 = (p.y - a.y - w1*(b.y-a.y)) / (c.y-a.y);
		return (w1 >= 0 && w2 >= 0 && ((w1+w2) <= 1));
	}

	get A() {
		return this.p[0];
	}

	get B() {
		return this.p[1];
	}

	get C() {
		return this.p[2];
	}

	static drawPath(t) {
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(t.p[0].x, t.p[0].y);
		Draw.CTX.lineTo(t.p[1].x, t.p[1].y);
		Draw.CTX.lineTo(t.p[2].x, t.p[2].y);
		Draw.CTX.closePath();
	}

	static draw(t) {
		Triangle.drawPath(t);
		Draw.setColor(t.c);
		Draw.CTX.fill();
		Draw.CTX.stroke();
		if (showOutline) {
			Draw.CTX.strokeStyle = C.black;
			Draw.CTX.stroke();
		}
	}

	static draw2(t) {
		Triangle.drawPath(t);
		Draw.setAlpha(0.5);
		Draw.setColor(t.c);
		Draw.CTX.fill();
		Draw.CTX.stroke();
		Draw.setAlpha(1);
	}

	// #### From javid #####
	// https://github.com/OneLoneCoder/videos/blob/master/OneLoneCoder_olcEngine3D_Part3.cpp
	static clipAgainstPlane(plane_p, plane_n, in_tri, out_tris)
	{
		plane_n.normalize();

		const dist = (p) => {
			// const n = Vec3.normalize(p);
			return (Vec3.dot(plane_n, p) - Vec3.dot(plane_n, plane_p));
		};

		const inside_points = []; let nInsidePointCount = 0;
		const outside_points = []; let nOutsidePointCount = 0;

		const d0 = dist(in_tri.p[0]);
		const d1 = dist(in_tri.p[1]);
		const d2 = dist(in_tri.p[2]);

		if (d0 >= 0) { inside_points[nInsidePointCount++] = in_tri.p[0]; }
		else { outside_points[nOutsidePointCount++] = in_tri.p[0]; }
		if (d1 >= 0) { inside_points[nInsidePointCount++] = in_tri.p[1]; }
		else { outside_points[nOutsidePointCount++] = in_tri.p[1]; }
		if (d2 >= 0) { inside_points[nInsidePointCount++] = in_tri.p[2]; }
		else { outside_points[nOutsidePointCount++] = in_tri.p[2]; }

		if (nInsidePointCount == 0) {
			return 0;
		}

		if (nInsidePointCount == 3) {
			out_tris[0] = in_tri;
			return 1;
		}

		if (nInsidePointCount == 1 && nOutsidePointCount == 2) {
			out_tris[0].c = debugClipping? C.blue : in_tri.c;
			out_tris[0].dp = in_tri.dp;
			out_tris[0].meshReference = in_tri.meshReference;
			out_tris[0].p[0] = inside_points[0];
			out_tris[0].p[1] = Vec3.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);
			out_tris[0].p[2] = Vec3.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[1]);
			return 1;
		}

		if (nInsidePointCount == 2 && nOutsidePointCount == 1)
		{
			out_tris[0].c = debugClipping? C.blue : in_tri.c;
			out_tris[0].dp = in_tri.dp;
			out_tris[0].meshReference = in_tri.meshReference;
			out_tris[1].c = debugClipping? C.red : in_tri.c;
			out_tris[1].dp = in_tri.dp;
			out_tris[1].meshReference = in_tri.meshReference;
			out_tris[0].p[0] = inside_points[0];
			out_tris[0].p[1] = inside_points[1];
			out_tris[0].p[2] = Vec3.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);
			out_tris[1].p[0] = inside_points[1];
			out_tris[1].p[1] = out_tris[0].p[2];
			out_tris[1].p[2] = Vec3.intersectPlane(plane_p, plane_n, inside_points[1], outside_points[0]);
			return 2;
		}
	}
	// #####################
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

	static multiplyVector(m, i) {
		let v = new Vec3();
		v.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + i.w * m.m[3][0];
		v.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + i.w * m.m[3][1];
		v.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + i.w * m.m[3][2];
		v.w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + i.w * m.m[3][3];
		return v;
	}

	static multiplyMatrix(m1, m2) {
		const m = new Mat4();
		for (let c = 0; c < 4; c++) {
			for (let r = 0; r < 4; r++) {
				m.m[r][c] = m1.m[r][0] * m2.m[0][c] + m1.m[r][1] * m2.m[1][c] + m1.m[r][2] * m2.m[2][c] + m1.m[r][3] * m2.m[3][c];
			}
		}
		return m;
	}

	static makeIdentity() {
		const m = new Mat4();
		m.m[0][0] = 1;
		m.m[1][1] = 1;
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		return m;
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

	static makeTranslation(x, y, z) {
		if (x instanceof Vec3) {
			z = x.z;
			y = x.y;
			x = x.x;
		}
		const m = new Mat4();
		m.m[0][0] = 1;
		m.m[1][1] = 1;
		m.m[2][2] = 1;
		m.m[3][3] = 1;
		m.m[3][0] = x;
		m.m[3][1] = y;
		m.m[3][2] = z;
		return m;
	}

	static makeWorld(transform) {
		const matRotZ = Mat4.makeRotationZ(transform.rotation.z);
		const matRotX = Mat4.makeRotationX(transform.rotation.x);
		const matRotY = Mat4.makeRotationY(transform.rotation.y);
		const matTrans = Mat4.makeTranslation(transform.position);
		const matWorld = Mat4.multiplyMatrix(Mat4.multiplyMatrix(Mat4.multiplyMatrix(matRotZ, matRotX), matRotY), matTrans);
		return matWorld;
	}

	// #############################################################################################################################
	// Code taken from https://github.com/OneLoneCoder/videos/blob/master/OneLoneCoder_olcEngine3D_Part3.cpp
	// Author
	// ~~~~~~
	// Twitter: @javidx9
	// Blog: http://www.onelonecoder.com
	// Discord: https://discord.gg/WhwHUMV
	static pointAt(pos, target, up)
	{
		// Calculate new forward direction
		const newForward = Vec3.sub(target, pos); newForward.normalize();
		// Calculate new Up direction
		const newUp = Vec3.sub(up, Vec3.mul(newForward, Vec3.dot(up, newForward))); newUp.normalize();
		// New Right direction is easy, its just cross product
		const newRight = Vec3.cross(newUp, newForward);
		// Construct Dimensioning and Translation Matrix
		const m = new Mat4();
		m.m[0][0] = newRight.x;		m.m[0][1] = newRight.y;		m.m[0][2] = newRight.z;		m.m[0][3] = 0;
		m.m[1][0] = newUp.x;		m.m[1][1] = newUp.y;		m.m[1][2] = newUp.z;		m.m[1][3] = 0;
		m.m[2][0] = newForward.x;	m.m[2][1] = newForward.y;	m.m[2][2] = newForward.z;	m.m[2][3] = 0;
		m.m[3][0] = pos.x;			m.m[3][1] = pos.y;			m.m[3][2] = pos.z;			m.m[3][3] = 1;
		return m;
	}

	static quickInverse(m) // Only for Rotation/Translation Matrices
	{
		const matrix = new Mat4();
		matrix.m[0][0] = m.m[0][0]; matrix.m[0][1] = m.m[1][0]; matrix.m[0][2] = m.m[2][0]; matrix.m[0][3] = 0;
		matrix.m[1][0] = m.m[0][1]; matrix.m[1][1] = m.m[1][1]; matrix.m[1][2] = m.m[2][1]; matrix.m[1][3] = 0;
		matrix.m[2][0] = m.m[0][2]; matrix.m[2][1] = m.m[1][2]; matrix.m[2][2] = m.m[2][2]; matrix.m[2][3] = 0;
		matrix.m[3][0] = -(m.m[3][0] * matrix.m[0][0] + m.m[3][1] * matrix.m[1][0] + m.m[3][2] * matrix.m[2][0]);
		matrix.m[3][1] = -(m.m[3][0] * matrix.m[0][1] + m.m[3][1] * matrix.m[1][1] + m.m[3][2] * matrix.m[2][1]);
		matrix.m[3][2] = -(m.m[3][0] * matrix.m[0][2] + m.m[3][1] * matrix.m[1][2] + m.m[3][2] * matrix.m[2][2]);
		matrix.m[3][3] = 1;
		return matrix;
	}
	// End of code
	// #############################################################################################################################
}

class Mesh {
	/**
	 * @param {object} tris Array of `Triangle`.
	 */
	constructor(tris=[]) {
		this.id = Math.random().toString(36).substr(2, 9);
		this.tris = tris;
		this.transform = {
			position: new Vec3(0, 0, 0),
			rotation: new Vec3(0, 0, 0)
		};
		this.name = '';
		this.assignMeshReference();
		this.grabbable = false;
	}

	onGrab() {}

	scale(s) {
		for (let i = this.tris.length - 1; i >= 0; --i) {
			const tri = this.tris[i];
			tri.onAllPoints((p) => {
				p.mul(s);
			});
		}
	}

	contains(p) {
		return p.z > this.transform.position.z && p.x > -0.5 && p.x < 0.5 && p.y > -0.5 && p.y < 0.5;
	}

	applyTransform() {
		for (let i = this.tris.length - 1; i >= 0; --i) {
			const tri = this.tris[i];
			let matWorld = Mat4.makeWorld(this.transform);
			tri.p[0] = Mat4.multiplyVector(matWorld, tri.p[0]);
			tri.p[1] = Mat4.multiplyVector(matWorld, tri.p[1]);
			tri.p[2] = Mat4.multiplyVector(matWorld, tri.p[2]);
		}

		this.transform.position.reset();
		this.transform.rotation.reset();
	}

	loadFromFile(fileText) {
		this.tris.length = 0;

		const vertices = [];
		const words = fileText.split(/\s/);

		const get = () => {
			return +words.shift();
		};

		while (words.length > 0) {
			switch (words.shift()) {
				case 'v': vertices.push(new Vec3(get(), get(), get())); break;
				case 'f': this.tris.push(new Triangle([vertices[get()-1], vertices[get()-1], vertices[get()-1]])); break;
			}
		}

		this.assignMeshReference();
	}

	assignMeshReference() {
		for (let i = this.tris.length - 1; i >= 0; --i) {
			this.tris[i].meshReference = this;
		}
	}

	static LoadFromFile(fileText) {
		const m = new Mesh();
		m.loadFromFile(fileText);
		return m;
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
			// new Triangle([new Vec3(x, xx, xx), new Vec3(xx, xx * 0.5, xx), new Vec3(0, xx, xx)])
		]);

		// Center the cube
		m.transform.position.add(-x * 0.5);
		m.applyTransform();

		return m;
	}

	/**
	 * Returns a floor mesh with given size `x` by `x`.
	 * @param {number} [x=1] The floor size.
	 */

	static makeFloor(x=1) {
		const xx = x * 0.5;
		const m = new Mesh([
			new Triangle([new Vec3(-xx, 0, -xx), new Vec3(-xx, 0, xx), new Vec3(xx, 0, xx)]),
			new Triangle([new Vec3(-xx, 0, -xx), new Vec3(xx, 0, xx), new Vec3(xx, 0, -xx)])
		]);
		return m;
	}

	static makeTorusLarge() {
		return Mesh.LoadFromFile(`# Blender v2.90.1 OBJ File: '' # www.blender.org o Cube v 2.560000 0.000000 0.000000 v 2.500000 -0.103923 0.000000 v 2.380000 -0.103923 0.000000 v 2.320000 -0.000000 0.000000 v 2.380000 0.103923 0.000000 v 2.500000 0.103923 0.000000 v 2.217025 0.000000 1.280000 v 2.165063 -0.103923 1.250000 v 2.061140 -0.103923 1.190000 v 2.009179 -0.000000 1.160000 v 2.061140 0.103923 1.190000 v 2.165063 0.103923 1.250000 v 1.280000 0.000000 2.217025 v 1.250000 -0.103923 2.165064 v 1.190000 -0.103923 2.061141 v 1.160000 -0.000000 2.009179 v 1.190000 0.103923 2.061141 v 1.250000 0.103923 2.165064 v 0.000000 0.000000 2.560000 v 0.000000 -0.103923 2.500000 v 0.000000 -0.103923 2.380000 v 0.000000 -0.000000 2.320000 v 0.000000 0.103923 2.380000 v 0.000000 0.103923 2.500000 v -1.280000 0.000000 2.217025 v -1.250000 -0.103923 2.165064 v -1.190000 -0.103923 2.061141 v -1.160000 -0.000000 2.009179 v -1.190000 0.103923 2.061141 v -1.250000 0.103923 2.165064 v -2.217025 0.000000 1.280001 v -2.165063 -0.103923 1.250001 v -2.061140 -0.103923 1.190001 v -2.009179 -0.000000 1.160001 v -2.061140 0.103923 1.190001 v -2.165063 0.103923 1.250001 v -2.560000 0.000000 0.000000 v -2.500000 -0.103923 0.000000 v -2.380000 -0.103923 0.000000 v -2.320000 -0.000000 0.000000 v -2.380000 0.103923 0.000000 v -2.500000 0.103923 0.000000 v -2.217025 0.000000 -1.279999 v -2.165064 -0.103923 -1.250000 v -2.061141 -0.103923 -1.190000 v -2.009179 -0.000000 -1.160000 v -2.061141 0.103923 -1.190000 v -2.165064 0.103923 -1.250000 v -1.280000 0.000000 -2.217025 v -1.250000 -0.103923 -2.165064 v -1.190000 -0.103923 -2.061141 v -1.160000 -0.000000 -2.009179 v -1.190000 0.103923 -2.061141 v -1.250000 0.103923 -2.165064 v 0.000000 0.000000 -2.560000 v 0.000000 -0.103923 -2.500000 v 0.000000 -0.103923 -2.380000 v 0.000000 -0.000000 -2.320000 v 0.000000 0.103923 -2.380000 v 0.000000 0.103923 -2.500000 v 1.280000 0.000000 -2.217025 v 1.250000 -0.103923 -2.165064 v 1.190000 -0.103923 -2.061141 v 1.160000 -0.000000 -2.009179 v 1.190000 0.103923 -2.061141 v 1.250000 0.103923 -2.165064 v 2.217025 0.000000 -1.280000 v 2.165063 -0.103923 -1.250000 v 2.061140 -0.103923 -1.190000 v 2.009179 -0.000000 -1.160000 v 2.061140 0.103923 -1.190000 v 2.165063 0.103923 -1.250000 s off f 1 8 2 f 2 9 3 f 3 10 4 f 10 5 4 f 5 12 6 f 12 1 6 f 13 8 7 f 8 15 9 f 9 16 10 f 16 11 10 f 11 18 12 f 12 13 7 f 19 14 13 f 14 21 15 f 21 16 15 f 22 17 16 f 17 24 18 f 24 13 18 f 25 20 19 f 26 21 20 f 27 22 21 f 28 23 22 f 29 24 23 f 30 19 24 f 31 26 25 f 26 33 27 f 27 34 28 f 34 29 28 f 29 36 30 f 30 31 25 f 37 32 31 f 38 33 32 f 39 34 33 f 40 35 34 f 41 36 35 f 42 31 36 f 43 38 37 f 44 39 38 f 45 40 39 f 46 41 40 f 47 42 41 f 48 37 42 f 49 44 43 f 50 45 44 f 51 46 45 f 46 53 47 f 53 48 47 f 48 49 43 f 55 50 49 f 50 57 51 f 57 52 51 f 52 59 53 f 59 54 53 f 54 55 49 f 61 56 55 f 62 57 56 f 57 64 58 f 64 59 58 f 65 60 59 f 66 55 60 f 67 62 61 f 62 69 63 f 69 64 63 f 64 71 65 f 71 66 65 f 66 67 61 f 1 68 67 f 2 69 68 f 3 70 69 f 4 71 70 f 5 72 71 f 6 67 72 f 1 7 8 f 2 8 9 f 3 9 10 f 10 11 5 f 5 11 12 f 12 7 1 f 13 14 8 f 8 14 15 f 9 15 16 f 16 17 11 f 11 17 18 f 12 18 13 f 19 20 14 f 14 20 21 f 21 22 16 f 22 23 17 f 17 23 24 f 24 19 13 f 25 26 20 f 26 27 21 f 27 28 22 f 28 29 23 f 29 30 24 f 30 25 19 f 31 32 26 f 26 32 33 f 27 33 34 f 34 35 29 f 29 35 36 f 30 36 31 f 37 38 32 f 38 39 33 f 39 40 34 f 40 41 35 f 41 42 36 f 42 37 31 f 43 44 38 f 44 45 39 f 45 46 40 f 46 47 41 f 47 48 42 f 48 43 37 f 49 50 44 f 50 51 45 f 51 52 46 f 46 52 53 f 53 54 48 f 48 54 49 f 55 56 50 f 50 56 57 f 57 58 52 f 52 58 59 f 59 60 54 f 54 60 55 f 61 62 56 f 62 63 57 f 57 63 64 f 64 65 59 f 65 66 60 f 66 61 55 f 67 68 62 f 62 68 69 f 69 70 64 f 64 70 71 f 71 72 66 f 66 72 67 f 1 2 68 f 2 3 69 f 3 4 70 f 4 5 71 f 5 6 72 f 6 1 67`);
	}

	static makeTorusMedium() {
		return Mesh.LoadFromFile(`# Blender v2.90.1 OBJ File: '' # www.blender.org o Cube v 2.048000 0.000000 0.000000 v 2.000000 -0.083138 0.000000 v 1.904000 -0.083138 0.000000 v 1.856000 -0.000000 0.000000 v 1.904000 0.083138 0.000000 v 2.000000 0.083138 0.000000 v 1.773620 0.000000 1.024000 v 1.732051 -0.083138 1.000000 v 1.648912 -0.083138 0.952000 v 1.607343 -0.000000 0.928000 v 1.648912 0.083138 0.952000 v 1.732051 0.083138 1.000000 v 1.024000 0.000000 1.773620 v 1.000000 -0.083138 1.732051 v 0.952000 -0.083138 1.648913 v 0.928000 -0.000000 1.607343 v 0.952000 0.083138 1.648913 v 1.000000 0.083138 1.732051 v 0.000000 0.000000 2.048000 v 0.000000 -0.083138 2.000000 v 0.000000 -0.083138 1.904000 v 0.000000 -0.000000 1.856000 v 0.000000 0.083138 1.904000 v 0.000000 0.083138 2.000000 v -1.024000 0.000000 1.773620 v -1.000000 -0.083138 1.732051 v -0.952000 -0.083138 1.648913 v -0.928000 -0.000000 1.607344 v -0.952000 0.083138 1.648913 v -1.000000 0.083138 1.732051 v -1.773620 0.000000 1.024001 v -1.732051 -0.083138 1.000000 v -1.648912 -0.083138 0.952000 v -1.607343 -0.000000 0.928001 v -1.648912 0.083138 0.952000 v -1.732051 0.083138 1.000000 v -2.048000 0.000000 0.000000 v -2.000000 -0.083138 0.000000 v -1.904000 -0.083138 0.000000 v -1.856000 -0.000000 0.000000 v -1.904000 0.083138 0.000000 v -2.000000 0.083138 0.000000 v -1.773620 0.000000 -1.024000 v -1.732051 -0.083138 -1.000000 v -1.648913 -0.083138 -0.952000 v -1.607344 -0.000000 -0.928000 v -1.648913 0.083138 -0.952000 v -1.732051 0.083138 -1.000000 v -1.024000 0.000000 -1.773620 v -1.000000 -0.083138 -1.732051 v -0.952000 -0.083138 -1.648913 v -0.928000 -0.000000 -1.607343 v -0.952000 0.083138 -1.648913 v -1.000000 0.083138 -1.732051 v 0.000000 0.000000 -2.048000 v 0.000000 -0.083138 -2.000000 v 0.000000 -0.083138 -1.904000 v 0.000000 -0.000000 -1.856000 v 0.000000 0.083138 -1.904000 v 0.000000 0.083138 -2.000000 v 1.024000 0.000000 -1.773620 v 1.000000 -0.083138 -1.732051 v 0.952000 -0.083138 -1.648913 v 0.928000 -0.000000 -1.607343 v 0.952000 0.083138 -1.648913 v 1.000000 0.083138 -1.732051 v 1.773620 0.000000 -1.024000 v 1.732051 -0.083138 -1.000000 v 1.648912 -0.083138 -0.952000 v 1.607343 -0.000000 -0.928000 v 1.648912 0.083138 -0.952000 v 1.732051 0.083138 -1.000000 s off f 7 2 1 f 8 3 2 f 3 10 4 f 4 11 5 f 11 6 5 f 12 1 6 f 7 14 8 f 14 9 8 f 15 10 9 f 16 11 10 f 11 18 12 f 12 13 7 f 19 14 13 f 20 15 14 f 15 22 16 f 22 17 16 f 17 24 18 f 18 19 13 f 25 20 19 f 26 21 20 f 21 28 22 f 28 23 22 f 29 24 23 f 30 19 24 f 31 26 25 f 32 27 26 f 33 28 27 f 34 29 28 f 29 36 30 f 36 25 30 f 37 32 31 f 38 33 32 f 39 34 33 f 40 35 34 f 41 36 35 f 42 31 36 f 43 38 37 f 44 39 38 f 45 40 39 f 40 47 41 f 47 42 41 f 48 37 42 f 49 44 43 f 50 45 44 f 51 46 45 f 46 53 47 f 53 48 47 f 54 43 48 f 49 56 50 f 56 51 50 f 57 52 51 f 58 53 52 f 59 54 53 f 54 55 49 f 61 56 55 f 62 57 56 f 63 58 57 f 64 59 58 f 65 60 59 f 60 61 55 f 67 62 61 f 68 63 62 f 69 64 63 f 70 65 64 f 65 72 66 f 66 67 61 f 1 68 67 f 2 69 68 f 3 70 69 f 4 71 70 f 5 72 71 f 6 67 72 f 7 8 2 f 8 9 3 f 3 9 10 f 4 10 11 f 11 12 6 f 12 7 1 f 7 13 14 f 14 15 9 f 15 16 10 f 16 17 11 f 11 17 18 f 12 18 13 f 19 20 14 f 20 21 15 f 15 21 22 f 22 23 17 f 17 23 24 f 18 24 19 f 25 26 20 f 26 27 21 f 21 27 28 f 28 29 23 f 29 30 24 f 30 25 19 f 31 32 26 f 32 33 27 f 33 34 28 f 34 35 29 f 29 35 36 f 36 31 25 f 37 38 32 f 38 39 33 f 39 40 34 f 40 41 35 f 41 42 36 f 42 37 31 f 43 44 38 f 44 45 39 f 45 46 40 f 40 46 47 f 47 48 42 f 48 43 37 f 49 50 44 f 50 51 45 f 51 52 46 f 46 52 53 f 53 54 48 f 54 49 43 f 49 55 56 f 56 57 51 f 57 58 52 f 58 59 53 f 59 60 54 f 54 60 55 f 61 62 56 f 62 63 57 f 63 64 58 f 64 65 59 f 65 66 60 f 60 66 61 f 67 68 62 f 68 69 63 f 69 70 64 f 70 71 65 f 65 71 72 f 66 72 67 f 1 2 68 f 2 3 69 f 3 4 70 f 4 5 71 f 5 6 72 f 6 1 67`);
	}

	static makeTorusSmall() {
		return Mesh.LoadFromFile(`# Blender v2.90.1 OBJ File: '' # www.blender.org o Cube v 1.638400 0.000000 0.000000 v 1.600000 -0.066511 0.000000 v 1.523200 -0.066511 0.000000 v 1.484800 -0.000000 0.000000 v 1.523200 0.066511 0.000000 v 1.600000 0.066511 0.000000 v 1.418896 0.000000 0.819200 v 1.385641 -0.066511 0.800000 v 1.319130 -0.066511 0.761600 v 1.285874 -0.000000 0.742400 v 1.319130 0.066511 0.761600 v 1.385641 0.066511 0.800000 v 0.819200 0.000000 1.418896 v 0.800000 -0.066511 1.385641 v 0.761600 -0.066511 1.319130 v 0.742400 -0.000000 1.285875 v 0.761600 0.066511 1.319130 v 0.800000 0.066511 1.385641 v 0.000000 0.000000 1.638400 v 0.000000 -0.066511 1.600000 v 0.000000 -0.066511 1.523200 v 0.000000 -0.000000 1.484800 v 0.000000 0.066511 1.523200 v 0.000000 0.066511 1.600000 v -0.819200 0.000000 1.418896 v -0.800000 -0.066511 1.385641 v -0.761600 -0.066511 1.319130 v -0.742400 -0.000000 1.285875 v -0.761600 0.066511 1.319130 v -0.800000 0.066511 1.385641 v -1.418896 0.000000 0.819200 v -1.385641 -0.066511 0.800000 v -1.319130 -0.066511 0.761600 v -1.285874 -0.000000 0.742400 v -1.319130 0.066511 0.761600 v -1.385641 0.066511 0.800000 v -1.638400 0.000000 0.000000 v -1.600000 -0.066511 0.000000 v -1.523200 -0.066511 0.000000 v -1.484800 -0.000000 0.000000 v -1.523200 0.066511 0.000000 v -1.600000 0.066511 0.000000 v -1.418896 0.000000 -0.819200 v -1.385641 -0.066511 -0.800000 v -1.319130 -0.066511 -0.761600 v -1.285875 -0.000000 -0.742400 v -1.319130 0.066511 -0.761600 v -1.385641 0.066511 -0.800000 v -0.819200 0.000000 -1.418896 v -0.800000 -0.066511 -1.385641 v -0.761600 -0.066511 -1.319130 v -0.742400 -0.000000 -1.285875 v -0.761600 0.066511 -1.319130 v -0.800000 0.066511 -1.385641 v 0.000000 0.000000 -1.638400 v 0.000000 -0.066511 -1.600000 v 0.000000 -0.066511 -1.523200 v 0.000000 -0.000000 -1.484800 v 0.000000 0.066511 -1.523200 v 0.000000 0.066511 -1.600000 v 0.819200 0.000000 -1.418896 v 0.800000 -0.066511 -1.385641 v 0.761600 -0.066511 -1.319130 v 0.742400 -0.000000 -1.285875 v 0.761600 0.066511 -1.319130 v 0.800000 0.066511 -1.385641 v 1.418896 0.000000 -0.819200 v 1.385641 -0.066511 -0.800000 v 1.319130 -0.066511 -0.761600 v 1.285874 -0.000000 -0.742400 v 1.319130 0.066511 -0.761600 v 1.385641 0.066511 -0.800000 s off f 7 2 1 f 8 3 2 f 9 4 3 f 10 5 4 f 11 6 5 f 12 1 6 f 7 14 8 f 14 9 8 f 15 10 9 f 16 11 10 f 11 18 12 f 18 7 12 f 19 14 13 f 20 15 14 f 21 16 15 f 22 17 16 f 23 18 17 f 24 13 18 f 25 20 19 f 26 21 20 f 21 28 22 f 28 23 22 f 23 30 24 f 24 25 19 f 31 26 25 f 32 27 26 f 33 28 27 f 34 29 28 f 29 36 30 f 36 25 30 f 37 32 31 f 38 33 32 f 39 34 33 f 40 35 34 f 41 36 35 f 42 31 36 f 43 38 37 f 44 39 38 f 45 40 39 f 46 41 40 f 47 42 41 f 48 37 42 f 43 50 44 f 44 51 45 f 51 46 45 f 52 47 46 f 47 54 48 f 48 49 43 f 55 50 49 f 50 57 51 f 51 58 52 f 58 53 52 f 59 54 53 f 60 49 54 f 61 56 55 f 56 63 57 f 63 58 57 f 64 59 58 f 65 60 59 f 66 55 60 f 67 62 61 f 62 69 63 f 69 64 63 f 64 71 65 f 71 66 65 f 72 61 66 f 1 68 67 f 2 69 68 f 3 70 69 f 4 71 70 f 5 72 71 f 6 67 72 f 7 8 2 f 8 9 3 f 9 10 4 f 10 11 5 f 11 12 6 f 12 7 1 f 7 13 14 f 14 15 9 f 15 16 10 f 16 17 11 f 11 17 18 f 18 13 7 f 19 20 14 f 20 21 15 f 21 22 16 f 22 23 17 f 23 24 18 f 24 19 13 f 25 26 20 f 26 27 21 f 21 27 28 f 28 29 23 f 23 29 30 f 24 30 25 f 31 32 26 f 32 33 27 f 33 34 28 f 34 35 29 f 29 35 36 f 36 31 25 f 37 38 32 f 38 39 33 f 39 40 34 f 40 41 35 f 41 42 36 f 42 37 31 f 43 44 38 f 44 45 39 f 45 46 40 f 46 47 41 f 47 48 42 f 48 43 37 f 43 49 50 f 44 50 51 f 51 52 46 f 52 53 47 f 47 53 54 f 48 54 49 f 55 56 50 f 50 56 57 f 51 57 58 f 58 59 53 f 59 60 54 f 60 55 49 f 61 62 56 f 56 62 63 f 63 64 58 f 64 65 59 f 65 66 60 f 66 61 55 f 67 68 62 f 62 68 69 f 69 70 64 f 64 70 71 f 71 72 66 f 72 67 61 f 1 2 68 f 2 3 69 f 3 4 70 f 4 5 71 f 5 6 72 f 6 1 67`);
	}

	static makeBullet() {
		return Mesh.LoadFromFile('v 0.05 -0.05 -0.1 v 0.05 0.05 -0.1 v 0.02 -0.02 0.1 v 0.02 0.02 0.1 v -0.05 -0.05 -0.1 v -0.05 0.05 -0.1 v -0.02 -0.02 0.1 v -0.02 0.02 0.1 f 2 3 1 f 4 7 3 f 8 5 7 f 6 1 5 f 7 1 3 f 4 6 8 f 2 4 3 f 4 8 7 f 8 6 5 f 6 2 1 f 7 5 1 f 4 2 6');
	}

	static makeMonkeyAward() {
		return Mesh.LoadFromFile(`
			v -0.532635 0.644058 0.523266 v -1.000000 0.100000 1.015029 v -0.532635 0.644058 -0.597614 v -1.000000 0.100000 -1.089377 v 0.532635 0.644058 0.523266 v 1.000000 0.100000 1.015029 v 0.532635 0.644058 -0.597614 v 1.000000 0.100000 -1.089377 v -0.532635 2.149198 -0.608446 v 0.532635 2.149198 -0.608446 v -0.532635 2.149198 0.534098 v 0.532635 2.149198 0.534098 v -0.451086 3.395119 -0.812985 v 0.423914 3.395119 -0.812985 v -0.513586 3.324807 -0.734860 v 0.486414 3.324807 -0.734860 v -0.560461 3.285744 -0.625485 v 0.533289 3.285744 -0.625485 v -0.365149 3.207619 -0.664548 v 0.337976 3.207619 -0.664548 v -0.365149 3.262307 -0.766110 v 0.337976 3.262307 -0.766110 v -0.365149 3.363869 -0.828610 v 0.337976 3.363869 -0.828610 v -0.287024 3.395119 -0.844235 v 0.259851 3.395119 -0.844235 v -0.216711 3.324807 -0.789548 v 0.189539 3.324807 -0.789548 v -0.169836 3.285744 -0.695798 v 0.142664 3.285744 -0.695798 v -0.091711 3.473244 -0.703610 v 0.064539 3.473244 -0.703610 v -0.154211 3.473244 -0.789548 v 0.127039 3.473244 -0.789548 v -0.255774 3.473244 -0.844235 v 0.228601 3.473244 -0.844235 v -0.287024 3.559182 -0.844235 v 0.259851 3.559182 -0.844235 v -0.216711 3.621682 -0.789548 v 0.189539 3.621682 -0.789548 v -0.169836 3.668557 -0.695798 v 0.142664 3.668557 -0.695798 v -0.365149 3.746682 -0.664548 v 0.337976 3.746682 -0.664548 v -0.365149 3.684182 -0.766110 v 0.337976 3.684182 -0.766110 v -0.365149 3.590432 -0.828610 v 0.337976 3.590432 -0.828610 v -0.451086 3.559182 -0.812985 v 0.423914 3.559182 -0.812985 v -0.513586 3.621682 -0.734860 v 0.486414 3.621682 -0.734860 v -0.560461 3.668557 -0.625485 v 0.533289 3.668557 -0.625485 v -0.638586 3.473244 -0.609860 v 0.611414 3.473244 -0.609860 v -0.576086 3.473244 -0.719235 v 0.548914 3.473244 -0.719235 v -0.482336 3.473244 -0.805173 v 0.455164 3.473244 -0.805173 v -0.490149 3.473244 -0.820798 v 0.462976 3.473244 -0.820798 v -0.458899 3.566994 -0.828610 v 0.431726 3.566994 -0.828610 v -0.365149 3.606057 -0.852048 v 0.337976 3.606057 -0.852048 v -0.279211 3.566994 -0.867673 v 0.252039 3.566994 -0.867673 v -0.240149 3.473244 -0.867673 v 0.212976 3.473244 -0.867673 v -0.279211 3.387307 -0.867673 v 0.252039 3.387307 -0.867673 v -0.365149 3.473244 -0.875485 v 0.337976 3.473244 -0.875485 v -0.365149 3.348244 -0.852048 v 0.337976 3.348244 -0.852048 v -0.458899 3.387307 -0.828610 v 0.431726 3.387307 -0.828610 v -0.013586 3.660744 -0.789548 v -0.013586 3.582619 -0.867673 v -0.013586 2.196142 -1.304730 v -0.013586 2.910744 -0.828610 v -0.013586 3.043557 -0.844235 v -0.013586 2.113039 -1.350850 v -0.013586 3.637307 -0.648923 v -0.013586 3.801369 -0.617673 v -0.013586 4.129494 0.499515 v -0.013586 3.793557 0.804202 v -0.013586 3.301369 0.780765 v -0.013586 2.848244 0.304202 v -0.216711 3.043557 -0.609860 v 0.189539 3.043557 -0.609860 v -0.326086 2.283591 -1.025581 v 0.298914 2.283591 -1.025581 v -0.365149 2.081801 -1.186043 v 0.337976 2.081801 -1.186043 v -0.380774 1.904617 -1.277031 v 0.353601 1.904617 -1.277031 v -0.341711 1.856950 -1.304953 v 0.314539 1.856950 -1.304953
			v -0.193274 1.858056 -1.344000 v 0.166101 1.858056 -1.344000 v -0.013586 1.860414 -1.372070 v -0.451086 3.090432 -0.578610 v 0.423914 3.090432 -0.578610 v -0.646399 3.191994 -0.586423 v 0.619226 3.191994 -0.586423 v -0.841711 3.379494 -0.492673 v 0.814539 3.379494 -0.492673 v -0.872961 3.660744 -0.641110 v 0.845789 3.660744 -0.641110 v -0.724524 3.715432 -0.672360 v 0.697351 3.715432 -0.672360 v -0.505774 3.832619 -0.734860 v 0.478601 3.832619 -0.734860 v -0.333899 3.988869 -0.781735 v 0.306726 3.988869 -0.781735 v -0.169836 3.949807 -0.805173 v 0.142664 3.949807 -0.805173 v -0.076086 3.723244 -0.797360 v 0.048914 3.723244 -0.797360 v -0.177649 3.645119 -0.820798 v 0.150476 3.645119 -0.820798 v -0.138586 3.535744 -0.812985 v 0.111414 3.535744 -0.812985 v -0.216711 3.324807 -0.789548 v 0.189539 3.324807 -0.789548 v -0.388586 3.246682 -0.750485 v 0.361414 3.246682 -0.750485 v -0.505774 3.293557 -0.719235 v 0.478601 3.293557 -0.719235 v -0.638586 3.418557 -0.695798 v 0.611414 3.418557 -0.695798 v -0.654211 3.527932 -0.695798 v 0.627039 3.527932 -0.695798 v -0.615149 3.606057 -0.711423 v 0.587976 3.606057 -0.711423 v -0.443274 3.668557 -0.766110 v 0.416101 3.668557 -0.766110 v -0.263586 3.699807 -0.805173 v 0.236414 3.699807 -0.805173 v -0.013586 2.128879 -1.358218 v -0.122961 2.165568 -1.329043 v 0.095789 2.165568 -1.329043 v -0.130774 2.059258 -1.383635 v 0.103601 2.059258 -1.383635 v -0.076086 2.012844 -1.400580 v 0.048914 2.012844 -1.400580 v -0.013586 2.001867 -1.399328 v -0.013586 3.035744 -0.797360 v -0.013586 3.090432 -0.789548 v -0.115149 3.082619 -0.789548 v 0.087976 3.082619 -0.789548 v -0.138586 3.004494 -0.797360 v 0.111414 3.004494 -0.797360 v -0.099524 2.941994 -0.789548 v 0.072351 2.941994 -0.789548 v -0.412024 3.184182 -0.719235 v 0.384851 3.184182 -0.719235 v -0.630774 3.285744 -0.672360 v 0.603601 3.285744 -0.672360 v -0.740149 3.434182 -0.648923 v 0.712976 3.434182 -0.648923 v -0.755774 3.606057 -0.703610 v 0.728601 3.606057 -0.703610 v -0.701086 3.645119 -0.773923 v 0.673914 3.645119 -0.773923 v -0.451086 3.777932 -0.844235 v 0.423914 3.777932 -0.844235 v -0.326086 3.871682 -0.883298 v 0.298914 3.871682 -0.883298 v -0.216711 3.848244 -0.898923 v 0.189539 3.848244 -0.898923 v -0.115149 3.660744 -0.891110 v 0.087976 3.660744 -0.891110 v -0.138586 3.129494 -0.859860 v 0.111414 3.129494 -0.859860 v -0.224524 2.365001 -1.140511 v 0.197351 2.365001 -1.140511 v -0.263586 2.148623 -1.282629 v 0.236414 2.148623 -1.282629 v -0.279211 2.042313 -1.337221 v 0.252039 2.042313 -1.337221 v -0.247961 1.949485 -1.371112 v 0.220789 1.949485 -1.371112 v -0.177649 1.937255 -1.380836 v 0.150476 1.937255 -1.380836 v -0.013586 1.929888 -1.396676 v -0.013586 3.277932 -0.773923 v -0.013586 3.441994 -0.812985 v -0.341711 3.707619 -0.789548 v 0.314539 3.707619 -0.789548 v -0.177649 3.371682 -0.797360 v 0.150476 3.371682 -0.797360 v -0.146399 3.441994 -0.805173 v 0.119226 3.441994 -0.805173 v -0.130774 2.190028 -1.309593 v 0.103601 2.190028 -1.309593 v -0.091711 2.389313 -1.171086 v 0.064539 2.389313 -1.171086
			v -0.013586 2.389313 -1.171086 v -0.013586 2.902932 -0.789548 v -0.107336 2.957619 -0.828610 v 0.080164 2.957619 -0.828610 v -0.146399 3.004494 -0.844235 v 0.119226 3.004494 -0.844235 v -0.122961 3.098244 -0.828610 v 0.095789 3.098244 -0.828610 v -0.052649 3.106057 -0.828610 v 0.025476 3.106057 -0.828610 v -0.013586 3.027932 -0.875485 v -0.060461 3.082619 -0.859860 v 0.033289 3.082619 -0.859860 v -0.107336 3.074807 -0.859860 v 0.080164 3.074807 -0.859860 v -0.122961 3.004494 -0.875485 v 0.095789 3.004494 -0.875485 v -0.091711 2.981057 -0.852048 v 0.064539 2.981057 -0.852048 v -0.013586 2.941994 -0.852048 v -0.271399 2.918557 -0.602048 v 0.244226 2.918557 -0.602048 v -0.177649 2.988869 -0.758298 v 0.150476 2.988869 -0.758298 v -0.193274 2.918557 -0.758298 v 0.166101 2.918557 -0.758298 v -0.247961 2.981057 -0.602048 v 0.220789 2.981057 -0.602048 v -0.013586 2.014096 -1.389603 v -0.060461 2.020211 -1.384741 v 0.033289 2.020211 -1.384741 v -0.107336 2.071487 -1.373910 v 0.080164 2.071487 -1.373910 v -0.107336 2.142361 -1.337515 v 0.080164 2.142361 -1.337515 v -0.013586 2.068025 -1.306794 v -0.107336 2.097347 -1.293459 v 0.080164 2.097347 -1.293459 v -0.107336 2.033840 -1.314014 v 0.080164 2.033840 -1.314014 v -0.060461 1.998404 -1.332212 v 0.033289 1.998404 -1.332212 v -0.013586 1.992289 -1.337074 v -0.185461 3.449807 -0.828610 v 0.158289 3.449807 -0.828610 v -0.201086 3.387307 -0.820798 v 0.173914 3.387307 -0.820798 v -0.349524 3.660744 -0.805173 v 0.322351 3.660744 -0.805173 v -0.287024 3.652932 -0.820798 v 0.259851 3.652932 -0.820798 v -0.435461 3.629494 -0.820798 v 0.408289 3.629494 -0.820798 v -0.576086 3.582619 -0.742673 v 0.548914 3.582619 -0.742673 v -0.599524 3.520119 -0.734860 v 0.572351 3.520119 -0.734860 v -0.591711 3.426369 -0.727048 v 0.564539 3.426369 -0.727048 v -0.490149 3.332619 -0.766110 v 0.462976 3.332619 -0.766110 v -0.388586 3.293557 -0.789548 v 0.361414 3.293557 -0.789548 v -0.240149 3.340432 -0.828610 v 0.212976 3.340432 -0.828610 v -0.193274 3.527932 -0.828610 v 0.166101 3.527932 -0.828610 v -0.224524 3.606057 -0.828610 v 0.197351 3.606057 -0.828610 v -0.247961 3.590432 -0.805173 v 0.220789 3.590432 -0.805173 v -0.208899 3.527932 -0.805173 v 0.181726 3.527932 -0.805173 v -0.255774 3.356057 -0.805173 v 0.228601 3.356057 -0.805173 v -0.388586 3.316994 -0.773923 v 0.361414 3.316994 -0.773923 v -0.474524 3.348244 -0.750485 v 0.447351 3.348244 -0.750485 v -0.560461 3.441994 -0.719235 v 0.533289 3.441994 -0.719235 v -0.568274 3.512307 -0.719235 v 0.541101 3.512307 -0.719235 v -0.544836 3.566994 -0.727048 v 0.517664 3.566994 -0.727048 v -0.427649 3.621682 -0.797360 v 0.400476 3.621682 -0.797360 v -0.294836 3.629494 -0.812985 v 0.267664 3.629494 -0.812985 v -0.349524 3.637307 -0.797360 v 0.322351 3.637307 -0.797360 v -0.216711 3.402932 -0.797360 v 0.189539 3.402932 -0.797360 v -0.208899 3.457619 -0.797360 v 0.181726 3.457619 -0.797360 v -0.122961 3.691994 -0.656735 v 0.095789 3.691994 -0.656735 v -0.208899 3.895119 -0.664548 v 0.181726 3.895119 -0.664548 v -0.349524 3.918557 -0.641110
			v 0.322351 3.918557 -0.641110 v -0.497961 3.785744 -0.602048 v 0.470789 3.785744 -0.602048 v -0.693274 3.684182 -0.539548 v 0.666101 3.684182 -0.539548 v -0.810461 3.637307 -0.508298 v 0.783289 3.637307 -0.508298 v -0.787024 3.395119 -0.422360 v 0.759851 3.395119 -0.422360 v -0.615149 3.231057 -0.461423 v 0.587976 3.231057 -0.461423 v -0.451086 3.137307 -0.516110 v 0.423914 3.137307 -0.516110 v -0.013586 4.129494 -0.336423 v -0.013586 4.215432 0.030765 v -0.013586 3.035744 0.624515 v -0.013586 2.770119 -0.234860 v -0.013586 1.793591 -1.275484 v -0.013586 1.855181 -1.076787 v -0.013586 2.024039 -0.912568 v -0.013586 2.746682 -0.328610 v -0.865149 3.465432 -0.102048 v 0.837976 3.465432 -0.102048 v -0.872961 3.551369 -0.000485 v 0.845789 3.551369 -0.000485 v -0.787024 3.496682 0.390140 v 0.759851 3.496682 0.390140 v -0.474524 3.668557 0.655765 v 0.447351 3.668557 0.655765 v -0.747961 3.184182 -0.117673 v 0.720789 3.184182 -0.117673 v -0.607336 3.106057 0.116702 v 0.580164 3.106057 0.116702 v -0.654211 3.223244 0.382327 v 0.627039 3.223244 0.382327 v -0.349524 3.285744 0.616702 v 0.322351 3.285744 0.616702 v -0.247961 2.879494 -0.453610 v 0.220789 2.248742 -0.843682 v -0.193274 2.816994 -0.305173 v 0.166101 2.816994 -0.305173 v -0.302649 1.952872 -1.049012 v 0.275476 1.952872 -1.049012 v -0.263586 2.122835 -0.923840 v 0.236414 2.122835 -0.923840 v -0.341711 1.803610 -1.187666 v 0.314539 1.803610 -1.187666 v -0.154211 1.906458 -1.065957 v 0.127039 1.906458 -1.065957 v -0.138586 2.072811 -0.923693 v 0.111414 2.072811 -0.923693 v -0.177649 1.803463 -1.237690 v 0.150476 1.803463 -1.237690 v -0.232336 2.949807 -0.477048 v 0.205164 2.949807 -0.477048 v -0.224524 3.004494 -0.516110 v 0.197351 3.004494 -0.516110 v -0.216711 3.059182 -0.547360 v 0.189539 3.059182 -0.547360 v -0.224524 2.840432 -0.211423 v 0.197351 2.840432 -0.211423 v -0.310461 2.918557 0.218265 v 0.283289 2.918557 0.218265 v -0.357336 3.082619 0.491702 v 0.330164 3.082619 0.491702 v -0.466711 4.098245 0.335452 v 0.439539 4.098245 0.335452 v -0.466711 4.160744 0.022952 v 0.439539 4.160744 0.022952 v -0.466711 4.082620 -0.281735 v 0.439539 4.082620 -0.281735 v -0.474524 3.754494 -0.477048 v 0.447351 3.754494 -0.477048 v -0.740149 3.637307 -0.383298 v 0.712976 3.637307 -0.383298 v -0.646399 3.684182 -0.328610 v 0.619226 3.684182 -0.328610 v -0.654211 3.934182 -0.102048 v 0.627039 3.934182 -0.102048 v -0.810461 3.793557 -0.172360 v 0.783289 3.793557 -0.172360 v -0.810461 3.848244 0.069827 v 0.783289 3.848244 0.069827 v -0.654211 3.981057 0.147952 v 0.627039 3.981057 0.147952 v -0.654211 3.910744 0.397952 v 0.627039 3.910744 0.397952 v -0.810461 3.770119 0.312015 v 0.783289 3.770119 0.312015 v -0.630774 3.559182 0.538577 v 0.603601 3.559182 0.538577 v -0.497961 3.254494 0.499515 v 0.470789 3.254494 0.499515 v -0.833899 3.559182 0.155765 v 0.806726 3.559182 0.155765 v -0.419836 3.059182 -0.195798 v 0.392664 3.059182 -0.195798 v -0.443274 3.035744 0.163577 v 0.416101 3.035744 0.163577 v -0.904211 3.637307 0.187015
			v 0.877039 3.637307 0.187015 v -0.787024 3.090432 0.077640 v 0.759851 3.090432 0.077640 v -1.052649 3.129494 0.280765 v 1.025476 3.129494 0.280765 v -1.294836 3.285744 0.382327 v 1.267664 3.285744 0.382327 v -1.365149 3.551369 0.374515 v 1.337976 3.551369 0.374515 v -1.247961 3.738869 0.374515 v 1.220789 3.738869 0.374515 v -1.037024 3.707619 0.265140 v 1.009851 3.707619 0.265140 v -1.029211 3.645119 0.241702 v 1.002039 3.645119 0.241702 v -1.201086 3.668557 0.343265 v 1.173914 3.668557 0.343265 v -1.279211 3.520119 0.358890 v 1.252039 3.520119 0.358890 v -1.224524 3.309182 0.358890 v 1.197351 3.309182 0.358890 v -1.044836 3.191994 0.257327 v 1.017664 3.191994 0.257327 v -0.841711 3.160744 0.085452 v 0.814539 3.160744 0.085452 v -0.935461 3.590432 0.171390 v 0.908289 3.590432 0.171390 v -0.958899 3.535744 0.241702 v 0.931726 3.535744 0.241702 v -0.896399 3.207619 0.163577 v 0.869226 3.207619 0.163577 v -1.052649 3.231057 0.319827 v 1.025476 3.231057 0.319827 v -1.201086 3.324807 0.397952 v 1.173914 3.324807 0.397952 v -1.247961 3.481057 0.397952 v 1.220789 3.481057 0.397952 v -1.185461 3.590432 0.390140 v 1.158289 3.590432 0.390140 v -1.037024 3.574807 0.312015 v 1.009851 3.574807 0.312015 v -0.857336 3.520119 0.163577 v 0.830164 3.520119 0.163577 v -0.849524 3.402932 0.226077 v 0.822351 3.402932 0.226077 v -0.771399 3.324807 0.226077 v 0.744226 3.324807 0.226077 v -0.833899 3.316994 0.226077 v 0.806726 3.316994 0.226077 v -0.857336 3.246682 0.226077 v 0.830164 3.246682 0.226077 v -0.826086 3.215432 0.226077 v 0.798914 3.215432 0.226077 v -0.740149 3.231057 0.022952 v 0.712976 3.231057 0.022952 v -0.732336 3.207619 0.124515 v 0.705164 3.207619 0.124515 v -0.732336 3.270119 0.140140 v 0.705164 3.270119 0.140140 v -0.810461 3.434182 0.163577 v 0.783289 3.434182 0.163577 v -0.904211 3.473244 0.218265 v 0.877039 3.473244 0.218265 v -0.904211 3.465432 0.272952 v 0.877039 3.465432 0.272952 v -0.826086 3.215432 0.272952 v 0.798914 3.215432 0.272952 v -0.865149 3.246682 0.272952 v 0.837976 3.246682 0.272952 v -0.841711 3.309182 0.272952 v 0.814539 3.309182 0.272952 v -0.779211 3.324807 0.272952 v 0.752039 3.324807 0.272952 v -0.857336 3.402932 0.272952 v 0.830164 3.402932 0.272952 v -1.052649 3.559182 0.366702 v 1.025476 3.559182 0.366702 v -1.201086 3.574807 0.437015 v 1.173914 3.574807 0.437015 v -1.271399 3.473244 0.444827 v 1.244226 3.473244 0.444827 v -1.224524 3.316994 0.437015 v 1.197351 3.316994 0.437015 v -1.060461 3.231057 0.374515 v 1.033289 3.231057 0.374515 v -0.896399 3.215432 0.218265 v 0.869226 3.215432 0.218265 v -0.966711 3.520119 0.296390 v 0.939539 3.520119 0.296390 v -0.904211 3.340432 0.280765 v 0.877039 3.340432 0.280765 v -0.951086 3.293557 0.288577 v 0.923914 3.293557 0.288577 v -1.013586 3.356057 0.319827 v 0.986414 3.356057 0.319827 v -0.974524 3.402932 0.304202 v 0.947351 3.402932 0.304202 v -1.029211 3.465432 0.327640 v 1.002039 3.465432 0.327640 v -1.068274 3.418557 0.335452
			v 1.041101 3.418557 0.335452 v -1.122961 3.441994 0.343265 v 1.095789 3.441994 0.343265 v -1.099524 3.504494 0.343265 v 1.072351 3.504494 0.343265 v -1.037024 3.668557 0.437015 v 1.009851 3.668557 0.437015 v -1.263586 3.699807 0.499515 v 1.236414 3.699807 0.499515 v -1.380774 3.527932 0.452640 v 1.353601 3.527932 0.452640 v -1.326086 3.285744 0.483890 v 1.298914 3.285744 0.483890 v -1.052649 3.145119 0.444827 v 1.025476 3.145119 0.444827 v -0.802649 3.106057 0.280765 v 0.775476 3.106057 0.280765 v -0.872961 3.613869 0.335452 v 0.845789 3.613869 0.335452 v 1.000000 0.000000 1.015029 v 1.000000 0.000000 -1.089377 v -1.000000 0.000000 1.015029 v -1.000000 0.000000 -1.089377 v 1.165888 0.108294 1.189577 v 1.165888 0.108294 -1.263925 v -1.165888 0.108294 1.189577 v -1.165888 0.108294 -1.263925 v 1.165888 -0.008294 1.189577 v 1.165888 -0.008294 -1.263925 v -1.165888 -0.008294 1.189577 v -1.165888 -0.008294 -1.263925 v 1.129429 0.312172 1.151214 v 1.129429 0.312172 -1.225562 v -1.129429 0.312172 1.151214 v -1.129429 0.312172 -1.225562 v 1.316788 0.321540 -1.422702 v 1.316788 0.321540 1.348354 v -1.316788 0.321540 1.348354 v -1.316788 0.321540 -1.422702
			f 7 12 5 f 3 8 4 f 7 6 8 f 523 529 521 f 1 4 2 f 5 2 6 f 12 9 11 f 1 9 3 f 5 11 1 f 3 10 7 f 59 15 57 f 16 60 58 f 57 17 55 f 18 58 56 f 15 19 17 f 20 16 18 f 13 21 15 f 22 14 16 f 23 27 21 f 28 24 22 f 21 29 19 f 30 22 20 f 33 29 27 f 34 30 32 f 25 33 27 f 34 26 28 f 35 39 33 f 40 36 34 f 39 31 33 f 40 32 42 f 45 41 39 f 46 42 44 f 47 39 37 f 48 40 46 f 49 45 47 f 50 46 52 f 51 43 45 f 52 44 54 f 57 53 51 f 58 54 56 f 59 51 49 f 60 52 58 f 49 61 59 f 50 62 64 f 47 63 49 f 48 64 66 f 37 65 47 f 38 66 68 f 35 67 37 f 36 68 70 f 35 71 69 f 72 36 70 f 25 75 71 f 76 26 72 f 23 77 75 f 78 24 76 f 13 61 77 f 62 14 78 f 73 77 61 f 62 78 74 f 75 77 73 f 74 78 76 f 73 71 75 f 76 72 74 f 73 69 71 f 72 70 74 f 73 67 69 f 70 68 74 f 73 65 67 f 68 66 74 f 73 63 65 f 66 64 74 f 73 61 63 f 64 62 74 f 186 103 101 f 187 103 188 f 184 101 99 f 185 102 187 f 97 184 99 f 185 98 100 f 95 182 97 f 183 96 98 f 93 180 95 f 181 94 96 f 91 158 176 f 159 92 177 f 106 158 104 f 107 159 161 f 106 162 160 f 163 107 161 f 110 162 108 f 111 163 165 f 112 164 110 f 113 165 167 f 114 166 112 f 115 167 169 f 114 170 168 f 171 115 169 f 118 170 116 f 119 171 173
			f 120 172 118 f 121 173 175 f 79 174 120 f 79 175 80 f 140 174 122 f 141 175 173 f 140 170 172 f 171 141 173 f 168 191 138 f 169 192 171 f 166 138 136 f 167 139 169 f 164 136 134 f 165 137 167 f 162 134 132 f 163 135 165 f 160 132 130 f 161 133 163 f 158 130 128 f 159 131 161 f 176 128 126 f 177 129 159 f 126 189 176 f 189 127 177 f 174 124 122 f 175 125 80 f 124 190 195 f 190 125 196 f 193 190 189 f 194 190 196 f 147 188 186 f 188 148 187 f 145 186 184 f 187 146 185 f 145 182 143 f 146 183 185 f 178 197 180 f 198 179 181 f 143 180 197 f 181 144 198 f 202 199 156 f 202 200 201 f 199 81 197 f 200 81 201 f 143 81 142 f 144 81 198 f 154 203 156 f 204 155 157 f 152 205 154 f 206 153 155 f 209 152 151 f 210 153 208 f 83 151 150 f 83 151 210 f 156 82 202 f 157 82 204 f 203 220 82 f 204 220 219 f 83 212 209 f 213 83 210 f 209 214 207 f 215 210 208 f 214 205 207 f 215 206 217 f 205 218 203 f 219 206 204 f 216 212 211 f 217 213 215 f 211 218 216 f 219 211 217 f 151 176 189 f 177 151 189 f 152 223 176 f 224 153 177 f 156 223 154 f 157 224 226 f 199 225 156 f 200 226 179 f 93 225 178 f 226 94 179 f 227 225 221 f 228 226 224 f 91 223 227 f 224 92 228 f 142 234 143 f 142 235 84 f 145 234 232 f 235 146 233 f 147 232 230 f 233 148 231 f 149 230 229 f 231 149 229 f 230 243 229 f 231 243 242 f 230 239 241 f 240 231 242 f 232 237 239 f 238 233 240 f 84 237 234 f 84 238 236
			f 236 241 237 f 242 236 238 f 237 241 239 f 240 242 238 f 195 246 244 f 247 196 245 f 124 244 266 f 245 125 267 f 124 268 122 f 125 269 267 f 126 246 193 f 127 247 265 f 126 262 264 f 263 127 265 f 128 260 262 f 261 129 263 f 130 258 260 f 259 131 261 f 132 256 258 f 257 133 259 f 136 256 134 f 137 257 255 f 138 254 136 f 139 255 253 f 138 248 252 f 249 139 253 f 191 250 248 f 251 192 249 f 140 268 250 f 269 141 251 f 268 288 250 f 269 289 271 f 248 288 290 f 289 249 291 f 248 286 252 f 249 287 291 f 252 284 254 f 253 285 287 f 256 284 282 f 285 257 283 f 256 280 258 f 257 281 283 f 260 280 278 f 281 261 279 f 260 276 262 f 261 277 279 f 262 274 264 f 263 275 277 f 246 274 292 f 275 247 293 f 268 272 270 f 273 269 271 f 266 294 272 f 295 267 273 f 244 292 294 f 293 245 295 f 79 296 85 f 297 79 85 f 120 298 296 f 299 121 297 f 116 298 118 f 117 299 301 f 114 300 116 f 115 301 303 f 112 302 114 f 113 303 305 f 112 306 304 f 307 113 305 f 108 306 110 f 109 307 309 f 108 310 308 f 311 109 309 f 106 312 310 f 313 107 311 f 321 350 320 f 321 351 341 f 320 348 319 f 320 349 351 f 319 352 318 f 319 353 349 f 101 318 352 f 318 102 353 f 99 352 346 f 353 100 347 f 97 346 342 f 347 98 343 f 95 342 344 f 343 96 345 f 342 350 344 f 351 343 345 f 346 348 342 f 347 349 353 f 344 340 338 f 351 339 341 f 93 344 338 f 345 94 339 f 354 227 221 f 355 228 357 f 338 221 93 f 339 222 355
			f 227 358 91 f 228 359 357 f 358 104 91 f 359 105 313 f 336 316 89 f 337 316 365 f 364 90 316 f 365 90 363 f 11 360 9 f 90 362 11 f 317 340 321 f 341 317 321 f 340 354 338 f 341 355 361 f 308 330 322 f 331 309 323 f 328 89 88 f 329 89 337 f 370 315 314 f 371 315 369 f 315 366 87 f 367 315 87 f 87 328 88 f 329 87 88 f 304 374 376 f 375 305 377 f 376 380 378 f 381 377 379 f 378 382 384 f 383 379 385 f 384 388 386 f 389 385 387 f 390 388 326 f 391 389 387 f 328 386 390 f 387 329 391 f 366 384 386 f 385 367 387 f 368 378 384 f 379 369 385 f 370 376 378 f 377 371 379 f 304 372 302 f 305 373 377 f 372 314 86 f 373 314 371 f 296 300 302 f 301 297 303 f 296 372 86 f 373 297 86 f 85 296 86 f 86 297 85 f 308 374 306 f 309 375 323 f 322 380 374 f 381 323 375 f 324 382 380 f 383 325 381 f 388 394 326 f 389 395 383 f 362 396 360 f 363 397 399 f 396 332 330 f 397 333 399 f 310 396 330 f 397 311 331 f 312 354 396 f 355 313 397 f 354 360 396 f 397 361 355 f 312 358 356 f 357 359 313 f 334 390 326 f 335 391 393 f 390 336 328 f 391 337 393 f 398 334 332 f 399 335 393 f 364 398 362 f 365 399 393 f 336 392 364 f 365 393 337 f 400 414 412 f 401 415 427 f 412 416 410 f 417 413 411 f 416 408 410 f 417 409 419 f 418 406 408 f 419 407 421 f 420 404 406 f 421 405 423 f 404 424 402 f 425 405 403 f 422 430 424 f 431 423 425 f 420 432 422 f 433 421 423 f 436 420 418 f 437 421 435
			f 438 418 416 f 439 419 437 f 440 416 414 f 441 417 439 f 414 428 440 f 429 415 441 f 332 454 330 f 333 455 457 f 402 456 332 f 403 457 425 f 322 454 324 f 455 323 325 f 394 426 400 f 427 395 401 f 424 452 456 f 453 425 457 f 458 452 450 f 459 453 457 f 446 450 448 f 451 447 449 f 460 446 444 f 461 447 459 f 460 462 442 f 461 463 445 f 442 428 426 f 443 429 463 f 324 442 394 f 443 325 395 f 454 460 324 f 455 461 459 f 454 456 458 f 459 457 455 f 428 464 488 f 465 429 489 f 444 464 462 f 445 465 475 f 444 472 474 f 473 445 475 f 448 472 446 f 449 473 471 f 450 470 448 f 451 471 469 f 450 466 468 f 467 451 469 f 452 486 466 f 487 453 467 f 440 488 476 f 489 441 477 f 438 476 478 f 477 439 479 f 436 478 480 f 479 437 481 f 436 482 434 f 437 483 481 f 434 484 432 f 435 485 483 f 432 486 430 f 433 487 485 f 468 490 470 f 469 491 493 f 492 496 490 f 493 497 495 f 496 500 498 f 501 497 499 f 500 504 498 f 501 505 503 f 476 498 504 f 499 477 505 f 496 488 464 f 497 489 499 f 474 496 464 f 475 497 491 f 470 474 472 f 475 471 473 f 486 468 466 f 487 469 493 f 484 492 486 f 493 485 487 f 500 484 482 f 501 485 495 f 502 482 480 f 503 483 501 f 478 502 480 f 503 479 481 f 476 504 478 f 479 505 477 f 404 516 514 f 517 405 515 f 406 514 512 f 515 407 513 f 406 510 408 f 407 511 513 f 408 508 410 f 409 509 511 f 410 506 412 f 411 507 509 f 412 518 400 f 413 519 507 f 514 518 506 f 515 519 517
			f 506 512 514 f 513 507 515 f 508 510 512 f 513 511 509 f 394 518 326 f 395 519 401 f 326 516 334 f 517 327 335 f 332 516 402 f 517 333 403 f 317 361 10 f 361 12 10 f 522 521 520 f 4 534 2 f 6 533 8 f 520 530 522 f 524 529 525 f 527 530 526 f 526 528 524 f 525 531 527 f 521 528 520 f 525 537 524 f 522 531 523 f 527 536 525 f 535 538 534 f 532 536 533 f 532 538 537 f 535 536 539 f 526 539 527 f 524 538 526 f 2 532 6 f 8 535 4 f 7 10 12 f 3 7 8 f 7 5 6 f 523 531 529 f 1 3 4 f 5 1 2 f 12 10 9 f 1 11 9 f 5 12 11 f 3 9 10 f 59 13 15 f 16 14 60 f 57 15 17 f 18 16 58 f 15 21 19 f 20 22 16 f 13 23 21 f 22 24 14 f 23 25 27 f 28 26 24 f 21 27 29 f 30 28 22 f 33 31 29 f 34 28 30 f 25 35 33 f 34 36 26 f 35 37 39 f 40 38 36 f 39 41 31 f 40 34 32 f 45 43 41 f 46 40 42 f 47 45 39 f 48 38 40 f 49 51 45 f 50 48 46 f 51 53 43 f 52 46 44 f 57 55 53 f 58 52 54 f 59 57 51 f 60 50 52 f 49 63 61 f 50 60 62 f 47 65 63 f 48 50 64 f 37 67 65 f 38 48 66 f 35 69 67 f 36 38 68 f 35 25 71 f 72 26 36 f 25 23 75 f 76 24 26 f 23 13 77 f 78 14 24 f 13 59 61 f 62 60 14 f 186 188 103 f 187 102 103 f 184 186 101 f 185 100 102 f 97 182 184 f 185 183 98 f 95 180 182 f 183 181 96 f 93 178 180 f 181 179 94
			f 91 104 158 f 159 105 92 f 106 160 158 f 107 105 159 f 106 108 162 f 163 109 107 f 110 164 162 f 111 109 163 f 112 166 164 f 113 111 165 f 114 168 166 f 115 113 167 f 114 116 170 f 171 117 115 f 118 172 170 f 119 117 171 f 120 174 172 f 121 119 173 f 79 80 174 f 79 121 175 f 140 172 174 f 141 123 175 f 140 191 170 f 171 192 141 f 168 170 191 f 169 139 192 f 166 168 138 f 167 137 139 f 164 166 136 f 165 135 137 f 162 164 134 f 163 133 135 f 160 162 132 f 161 131 133 f 158 160 130 f 159 129 131 f 176 158 128 f 177 127 129 f 126 193 189 f 189 194 127 f 174 80 124 f 175 123 125 f 124 80 190 f 190 80 125 f 193 195 190 f 194 189 190 f 147 149 188 f 188 149 148 f 145 147 186 f 187 148 146 f 145 184 182 f 146 144 183 f 178 199 197 f 198 200 179 f 143 182 180 f 181 183 144 f 202 201 199 f 202 157 200 f 199 201 81 f 200 198 81 f 143 197 81 f 144 142 81 f 154 205 203 f 204 206 155 f 152 207 205 f 206 208 153 f 209 207 152 f 210 151 153 f 83 209 151 f 83 150 151 f 156 203 82 f 157 202 82 f 203 218 220 f 204 82 220 f 83 211 212 f 213 211 83 f 209 212 214 f 215 213 210 f 214 216 205 f 215 208 206 f 205 216 218 f 219 217 206 f 216 214 212 f 217 211 213 f 211 220 218 f 219 220 211 f 151 152 176 f 177 153 151 f 152 154 223 f 224 155 153
			f 156 225 223 f 157 155 224 f 199 178 225 f 200 157 226 f 93 221 225 f 226 222 94 f 227 223 225 f 228 222 226 f 91 176 223 f 224 177 92 f 142 84 234 f 142 144 235 f 145 143 234 f 235 144 146 f 147 145 232 f 233 146 148 f 149 147 230 f 231 148 149 f 230 241 243 f 231 229 243 f 230 232 239 f 240 233 231 f 232 234 237 f 238 235 233 f 84 236 237 f 84 235 238 f 236 243 241 f 242 243 236 f 195 193 246 f 247 194 196 f 124 195 244 f 245 196 125 f 124 266 268 f 125 123 269 f 126 264 246 f 127 194 247 f 126 128 262 f 263 129 127 f 128 130 260 f 261 131 129 f 130 132 258 f 259 133 131 f 132 134 256 f 257 135 133 f 136 254 256 f 137 135 257 f 138 252 254 f 139 137 255 f 138 191 248 f 249 192 139 f 191 140 250 f 251 141 192 f 140 122 268 f 269 123 141 f 268 270 288 f 269 251 289 f 248 250 288 f 289 251 249 f 248 290 286 f 249 253 287 f 252 286 284 f 253 255 285 f 256 254 284 f 285 255 257 f 256 282 280 f 257 259 281 f 260 258 280 f 281 259 261 f 260 278 276 f 261 263 277 f 262 276 274 f 263 265 275 f 246 264 274 f 275 265 247 f 268 266 272 f 273 267 269 f 266 244 294 f 295 245 267 f 244 246 292 f 293 247 245 f 79 120 296 f 297 121 79 f 120 118 298 f 299 119 121 f 116 300 298 f 117 119 299 f 114 302 300 f 115 117 301 f 112 304 302 f 113 115 303
			f 112 110 306 f 307 111 113 f 108 308 306 f 109 111 307 f 108 106 310 f 311 107 109 f 106 104 312 f 313 105 107 f 321 340 350 f 321 320 351 f 320 350 348 f 320 319 349 f 319 348 352 f 319 318 353 f 101 103 318 f 318 103 102 f 99 101 352 f 353 102 100 f 97 99 346 f 347 100 98 f 95 97 342 f 343 98 96 f 342 348 350 f 351 349 343 f 346 352 348 f 347 343 349 f 344 350 340 f 351 345 339 f 93 95 344 f 345 96 94 f 354 356 227 f 355 222 228 f 338 354 221 f 339 94 222 f 227 356 358 f 228 92 359 f 358 312 104 f 359 92 105 f 336 364 316 f 337 89 316 f 364 362 90 f 365 316 90 f 11 362 360 f 11 12 90 f 12 363 90 f 317 360 340 f 341 361 317 f 340 360 354 f 341 339 355 f 308 310 330 f 331 311 309 f 328 336 89 f 329 88 89 f 370 368 315 f 371 314 315 f 315 368 366 f 367 369 315 f 87 366 328 f 329 367 87 f 304 306 374 f 375 307 305 f 376 374 380 f 381 375 377 f 378 380 382 f 383 381 379 f 384 382 388 f 389 383 385 f 390 386 388 f 391 327 389 f 328 366 386 f 387 367 329 f 366 368 384 f 385 369 367 f 368 370 378 f 379 371 369 f 370 372 376 f 377 373 371 f 304 376 372 f 305 303 373 f 372 370 314 f 373 86 314 f 296 298 300 f 301 299 297 f 296 302 372 f 373 303 297 f 308 322 374 f 309 307 375 f 322 324 380 f 381 325 323 f 324 394 382
			f 383 395 325 f 388 382 394 f 389 327 395 f 362 398 396 f 363 361 397 f 396 398 332 f 397 331 333 f 310 312 396 f 397 313 311 f 312 356 354 f 355 357 313 f 334 392 390 f 335 327 391 f 390 392 336 f 391 329 337 f 398 392 334 f 399 333 335 f 364 392 398 f 365 363 399 f 400 426 414 f 401 413 415 f 412 414 416 f 417 415 413 f 416 418 408 f 417 411 409 f 418 420 406 f 419 409 407 f 420 422 404 f 421 407 405 f 404 422 424 f 425 423 405 f 422 432 430 f 431 433 423 f 420 434 432 f 433 435 421 f 436 434 420 f 437 419 421 f 438 436 418 f 439 417 419 f 440 438 416 f 441 415 417 f 414 426 428 f 429 427 415 f 332 456 454 f 333 331 455 f 402 424 456 f 403 333 457 f 322 330 454 f 455 331 323 f 394 442 426 f 427 443 395 f 424 430 452 f 453 431 425 f 458 456 452 f 459 451 453 f 446 458 450 f 451 459 447 f 460 458 446 f 461 445 447 f 460 444 462 f 461 443 463 f 442 462 428 f 443 427 429 f 324 460 442 f 443 461 325 f 454 458 460 f 455 325 461 f 428 462 464 f 465 463 429 f 444 474 464 f 445 463 465 f 444 446 472 f 473 447 445 f 448 470 472 f 449 447 473 f 450 468 470 f 451 449 471 f 450 452 466 f 467 453 451 f 452 430 486 f 487 431 453 f 440 428 488 f 489 429 441 f 438 440 476 f 477 441 439 f 436 438 478 f 479 439 437 f 436 480 482 f 437 435 483 f 434 482 484
			f 435 433 485 f 432 484 486 f 433 431 487 f 468 492 490 f 469 471 491 f 492 494 496 f 493 491 497 f 496 494 500 f 501 495 497 f 500 502 504 f 501 499 505 f 476 488 498 f 499 489 477 f 496 498 488 f 497 465 489 f 474 490 496 f 475 465 497 f 470 490 474 f 475 491 471 f 486 492 468 f 487 467 469 f 484 494 492 f 493 495 485 f 500 494 484 f 501 483 485 f 502 500 482 f 503 481 483 f 478 504 502 f 503 505 479 f 404 402 516 f 517 403 405 f 406 404 514 f 515 405 407 f 406 512 510 f 407 409 511 f 408 510 508 f 409 411 509 f 410 508 506 f 411 413 507 f 412 506 518 f 413 401 519 f 514 516 518 f 515 507 519 f 506 508 512 f 513 509 507 f 394 400 518 f 395 327 519 f 326 518 516 f 517 519 327 f 332 334 516 f 517 335 333 f 10 9 317 f 9 360 317 f 361 363 12 f 522 523 521 f 4 535 534 f 6 532 533 f 520 528 530 f 524 528 529 f 527 531 530 f 526 530 528 f 525 529 531 f 521 529 528 f 525 536 537 f 522 530 531 f 527 539 536 f 535 539 538 f 532 537 536 f 532 534 538 f 535 533 536 f 526 538 539 f 524 537 538 f 2 534 532 f 8 533 535
		`);
	}
}

const processMesh = (mesh, matProj, matView, rgbVec=new Vec3(1, 1, 0.5)) => {
	const tris = [];
	const matWorld = Mat4.makeWorld(mesh.transform);
	for (let i = mesh.tris.length - 1; i >= 0; --i) {

		totalTris++;

		const tri = mesh.tris[i].clone();

		// Transform
		tri.p[0] = Mat4.multiplyVector(matWorld, tri.p[0]);
		tri.p[1] = Mat4.multiplyVector(matWorld, tri.p[1]);
		tri.p[2] = Mat4.multiplyVector(matWorld, tri.p[2]);

		// Normals
		const line1 = Vec3.sub(tri.p[1], tri.p[0]);
		const line2 = Vec3.sub(tri.p[2], tri.p[0]);
		const normal = Vec3.cross(line1, line2); normal.normalize();
		const cameraRay = Vec3.sub(tri.p[0], mainCamera.transform.position);
		if (Vec3.dot(normal, cameraRay) >= 0) continue;

		// Illumination
		const lightDirection = new Vec3(0, 0, -1); lightDirection.normalize();
		tri.dp = Vec3.dot(normal, lightDirection);
		const c = 50 + tri.dp * 205;
		tri.c = makeRGBLum(rgbVec.toRGB(), c);

		// Convert world -> view space
		tri.p[0] = Mat4.multiplyVector(matView, tri.p[0]);
		tri.p[1] = Mat4.multiplyVector(matView, tri.p[1]);
		tri.p[2] = Mat4.multiplyVector(matView, tri.p[2]);

		// Clipping
		let clippedCount = 0;
		const clipped = [new Triangle(), new Triangle()];
		clippedCount = Triangle.clipAgainstPlane(new Vec3(0, 0, 0.1), Vec3.forward, tri, clipped);

		let triProjected = tri.clone();

		for (let i = 0; i < clippedCount; i++) {

			// Project triangles from 3D -> 2D
			triProjected.p[0] = Mat4.multiplyVector(matProj, clipped[i].p[0]);
			triProjected.p[1] = Mat4.multiplyVector(matProj, clipped[i].p[1]);
			triProjected.p[2] = Mat4.multiplyVector(matProj, clipped[i].p[2]);
			triProjected.onAllPoints((p) => {
				p.div(p.w);
				p.addXY(1);
				p.mulXY(Room.mid.w, -Room.mid.h);
				p.y += Room.h;
			});

			triProjected.calculateDepth();

			tris.push(triProjected);
		}
	}
	return tris;
};

const Manager = {
	hoveredTris: [],
	meshHoveredIDs: []
};

const rasterizeTriangles = (trianglesToRaster) => {
	trianglesToRaster.sort((a, b) => a.depth < b.depth? -1 : 1);

	Manager.meshHoveredIDs.length = 0;
	// Uncomment to make hover covers all over mesh
	// for (let i = 0; i < 2; i++) {
	// 	for (let i = trianglesToRaster.length - 1; i >= 0; --i) {
	// 		const triToRaster = trianglesToRaster[i];
	// 		let hovered = false;
	// 		if (triToRaster.meshReference instanceof Mesh) {
	// 			if (Manager.meshHoveredIDs.indexOf(triToRaster.meshReference.id) === -1) {
	// 				if (triToRaster.contains(new Vector2(Room.mid.w, Room.mid.h))) {
	// 					Manager.meshHoveredIDs.push(triToRaster.meshReference.id);
	// 					hovered = true;
	// 				}
	// 			}
	// 			else {
	// 				hovered = true;
	// 			}
	// 		}
	// 		if (hovered) {
	// 			triToRaster.c = makeRGBLum({ r: 1, g: 1, b: 1 }, 155 + triToRaster.dp * 100);
	// 		}
	// 	}
	// }

	Manager.hoveredTris.length = 0;
	Draw.CTX.lineJoin = LineJoin.round;
	for (let i = trianglesToRaster.length - 1; i >= 0; --i) {
		const triToRaster = trianglesToRaster[i];
		if (triToRaster.contains(new Vector2(Room.mid.w, Room.mid.h))) {
			if (triToRaster.meshReference.name !== 'Bullet') {
				Manager.hoveredTris.push(triToRaster);
			}
			if (triToRaster.meshReference instanceof Mesh) {
				if (Manager.meshHoveredIDs.indexOf(triToRaster.meshReference.id) === -1) {
					if (triToRaster.meshReference.name === 'Monkey Award') {
						if (Input.mouseHold(0)) {
							triToRaster.meshReference.transform.rotation.x = 10;
						}
					}
					Manager.meshHoveredIDs.push(triToRaster.meshReference.id);
				}
			}
		}

		// Clipping
		const clipped = [new Triangle(), new Triangle()];
		const listTriangles = [];
		listTriangles.push(triToRaster);
		let nNewTriangles = 1;
		for (let p = 0; p < 4; p++)
		{
			let nTrisToAdd = 0;
			while (nNewTriangles > 0)
			{
				const test = listTriangles[0];
				listTriangles.shift();
				nNewTriangles--;
				switch (p)
				{
					case 0:	nTrisToAdd = Triangle.clipAgainstPlane(Vec3.zero, Vec3.up, test, clipped); break;
					case 1:	nTrisToAdd = Triangle.clipAgainstPlane(new Vec3(0, Room.h - 1, 0), new Vec3(0, -1, 0), test, clipped); break;
					case 2:	nTrisToAdd = Triangle.clipAgainstPlane(Vec3.zero, Vec3.right, test, clipped); break;
					case 3:	nTrisToAdd = Triangle.clipAgainstPlane(new Vec3(Room.w - 1, 0, 0), new Vec3(-1, 0, 0), test, clipped); break;
				}
				for (let w = 0; w < nTrisToAdd; w++) {
					listTriangles.push(clipped[w]);
				}
			}
			nNewTriangles = listTriangles.length;
		}
		for (const t of listTriangles)
		{
			Triangle.draw(t);
			totalTrisRasterized++;
		}
	}

	// const hoveredTri = Manager.hoveredTris[Manager.hoveredTris.length - 1];
	// if (hoveredTri) {
	// 	hoveredTri.c = makeRGBLum({ r: 1, g: 1, b: 1 }, 155 + hoveredTri.dp * 100);
	// 	Triangle.draw2(hoveredTri);
	// }
};

let matProj = Mat4.makeProjection();

let mainCamera = {
	lookDir: new Vec3(),
	lookDirRight: new Vec3(),
	transform: {
		position: new Vec3(0, 0, 0),
		// pitch, yaw, roll
		rotation: new Vec3(0, 0, 0),
		_rotation: new Vec3(0, 0, 0)
	},
	update() {
		this.transform._rotation.x = Math.range(this.transform._rotation.x, this.transform.rotation.x, 0.2);
		this.transform._rotation.y = Math.range(this.transform._rotation.y, this.transform.rotation.y, 0.2);
		this.transform._rotation.z = Math.range(this.transform._rotation.z, this.transform.rotation.z, 0.2);
	}
};

class Bullet {
	constructor() {
		this.id = 0;
		this.mesh = Mesh.makeBullet();
		this.mesh.name = 'Bullet';
		this.velocity = new Vec3();
		this.alarm = 0;
	}
}

let bulletId = 0;
let bulletTime = 0;
const bullets = [];

const createBullet = () => {
	const b = new Bullet();
	b.id = bulletId++;
	bullets.push(b);
	return b;
};

const destroyBullet = (id) => {
	for (let i = bullets.length - 1; i >= 0; --i) {
		const b = bullets[i];
		if (b.id === id) {
			return bullets.splice(i, 1)[0];
		}
	}
	return null;
};

const my3DObjects = [];

const destroyMy3DObject = (instance) => {
	for (let i = my3DObjects.length - 1; i >= 0; --i) {
		const b = my3DObjects[i];
		if (b === instance) {
			return my3DObjects.splice(i, 1)[0];
		}
	}
	return null;
};

class My3DObject {
	constructor(mesh, name='', rgbVec=new Vec3(1, 1, 0.5)) {
		this.mesh = mesh;
		this.mesh.name = name;
		this.mesh.transform.position.z = 8;
		this.mesh.transform.position.x = Math.range(-8, 8);
		this.rgbVec = rgbVec;
		this.rv = Vec3.random();
	}

	randomRotate() {
		this.mesh.transform.rotation.x += this.rv.x;
		this.mesh.transform.rotation.z += this.rv.z;
	}

	update() {
		this.randomRotate();
	}
}

(function() {

	// const floor = new My3DObject(Mesh.makeFloor(200), 'Ground');
	// floor.mesh.transform.position.reset();
	// floor.update = () => {
	// 	floor.mesh.transform.position.y = -1;
	// };

	const torus_sm = new My3DObject(Mesh.makeTorusSmall(), 'Torus Small');
	const torus_md = new My3DObject(Mesh.makeTorusMedium(), 'Torus Medium');
	const torus_lg = new My3DObject(Mesh.makeTorusLarge(), 'Torus Large');
	torus_sm.mesh.transform.rotation.x = 90;
	torus_lg.mesh.transform.rotation.x = 90;
	torus_lg.mesh.transform.rotation.z = 90;

	const monkey = new My3DObject(Mesh.makeMonkeyAward(), 'Monkey Award');
	let vRot = monkey.mesh.transform.rotation;
	monkey.update = () => {
		if (Math.abs(vRot.x) > 0) {
			vRot.x -= Math.sign(vRot.x) * Math.min(Math.abs(vRot.x), 1);
		}
	};

	my3DObjects.push(torus_sm, torus_md, torus_lg, monkey);

	for (let i = 0; i < 10; i++) {
		const ammoStack = new My3DObject(Mesh.makeCube(), 'Ammo Stack', new Vec3(0.92, 0.24, 0.26));
		ammoStack.mesh.transform.rotation.y = Math.range(-90, 90);
		ammoStack.mesh.transform.position.z = 3;
		ammoStack.mesh.transform.position.y = 0.1;
		ammoStack.mesh.transform.position.x = -5 + i;
		ammoStack.mesh.scale(0.2);
		ammoStack.update = () => {};
		ammoStack.mesh.grabbable = true;
		ammoStack.mesh.onGrab = () => {
			player.ammoCount += 20;
			Sound.play('ammograb');
			destroyMy3DObject(ammoStack);
		};
		my3DObjects.push(ammoStack);
	}
}());

const meshTri = Mesh.makeCube();
meshTri.vsp = 0;
meshTri.jumpTime = 0;
meshTri.update = () => {
	if (Time.time > meshTri.jumpTime) {
		meshTri.vsp = Math.range(0.1, 0.2);
		meshTri.jumpTime = Time.time + Math.range(1000, 1200);
	}

	meshTri.transform.position.y += meshTri.vsp;
	meshTri.vsp -= 0.01;

	if (meshTri.transform.position.y < 0.5) {
		meshTri.transform.position.y = 0.5;
	}
};
meshTri.transform.position.y = 0.5;
meshTri.transform.position.z = 5;

let showOutline = false;
let debugClipping = false;

GLOBAL.debugMode = 0;

let optResNames = ['Low', 'Normal', 'High', 'Ultra'];
let optResIndex = 1;

let trianglesToRaster = [];

let totalTris = 0;
let totalTrisRasterized = 0;

const mousePosition = new Vector2(0, 0);
const prevMousePosition = new Vector2(0, 0);

let mouseSensitivity = 0.2;

let matCameraRot = Vec3.forward;

let groundY = 0.5;

const Game = new BranthRoom('Game');

const player = {
	vsp: 0,
	ads: 0,
	fov: 90,
	prevPosition: new Vec3(0, 0, 0),
	isMoving: false,
	scope: 20,
	scopeRange: {
		min: 20,
		max: 70,
		diff: 50
	},
	scopeScale: 0,
	jumpSpd: 0.1,
	gravity: 0.003,
	isShooting: false,
	bulletSpeed: 4,
	bulletOffset: 0,
	bulletGravity: 0.001,
	ammo: 32,
	ammoCap: 32,
	ammoCount: 180,
	reloading: false,
	reloadTime: 1384,
	runReload() {
		if (this.ammoCount > 0 && !this.reloading && this.ammo < this.ammoCap) {
			this.isShooting = false;
			this.reloading = true;
			Sound.play('reload');
			_this = this;
			window.setTimeout(function() {
				const ammoReloaded = _this.ammoCap - _this.ammo;
				_this.ammo += Math.min(_this.ammoCount, ammoReloaded);
				_this.ammoCount = Math.max(0, _this.ammoCount - ammoReloaded);
				_this.reloading = false;
			}, this.reloadTime);
		}
	}
};

const mouseMoveEvent = (e) => {
	const mouseDiff = new Vector2(e.movementX, e.movementY);
	mainCamera.transform.rotation.x += mouseDiff.y * mouseSensitivity;
	mainCamera.transform.rotation.y += mouseDiff.x * mouseSensitivity;
	mainCamera.transform._rotation.set(mainCamera.transform.rotation);
};

const mouseWheelEvent = (e) => {
	if (player.ads > 0.1) {
		player.scope = Math.clamp(player.scope - Math.sign(e.deltaY) * 5, player.scopeRange.min, player.scopeRange.max);
	}
};

let shootTime = 0;

const updateInputs = () => {
	player.prevPosition.set(mainCamera.transform.position);

	prevMousePosition.set(mousePosition);
	mousePosition.set(Input.mousePosition);

	player.scopeScale = (player.scope - player.scopeRange.min) / player.scopeRange.diff;

	const spd = (0.5 + (Input.keyHold(KeyCode.Shift) && (player.ads < 0.1)) * 0.5) * Time.scaledDeltaTime;

	const forward = Vec3.mul(mainCamera.lookDir, spd * 0.05);
	const right = Vec3.mul(mainCamera.lookDirRight, spd * 0.05);

	// breath
	let sprintingShake = 0.2 * ((spd * 2) - 1);
	if (!(Input.keyHold(KeyCode.W) || Input.keyHold(KeyCode.S) || Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.A))) sprintingShake = 0;
	const a = Time.time * (0.001 + sprintingShake * 0.05);
	const b = 0.007 + sprintingShake;
	mainCamera.transform.rotation.x += Math.cos(a*2)*b;
	mainCamera.transform.rotation.y -= Math.cos(a)*b;

	// Up and down
	groundY += (Input.keyHold(KeyCode.E) - Input.keyHold(KeyCode.Q)) * spd * 0.1;

	// Move
	if (Input.keyHold(KeyCode.W)) {
		mainCamera.transform.position.add(forward);
	}

	if (Input.keyHold(KeyCode.S)) {
		mainCamera.transform.position.sub(forward);
	}

	if (Input.keyHold(KeyCode.D)) {
		mainCamera.transform.position.add(right);
	}

	if (Input.keyHold(KeyCode.A)) {
		mainCamera.transform.position.sub(right);
	}

	if (Input.keyDown(KeyCode.Space)) {
		player.vsp = player.jumpSpd;
	}

	player.vsp -= player.gravity;

	mainCamera.transform.position.y += player.vsp;
	if (mainCamera.transform.position.y <= groundY) {
		mainCamera.transform.position.y = groundY;
	}

	// ads
	player.ads = Math.range(player.ads, Input.mouseHold(2), 0.8);

	player.fov = 90 - player.scope * player.ads;

	// pewpew
	if (player.isShooting && Input.mouseHold(0) && Time.time > bulletTime && !player.reloading) {
		if (player.ammo > 0) {
			Emitter.preset('shell');
			let shellSize = 8;
			let rinc = Math.range(16, 20);
			if (player.ads > 0.1) shellSize += 20 * player.scopeScale;
			if (player.ammo % 2 === 0) {
				Emitter.setDirection(180+60, 180+50);
				rinc *= -1;
			}
			Emitter.spd.min *= shellSize * 0.07;
			Emitter.spd.max *= shellSize * 0.07;
			Emitter.setSize(shellSize, shellSize + 2);
			Emitter.setArea(Room.mid.w - 4, Room.mid.w + 4, Room.mid.h - 2, Room.mid.h + 2);
			Emitter.emitCustom({
				n: 1,
				rinc: {
					min: rinc,
					max: rinc
				}
			});
			player.ammo--;
			const b = createBullet();
			b.mesh.transform.position.set(Vec3.add(mainCamera.transform.position, Vec3.mul(mainCamera.lookDir, player.bulletOffset)));
			if (player.ads > 0.5) {
				// ads recoil
				mainCamera.transform.rotation.x -= 0.5;
				mainCamera.transform.rotation.y += Math.cos(shootTime * 0.01) * ((Math.sin(shootTime * 0.023) + 1) * 0.5);
				b.mesh.transform.position.add(Vec3.random(0.05, 0.05, 0));
				b.velocity.set(Vec3.mul(mainCamera.lookDir, player.bulletSpeed));
			}
			else {
				// hipfire recoil
				mainCamera.transform.rotation.x -= 1;
				b.mesh.transform.position.add(Vec3.random(0.1, 0.2, 0));
				b.velocity.set(Mat4.multiplyVector(matCameraRot, new Vec3(Math.range(-0.1, 0.1), 0, player.bulletSpeed)));
			}
			b.mesh.transform.rotation.set(mainCamera.transform.rotation);
			bulletTime = Time.time + 42;
		}
		else {
			// auto reload
			player.runReload();
		}
	}

	if (Input.mouseDown(0)) {
		if (!player.reloading && player.ammo > 0) {
			player.isShooting = true;
		}
		Sound.play('r99');
	}

	if (Sound.isPlaying('r99')) {
		if (!player.isShooting || !Input.mouseHold(0) || player.ammo <= 0 || player.reloading) {
			Sound.stop('r99');
		}
	}

	if (Input.keyDown(KeyCode.R)) {
		player.runReload();
	}

	if (Input.mouseHold(0)) {
		shootTime += Time.deltaTime;
	}
	else {
		shootTime = 0;
	}

	// Debug
	if (Input.keyDown(KeyCode.O)) showOutline = !showOutline;
	if (Input.keyDown(KeyCode.M)) debugClipping = !debugClipping;
	if (Input.keyDown(KeyCode.L)) {
		if (++optResIndex > 3) optResIndex = 0;
		switch (optResIndex) {
			case 0: Room.scale = 0.5; break;
			case 1: Room.scale = 1; break;
			case 2: Room.scale = 2; break;
			case 3: Room.scale = 4; break;
		}
		Room.resize();
	}
};

Game.update = () => {
	updateNetwork();

	totalTris = 0;
	totalTrisRasterized = 0;

	mainCamera.transform.rotation.x = Math.clamp(mainCamera.transform.rotation.x, -85, 85);
	mainCamera.transform._rotation.x = Math.clamp(mainCamera.transform._rotation.x, -85, 85);

	matCameraRot = Mat4.multiplyMatrix(Mat4.makeRotationX(mainCamera.transform._rotation.x), Mat4.makeRotationY(mainCamera.transform._rotation.y));

	mainCamera.lookDir = Mat4.multiplyVector(matCameraRot, Vec3.forward);
	mainCamera.lookDirRight = Mat4.multiplyVector(matCameraRot, Vec3.right);

	const target = Vec3.add(mainCamera.transform.position, mainCamera.lookDir);
	const matCamera = Mat4.pointAt(mainCamera.transform.position, target, Vec3.up);
	const matView = Mat4.quickInverse(matCamera);

	updateInputs();
	mainCamera.update();

	matProj = Mat4.makeProjection(Room.h / Room.w, player.fov);

	player.isMoving = !player.prevPosition.equal(mainCamera.transform.position);

	trianglesToRaster.length = 0;

	meshTri.update();
	trianglesToRaster = processMesh(meshTri, matProj, matView);

	for (let i = my3DObjects.length - 1; i >= 0; --i) {
		my3DObjects[i].update();
		trianglesToRaster = trianglesToRaster.concat(processMesh(my3DObjects[i].mesh, matProj, matView, my3DObjects[i].rgbVec));
	}

	const rgbVec = new Vec3(1, 0.5, 0.5);
	for (let i = bullets.length - 1; i >= 0; --i) {
		const b = bullets[i];
		b.alarm += Time.deltaTime;
		if (b.alarm > 3000) {
			bullets.splice(i, 1);
			continue;
		}
		b.mesh.transform.position.add(b.velocity);
		// If inside the default unrotated main cube
		if (meshTri.contains(b.mesh.transform.position)) {
			bullets.splice(i, 1);
			continue;
		}
		b.mesh.transform.rotation.x += 1;
		b.velocity.y -= player.bulletGravity;
		trianglesToRaster = trianglesToRaster.concat(processMesh(b.mesh, matProj, matView, rgbVec));
	}
};

const DrawBackground = () => {
	Draw.setColor(C.skyBlue);
	Draw.rect(0, 0, Room.w, Room.mid.h);
	Draw.setColor(C.green);
	Draw.rect(0, Room.mid.h, Room.w, Room.mid.h);
};

Game.render = () => {
	DrawBackground();
	rasterizeTriangles(trianglesToRaster);
};

const Inventory = {
	list: {},
	grabKey: KeyCode.F,
	grabKeyName: 'F',
	grabDistance: 2,
	add(key, amount) {
		if (!this.list[key]) {
			this.list[key] = 0;
		}
		return ++this.list[key];
	},
	draw() {
		// Draw.setFont(Font.m);
		// Draw.setColor(C.white);
		// Draw.setHVAlign(Align.l, Align.t);
		// const keys = Object.keys(this.list);
		// for (let i = keys.length - 1; i >= 0; --i) {
		// 	const j = this.list[keys[i]];
		// 	Draw.text(12, 12+Font.size*i, `${keys[i]}: ${j}`);
		// }
	}
};

Game.renderUI = () => {
	if (GLOBAL.debugMode % 2 !== 0) {
		Draw.setFont(Font.m);
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.l, Align.b);
		Draw.text(16, Room.h - 16, `${Time.FPS}\nGround Y: ${groundY.toFixed(2)}` +
			`\nPlayer Position: ${mainCamera.transform.position.toString(2)}` +
			`\nPlayer Rotation: ${mainCamera.transform.rotation.toString(2)}` +
			'\n[Left Click: Shoot]' +
			'\n[Right Click: Aim down sight]' +
			'\n[Left Click then Move Mouse: Look around]\n[W: Forward] [A: Left] [S: Backward] [D: Right]\n[Space: Jump] [Q: Lower ground] [E: Higher ground]' +
			`\nBullet count: ${bullets.length}`);
	}
	else {

		// BG
		const p = new Vector2(Room.w - 415, Room.h - 124);
		Draw.primitiveBegin();
		Draw.vertex(p.x + 36, p.y);
		Draw.vertex(p.x + 355, p.y);
		Draw.vertex(p.x + 366, p.y + 16);
		Draw.vertex(p.x + 316, p.y + 102);
		Draw.vertex(p.x + 24, p.y + 102);
		Draw.vertex(p.x, p.y + 60);
		Draw.setAlpha(0.5);
		Draw.setColor(C.black);
		Draw.primitiveEnd();
		Draw.setAlpha(1);

		// Ammo count
		Draw.setFont(Font.xxl, Font.bold);
		Draw.setColor(C.white);
		Draw.setHVAlign(Align.r, Align.b);
		Draw.text(Room.w - 138, Room.h - 74, player.ammo);
		Draw.setFont(Font.l);
		Draw.text(Room.w - 140, Room.h - 55, player.ammoCount);
	}

	if (player.ads > 0.1) {
		const img = document.createElement('canvas');
		img.width = Room.w;
		img.height = Room.h;
		Draw.setContext(img.getContext('2d'));

		const c = 25 - 25 * player.scopeScale;

		Draw.setColor(`rgb(${c}, ${c}, ${c})`);
		Draw.rect(0, 0, Room.w, Room.h);

		const scopeADSScale = 1 - player.ads;
		const posoffset = Room.mid.h;
		const scopePos = new Vector2(Room.mid.w, Room.mid.h + (Math.min(1, scopeADSScale * 2)) * posoffset);
		const r1 = Room.mid.h * (0.7 + 0.5 * player.scopeScale) + Room.mid.h * scopeADSScale;
		const r2 = Room.mid.w * (0.4 + 1 * player.scopeScale) + Room.mid.h * scopeADSScale;

		Draw.setColor(C.white);
		Draw.setHVAlign(Align.c, Align.m);
		Draw.setAlpha(0.2);
		Draw.CTX.font = `${12 + 48 * player.scopeScale}px ${Draw.fontDefault.join(',')} serif`;
		// Draw.text(Room.w - (Room.mid.w - Room.mid.h) * 0.5, Room.mid.h, `x${(player.scope * 0.1).toFixed(1)}`);
		Draw.text(Room.mid.w + r1 + (r2 - r1) * 0.5, Room.mid.h, `x${(player.scope * 0.1).toFixed(1)}`);
		Draw.setAlpha(1);

		Draw.CTX.globalCompositeOperation = 'destination-out';
		Draw.circle(scopePos.x, scopePos.y, r1);
		Draw.CTX.globalCompositeOperation = 'destination-in';
		Draw.circle(scopePos.x, scopePos.y, r2);
		Draw.CTX.globalCompositeOperation = 'source-over';

		Draw.resetContext();

		Draw.CTX.drawImage(img, 0, 0);

		Draw.setFont(Font.l);
		Draw.setHVAlign(Align.c, Align.m);
		for (let i = 0; i < 2; i++) {
			Draw.setColor(i > 0? C.lightGray : C.gray);
			Draw.text(Room.mid.w - i, Room.h - Font.size - i, `x${(player.scope * 0.1).toFixed(1)}`);
		}
	}

	// Reload time bar
	if (player.reloading) {
		const p = new Vector2(Room.w - 415, Room.h - 124);
		Draw.CTX.beginPath();
		const relSound = Sound.get('reload');
		const t = 0.04 + relSound.currentTime / relSound.duration;
		const tt = Math.PI * (0.5 - t);
		Draw.CTX.arc(p.x + 310, p.y + 42, 18, tt, tt + t * 2 * Math.PI);
		Draw.setColor(makeRGBLum({ r: 255, g: 255, b: 255 }, 0.2 + 0.8 * t));
		Draw.CTX.lineCap = 'round';
		Draw.CTX.lineWidth = 4;
		Draw.CTX.stroke();
		Draw.CTX.lineWidth = 1;
	}

	// Hover info
	if (Manager.hoveredTris.length > 0) {
		const hoveredTri = Manager.hoveredTris[Manager.hoveredTris.length - 1];
		const p = new Vector2(Room.mid.w, Room.mid.h);
		let name = '';
		let text = '';
		let distance = -1;
		let grabbable = false;
		if (hoveredTri.meshReference instanceof Mesh) {
			name = hoveredTri.meshReference.name;
			distance = Vec3.distance(hoveredTri.meshReference.transform.position, mainCamera.transform.position);
			grabbable = hoveredTri.meshReference.grabbable;
		}

		Draw.setFont(Font.m);
		Draw.setHVAlign(Align.l, Align.b);
		if (name === '') {
			name = 'Unknown';
			Draw.setFont(Font.m, Font.italic);
		}

		if (distance > 0) {
			text = `${name} (${~~distance}m)`;
		}
		else {
			text = name;
		}

		const t = Vector2.add(p, new Vector2(10, -10));
		t.w = Draw.textWidth(text);
		t.h = Font.size;

		Draw.primitiveBegin();
		Draw.vertex(p.x, p.y);
		Draw.vertex(t.x, t.y + 2);
		Draw.vertex(t.x - 2 + t.w + 10, t.y + 2);
		Draw.setColor(C.black);
		Draw.primitiveEnd(Primitive.line);
		Draw.circle(p.x, p.y, 2);
		Draw.setAlpha(0.5);
		Draw.rect(t.x, t.y - t.h - 2, t.w + 8, t.h + 4);
		Draw.setAlpha(1);

		Draw.setColor(C.white);
		Draw.text(t.x + 2, t.y, text);

		// grab stuff
		const executeOnGrab = () => {
			if (hoveredTri.meshReference instanceof Mesh) {
				if (hoveredTri.meshReference.onGrab) hoveredTri.meshReference.onGrab();
			}
			Inventory.add(name, 1);
		};
		if (grabbable) {
			if (distance < Inventory.grabDistance) {
				if (Input.keyDown(Inventory.grabKey)) {
					executeOnGrab();
				}
				Draw.setFont(Font.l);
				Draw.setColor(C.white);
				Draw.setShadow(0, 0, 10);
				Draw.text(t.x, p.y + t.h + 2, `[${Inventory.grabKeyName}]`);
				Draw.resetShadow();
			}
		}
	}

	// Inventory
	Inventory.draw();

	// mouse trail
	const mouseDiff = Vector2.subtract(mousePosition, prevMousePosition);
	if (Math.abs(mouseDiff.length) < 100) {
		const p = mousePosition;
		const len = mouseDiff.length * 0.01;
		const d = Math.pointdir(mousePosition, prevMousePosition);
		const p1 = Vector2.add(p, Math.lendir(len, d + 180));
		const p2 = Vector2.add(p, Math.lendir(len, d + 90));
		const p3 = Vector2.add(p, Math.lendir(len, d - 90));
		const p4 = Vector2.subtract(p, mouseDiff);
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(p1.x, p1.y);
		Draw.CTX.quadraticCurveTo(p2.x, p2.y, p4.x, p4.y);
		Draw.CTX.quadraticCurveTo(p3.x, p3.y, p1.x, p1.y);
		Draw.CTX.globalAlpha = 0.5;
		Draw.CTX.fillStyle = C.white;
		Draw.CTX.fill();
		Draw.CTX.globalAlpha = 1;
		if (document.pointerLockElement !== CANVAS) {
			Draw.plus(p.x, p.y, 8);
			Draw.circle(p.x, p.y, 3, true);
		}
		else {
			Draw.setColor(C.white);
			if (player.ads > 0.1) {
				Draw.CTX.lineWidth = 2;
				Draw.CTX.lineCap = 'round';
				Draw.plus(Room.mid.w, Room.mid.h, 16);
				Draw.circle(Room.mid.w, Room.mid.h, 6, true);
				Draw.CTX.lineWidth = 1;
			}
			else {
				Draw.setAlpha(0.5);
				Draw.circle(Room.mid.w, Room.mid.h, 3, true);
				Draw.setAlpha(1);
			}
		}
	}
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
// document.body.appendChild(file);

CANVAS.onclick = () => {
	CANVAS.requestPointerLock();
};

const lockChangeAlert = () => {
	if (document.pointerLockElement === CANVAS) {
		document.addEventListener('mousemove', mouseMoveEvent);
	}
	else {
		document.removeEventListener('mousemove', mouseMoveEvent);
	}
};

document.addEventListener('pointerlockchange', lockChangeAlert);
window.addEventListener('mousewheel', mouseWheelEvent);

BRANTH.start();
Room.start('Game');