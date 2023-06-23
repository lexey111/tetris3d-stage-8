import type { TAnimations } from "./animation-manager";

export class CubeRotateYAnimations implements TAnimations {
    constructor(private cube) {
        //
    }

    public getAnimation = () => {
        return {
            duration: 3500,
            animationFn: this.doAnimation,
            finishFn: this.endAnimation,
            repeatCount: Infinity
        };
    }

    private doAnimation = (percentage) => {
        const distance = Math.PI * 2;
        const currentRotation = (distance * percentage) / 100;

        this.cube.rotation.y = currentRotation;
    }

    private endAnimation = () => {
        this.cube.rotation.y = 0;
    }
}
