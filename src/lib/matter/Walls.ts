import Matter from 'matter-js';

export class Walls {
	thickness = 50;
	left = Matter.Bodies.rectangle(0, 0, 0, 0, { isStatic: true, render: { visible: false } });
	top = Matter.Bodies.rectangle(0, 0, 0, 0, { isStatic: true, render: { visible: false } });
	right = Matter.Bodies.rectangle(0, 0, 0, 0, { isStatic: true, render: { visible: false } });
	bottom = Matter.Bodies.rectangle(0, 0, 0, 0, { isStatic: true, render: { visible: false } });

	constructor(params: { width: number; height: number }) {
		this.setSize(params.width, params.height);
	}

	getBodies() {
		return [this.top, this.left, this.bottom, this.right];
	}

	setSize(width: number, height: number) {
		Matter.Body.setPosition(this.top, { x: width / 2, y: -this.thickness / 2 });
		Matter.Body.setVertices(this.top, [
			{ x: -width / 2, y: -this.thickness / 2 },
			{ x: width / 2, y: -this.thickness / 2 },
			{ x: width / 2, y: this.thickness / 2 },
			{ x: -width / 2, y: this.thickness / 2 }
		]);

		Matter.Body.setPosition(this.bottom, { x: width / 2, y: height + this.thickness / 2 });
		Matter.Body.setVertices(this.bottom, [
			{ x: -width / 2, y: -this.thickness / 2 },
			{ x: width / 2, y: -this.thickness / 2 },
			{ x: width / 2, y: this.thickness / 2 },
			{ x: -width / 2, y: this.thickness / 2 }
		]);

		Matter.Body.setPosition(this.left, { x: -this.thickness / 2, y: height / 2 });
		Matter.Body.setVertices(this.left, [
			{ x: -this.thickness / 2, y: -height / 2 },
			{ x: -this.thickness / 2, y: height / 2 },
			{ x: this.thickness / 2, y: height / 2 },
			{ x: this.thickness / 2, y: -height / 2 }
		]);

		Matter.Body.setPosition(this.right, { x: width + this.thickness / 2, y: height / 2 });
		Matter.Body.setVertices(this.right, [
			{ x: -this.thickness / 2, y: -height / 2 },
			{ x: -this.thickness / 2, y: height / 2 },
			{ x: this.thickness / 2, y: height / 2 },
			{ x: this.thickness / 2, y: -height / 2 }
		]);
	}
}
