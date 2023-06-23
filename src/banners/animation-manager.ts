export type TAnimationFn = (percentage: number, cycle?: number) => void;

export type TAnimationParams = {
	delay?: number
	delayBetween?: number
	duration: number
	repeatCount?: number

	animationFn: TAnimationFn // main animation cycle

	prepareFn?: () => void // before animation starts
	onCycleFn?: (cycle: number) => void // on every cycle finish/new start
	finishFn?: () => void // before remove
}

export type TAnimation = {
	startTime: number
	endTime: number
	duration: number
	delayBetween?: number
	currentPercentage: number
	markToDelete: boolean
	repeatCount?: number
	cycle: number
	started: boolean

	animationFn: TAnimationFn // main animation cycle

	prepareFn?: () => void // before animation starts
	onCycleFn?: (cycle: number) => void // on every cycle finish/new start
	finishFn?: () => void // before remove
}

export interface TAnimations {
	getAnimation: (animationName?: string) => TAnimationParams;
}


export class AnimationManager {
	animations: Array<TAnimation> = [];

	public add(params: TAnimationParams) {

		const startTime = Date.now() + (params.delay ? params.delay : 0);

		this.animations.push({
			startTime,
			endTime: startTime + params.duration,
			currentPercentage: 0,
			duration: params.duration,
			repeatCount: params.repeatCount,
			delayBetween: params.delayBetween,

			animationFn: params.animationFn,
			finishFn: params.finishFn,
			onCycleFn: params.onCycleFn,
			prepareFn: params.prepareFn,

			markToDelete: false,
			started: false,
			cycle: 1
		});

		params.prepareFn && params.prepareFn();
	}

	public play() {
		const now = Date.now();

		let needCleanup = false;
		// play cycle
		this.animations.forEach(animation => {
			if (animation.startTime > now) {
				return; // delay yet
			}
			if (!animation.started) {
				animation.started = true;
				animation.prepareFn && animation.prepareFn();
			}

			const fullDuration = animation.endTime - animation.startTime;
			const currentDuration = now - animation.startTime;
			const percentage = (currentDuration / fullDuration) * 100;

			if (percentage < 100) {
				animation.animationFn(percentage, animation.cycle);
				return;
			}

			animation.onCycleFn && animation.onCycleFn(animation.cycle);
			animation.animationFn(100, animation.cycle);

			if (!animation.repeatCount || animation.cycle === animation.repeatCount) {
				animation.markToDelete = true;
				needCleanup = true;
				return;
			}
			// new cycle
			animation.cycle++;

			animation.startTime = Date.now() + (animation.delayBetween ? animation.delayBetween : 0);
			animation.endTime = animation.startTime + animation.duration;
		});

		if (needCleanup) {
			this.cleanup();
		}
	}

	private cleanup() {
		// remove finished animations
		for (let i = this.animations.length - 1; i >= 0; i--) {
			if (this.animations[i].markToDelete) {
				this.animations[i].finishFn && this.animations[i].finishFn(); // cleanup if needed
				this.animations.splice(i, 1);
			}
		}
	}

	public dispose() {
		this.animations.length = 0;
	}
}
