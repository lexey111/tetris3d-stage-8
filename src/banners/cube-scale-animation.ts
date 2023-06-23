import type { TAnimations } from "./animation-manager";

export class CubeScaleAnimations implements TAnimations {
    constructor(private cube) {
        //
    }

    public getAnimation = () => {
        return {
            duration: 6000,
            animationFn: this.doAnimation,
            finishFn: this.endAnimation,
            repeatCount: Infinity
        };
    }

    private doAnimation = (percentage) => {
        const distance = Math.PI * 2;
        const currentScale = Math.abs(Math.sin((distance * percentage) / 100)) + .5;

        this.cube.scale.set(currentScale, currentScale, currentScale);
    }

    private endAnimation = () => {
        this.cube.scale.set(1, 1, 1);
    }
}
