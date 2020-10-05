Sound.add('r99', 'r99.mp3');
Sound.add('reload', 'reload.mp3');

const makeHueBright = (c, b) => {
	return `rgb(${c.r * b}, ${c.g * b}, ${c.b * b})`;
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
			out_tris[0].p[0] = inside_points[0];
			out_tris[0].p[1] = Vec3.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[0]);
			out_tris[0].p[2] = Vec3.intersectPlane(plane_p, plane_n, inside_points[0], outside_points[1]);
			return 1;
		}

		if (nInsidePointCount == 2 && nOutsidePointCount == 1)
		{
			out_tris[0].c = debugClipping? C.blue : in_tri.c;
			out_tris[1].c = debugClipping? C.red : in_tri.c;
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
		this.tris = tris;
		this.transform = {
			position: new Vec3(0, 0, 0),
			rotation: new Vec3(0, 0, 0)
		};
	}

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
}

const processMesh = (mesh, matProj, matView, hue=new Vec3(1, 1, 0.5)) => {
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
		tri.c = `rgb(${c*hue.x}, ${c*hue.y}, ${c*hue.z})`;

		// Convert world -> view space
		tri.p[0] = Mat4.multiplyVector(matView, tri.p[0]);
		tri.p[1] = Mat4.multiplyVector(matView, tri.p[1]);
		tri.p[2] = Mat4.multiplyVector(matView, tri.p[2]);

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

const rasterizeTriangles = (trianglesToRaster) => {
	trianglesToRaster.sort((a, b) => a.depth < b.depth? -1 : 1);

	Draw.CTX.lineJoin = LineJoin.round;
	for (let i = trianglesToRaster.length - 1; i >= 0; --i) {
		const triToRaster = trianglesToRaster[i];
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
			Draw.CTX.beginPath();
			Draw.CTX.moveTo(t.p[0].x, t.p[0].y);
			Draw.CTX.lineTo(t.p[1].x, t.p[1].y);
			Draw.CTX.lineTo(t.p[2].x, t.p[2].y);
			Draw.CTX.closePath();
			Draw.setColor(t.c);
			Draw.CTX.fill();
			Draw.CTX.stroke();
			if (showOutline) {
				Draw.CTX.strokeStyle = C.black;
				Draw.CTX.stroke();
			}
			totalTrisRasterized++;
		}
	}
};

let matProj = Mat4.makeProjection();

let mainCamera = {
	lookDir: new Vec3(),
	lookDirRight: new Vec3(),
	transform: {
		position: new Vec3(0, 0, 0),
		// pitch, yaw, roll
		rotation: new Vec3(0, 0, 0)
	}
};

class Bullet {
	constructor() {
		this.id = 0;
		this.mesh = Mesh.makeBullet();
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
	for (var i = bullets.length - 1; i >= 0; --i) {
		const b = bullets[i];
		if (b.id === id) {
			return bullets.splice(i, 1)[0];
		}
	}
	return null;
};

const meshTri = Mesh.makeCube();
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

let groundY = 0;

const Game = new BranthRoom('Game');

const player = {
	vsp: 0,
	ads: 0,
	fov: 90,
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
	ammoCount: 360,
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
};

const mouseWheelEvent = (e) => {
	if (player.ads > 0.1) {
		player.scope = Math.clamp(player.scope - Math.sign(e.deltaY) * 5, player.scopeRange.min, player.scopeRange.max);
	}
};

let shootTime = 0;

const updateInputs = () => {
	prevMousePosition.set(mousePosition);
	mousePosition.set(Input.mousePosition);

	player.scopeScale = (player.scope - player.scopeRange.min) / player.scopeRange.diff;

	const spd = (0.5 + (Input.keyHold(KeyCode.Shift) && (player.ads < 0.1)) * 0.5) * Time.scaledDeltaTime;

	const forward = Vec3.mul(mainCamera.lookDir, spd * 0.05);
	const right = Vec3.mul(mainCamera.lookDirRight, spd * 0.05);

	// breath
	let sprintingShake = 0.1 * ((spd * 2) - 1);
	if (!(Input.keyHold(KeyCode.W) || Input.keyHold(KeyCode.S) || Input.keyHold(KeyCode.D) || Input.keyHold(KeyCode.A))) sprintingShake = 0;
	mainCamera.transform.rotation.x += Math.cos(Time.time * (0.005 + sprintingShake * 0.1)) * (0.01 + sprintingShake * 2);
	mainCamera.transform.rotation.y += Math.sin(Time.time * (0.005 + sprintingShake * 0.1)) * (0.01 + sprintingShake);

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
			if (player.ads > 0.1) shellSize += 20 * player.scopeScale;
			Emitter.setSize(shellSize, shellSize + 2);
			Emitter.setSpeed(shellSize, shellSize);
			Emitter.setArea(Room.mid.w, Room.mid.w, Room.mid.h, Room.mid.h);
			Emitter.emit(1);
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
	totalTris = 0;
	totalTrisRasterized = 0;

	matCameraRot = Mat4.multiplyMatrix(Mat4.makeRotationX(mainCamera.transform.rotation.x), Mat4.makeRotationY(mainCamera.transform.rotation.y));

	mainCamera.lookDir = Mat4.multiplyVector(matCameraRot, Vec3.forward);
	mainCamera.lookDirRight = Mat4.multiplyVector(matCameraRot, Vec3.right);

	const target = Vec3.add(mainCamera.transform.position, mainCamera.lookDir);
	const matCamera = Mat4.pointAt(mainCamera.transform.position, target, Vec3.up);
	const matView = Mat4.quickInverse(matCamera);

	updateInputs();

	matProj = Mat4.makeProjection(Room.h / Room.w, player.fov);

	trianglesToRaster.length = 0;
	trianglesToRaster = processMesh(meshTri, matProj, matView);

	const hue = new Vec3(1, 0.5, 0.5);
	for (var i = bullets.length - 1; i >= 0; --i) {
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
		trianglesToRaster = trianglesToRaster.concat(processMesh(b.mesh, matProj, matView, hue));
	}
};

Game.render = () => {
	rasterizeTriangles(trianglesToRaster);
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
		Draw.setColor(makeHueBright({ r: 255, g: 255, b: 255 }, 0.2 + 0.8 * t));
		Draw.CTX.lineCap = 'round';
		Draw.CTX.lineWidth = 4;
		Draw.CTX.stroke();
		Draw.CTX.lineWidth = 1;
	}

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