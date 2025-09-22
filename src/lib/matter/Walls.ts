import Matter from 'matter-js';

const DEBUG = false;

export class Walls {
	world;
	thickness = 50;
	left?: Matter.Body;
	right?: Matter.Body;
	bottom?: Matter.Body;
	top?: Matter.Body;

	constructor(params: { world: Matter.World; width: number; height: number; positionTop: number }) {
		this.world = params.world;
		this.setSize(params.width, params.height, params.positionTop);
	}

	getBodies() {
		return [this.top, this.left, this.bottom, this.right];
	}

	setSize(width: number, height: number, positionTop: number) {
		if (height === 0 || width === 0) return;
		// Remove old bodies if they exist
		[this.top, this.bottom, this.left, this.right].forEach((body) => {
			if (body) Matter.World.remove(this.world, body);
		});

		// Create new walls
		this.top = Matter.Bodies.rectangle(
			width / 2,
			positionTop - this.thickness / 2,
			width,
			this.thickness,
			{ isStatic: true, render: { visible: DEBUG } }
		);

		this.bottom = Matter.Bodies.rectangle(
			width / 2,
			positionTop + height + this.thickness / 2,
			width,
			this.thickness,
			{ isStatic: true, render: { visible: DEBUG, fillStyle: 'red' } }
		);

		this.left = Matter.Bodies.rectangle(
			-this.thickness / 2,
			positionTop + height / 2,
			this.thickness,
			height,
			{ isStatic: true, render: { visible: DEBUG } }
		);

		this.right = Matter.Bodies.rectangle(
			width + this.thickness / 2,
			positionTop + height / 2,
			this.thickness,
			height,
			{ isStatic: true, render: { visible: DEBUG } }
		);

		// Add new walls to the world
		Matter.World.add(this.world, [this.top, this.bottom, this.left, this.right]);
	}
}
