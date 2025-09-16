import Matter from 'matter-js';

export class Box {
	body?: Matter.Body;
	world?: Matter.World;

	constructor(params: {
		world: Matter.World;
		x: number;
		y: number;
		width: number;
		height: number;
	}) {
		this.world = params.world;
		this.update(params.x, params.y, params.width, params.height);
	}

	update(x: number, y: number, width: number, height: number) {
		if (!this.world) return;
		if (this.body) Matter.World.remove(this.world, this.body);

		this.body = Matter.Bodies.rectangle(x, y, width, height, {
			isStatic: true,
			chamfer: { radius: 20 },
			render: { visible: false }
		});
		Matter.World.add(this.world, this.body);
	}
}
