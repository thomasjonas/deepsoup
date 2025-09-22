// RectangleLayout.ts
export type Rect = { id: string; x: number; y: number; w: number; h: number; isPlaced?: false };

class RectangleLayoutClass {
	private containerWidth: number = 1200;
	private containerHeight: number = 800;
	private exclusions: Rect[] = [];
	private rectangles: Rect[] = [];

	// --- Helpers ---
	private overlaps(a: Rect, b: Rect) {
		return !(a.x + a.w <= b.x || a.x >= b.x + b.w || a.y + a.h <= b.y || a.y >= b.y + b.h);
	}

	private canPlace(rect: Rect) {
		return (
			!this.rectangles.some((r) => this.overlaps(r, rect)) &&
			!this.exclusions.some((e) => this.overlaps(e, rect))
		);
	}

	private getRandomPosition(rect: Rect) {
		const x = Math.random() * (this.containerWidth - rect.w);
		const y = Math.random() * (this.containerHeight - rect.h);
		return { ...rect, x, y };
	}

	public addExclusion(rect: Rect) {
		this.exclusions = this.exclusions.filter((r) => r.id !== rect.id);
		this.exclusions.push(rect);
	}

	public addRectangle(id: string, w: number, h: number) {
		this.rectangles = this.rectangles.filter((r) => r.id !== id);

		// add some margin
		const rect = { id, w: w * 1.2, h: h * 1.2, x: -w * 0.1, y: -h * 0.1 };
		let placedSuccessfully = false;
		for (let i = 0; i < 500; i++) {
			const candidate = this.getRandomPosition(rect);
			if (this.canPlace(candidate)) {
				placedSuccessfully = true;
				this.rectangles = [...this.rectangles, candidate];
				break;
			}
		}
		if (!placedSuccessfully) console.warn('Could not place rectangle', rect);

		return this.rectangles.find((r) => r.id === id)!;
	}

	public removeRectangle(id: string) {
		if (this.rectangles.length === 0) return;
		else this.rectangles = this.rectangles.filter((r) => r.id !== id);
	}

	public setContainerSize(width: number, height: number) {
		this.containerWidth = width;
		this.containerHeight = height;
		// this.placeRectangles();
	}

	public getExclusions() {
		return this.exclusions;
	}
}
export const RectangleLayout = new RectangleLayoutClass();
