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
}

class Triangle {
	/**
	 * @param {object} points Array of `Vec3`.
	 */
	constructor(points) {
		this.p = points;
		this.c = 0;
		this.zMid = 0;
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

	calculateZMid() {
		this.zMid =  (this.p[0].z + this.p[1].z + this.p[2].z) * 0.3333333333333333;
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

	static multiplyVector(m, i) {
		let v = new Vec3();
		v.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
		v.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
		v.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
		v.w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];
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
		let matWorld = Mat4.multiplyMatrix(matRotZ, matRotX);
		matWorld = Mat4.multiplyMatrix(matWorld, matRotY);
		matWorld = Mat4.multiplyMatrix(matWorld, matTrans);
		return matWorld;
	}
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
}

const processMesh = (mesh, matProj, camera) => {
	const tris = [];
	for (let i = mesh.tris.length - 1; i >= 0; --i) {

		const tri = mesh.tris[i].clone();

		let matWorld = Mat4.makeWorld(mesh.transform);
		tri.p[0] = Mat4.multiplyVector(matWorld, tri.p[0]);
		tri.p[1] = Mat4.multiplyVector(matWorld, tri.p[1]);
		tri.p[2] = Mat4.multiplyVector(matWorld, tri.p[2]);

		// Normals
		const line1 = Vec3.sub(tri.p[1], tri.p[0]);
		const line2 = Vec3.sub(tri.p[2], tri.p[0]);
		const normal = Vec3.cross(line1, line2); normal.normalize();
		const cameraRay = Vec3.sub(tri.p[0], camera);
		if (Vec3.dot(normal, cameraRay) >= 0) continue;

		// Illumination
		const lightDirection = new Vec3(0, 0, -1); lightDirection.normalize();
		tri.c = Vec3.dot(normal, lightDirection);

		// Project triangles from 3D -> 2D
		tri.p[0] = Mat4.multiplyVector(matProj, tri.p[0]);
		tri.p[1] = Mat4.multiplyVector(matProj, tri.p[1]);
		tri.p[2] = Mat4.multiplyVector(matProj, tri.p[2]);
		tri.onAllPoints((p) => {
			p.div(p.w);
			p.addXY(1);
			p.mulXY(Room.mid.w, -Room.mid.h);
			p.y += Room.h;
		});

		tri.calculateZMid();

		tris.push(tri);
	}
	return tris;
};

const rasterizeTriangles = (trianglesToRaster) => {
	trianglesToRaster.sort((a, b) => a.zMid < b.zMid? -1 : 1);

	Draw.CTX.lineJoin = LineJoin.round;
	for (let i = trianglesToRaster.length - 1; i >= 0; --i) {
		const tri = trianglesToRaster[i];
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(tri.p[0].x, tri.p[0].y);
		Draw.CTX.lineTo(tri.p[1].x, tri.p[1].y);
		Draw.CTX.lineTo(tri.p[2].x, tri.p[2].y);
		Draw.CTX.closePath();

		const c = 50 + tri.c * 205;
		Draw.setColor(`rgb(${c}, ${c}, ${c * 0.5})`);
		Draw.CTX.fill();
		Draw.CTX.stroke();

		if (showOutline) {
			Draw.CTX.strokeStyle = C.black;
			Draw.CTX.stroke();
		}
	}
};

let matProj = Mat4.makeProjection();

let mainCamera = new Vec3(0, 0, 0);

const meshTri = Mesh.makeCube();
meshTri.transform.position.z = 5;

const meshRotGizmoY = Mesh.makeTorusLarge();
meshRotGizmoY.transform.position.z = 5;
meshRotGizmoY.transform.rotation.x = 90;

const meshRotGizmoX = Mesh.makeTorusMedium();
meshRotGizmoX.transform.position.z = 5;

const meshRotGizmoZ = Mesh.makeTorusSmall();
meshRotGizmoZ.transform.position.z = 5;
meshRotGizmoZ.transform.rotation.z = 90;

let showOutline = false;
let showRotGizmo = false;

let optResNames = ['Low', 'Normal', 'High', 'Ultra'];
let optResIndex = 1;

let trianglesToRaster = [];

const Game = new BranthRoom('Game');

Game.update = () => {
	const spd = 2 + Input.keyHold(KeyCode.Shift) * 8;
	const input = {
		position: new Vec3(
			(Input.keyHold(KeyCode.D) - Input.keyHold(KeyCode.A)) * spd * 0.1,
			(Input.keyHold(KeyCode.E) - Input.keyHold(KeyCode.Q)) * spd * 0.1,
			(Input.keyHold(KeyCode.W) - Input.keyHold(KeyCode.S)) * spd * 0.1
		),
		rotation: new Vec3(
			(Input.keyHold(KeyCode.Up) - Input.keyHold(KeyCode.Down)) * spd,
			(Input.keyHold(KeyCode.Left) - Input.keyHold(KeyCode.Right)) * spd,
			(Input.keyHold(KeyCode.Z) - Input.keyHold(KeyCode.C)) * spd
		)
	};

	if (Input.keyDown(KeyCode.U)) showOutline = !showOutline;
	if (Input.keyDown(KeyCode.H)) showRotGizmo = !showRotGizmo;
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

	matProj = Mat4.makeProjection(Room.h / Room.w);

	meshTri.transform.position.add(input.position);
	meshTri.transform.rotation.add(input.rotation);

	meshRotGizmoY.transform.position.add(input.position);
	meshRotGizmoX.transform.position.add(input.position);
	meshRotGizmoZ.transform.position.add(input.position);

	meshRotGizmoY.transform.rotation.y += input.rotation.y;

	meshRotGizmoX.transform.rotation.addXY(input.rotation);
	meshRotGizmoZ.transform.rotation.add(input.rotation);

	trianglesToRaster.length = 0;
	trianglesToRaster = processMesh(meshTri, matProj, mainCamera);

	if (showRotGizmo) {
		trianglesToRaster = trianglesToRaster
			.concat(processMesh(meshRotGizmoY, matProj, mainCamera))
			.concat(processMesh(meshRotGizmoX, matProj, mainCamera))
			.concat(processMesh(meshRotGizmoZ, matProj, mainCamera));
	}
};

Game.render = () => {
	rasterizeTriangles(trianglesToRaster);
};

Game.renderUI = () => {
	Draw.setFont(Font.m);
	Draw.setColor(C.white);
	Draw.setHVAlign(Align.l, Align.t);
	Draw.text(16, 48, Time.FPS +
		`\n${meshTri.transform.position.toString(2)}\n${meshTri.transform.rotation.toString(2)}` +
		`\nClick 'Choose File' to load an .obj model.` +
		'\nPress <W>, <A>, <S>, <D>, <Q>, and <E> to move around.' +
		'\nPress arrow buttons plus <Z> and <C> to rotate around.' +
		`\nPress <U> to ${showOutline? 'hide' : 'show'} outline.` +
		`\nPress <H> to ${showRotGizmo? 'hide' : 'show'} rotation gizmo.` +
		`\nPress <L> to change resolution (${optResNames[optResIndex]}).`);
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