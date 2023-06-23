import type { TAnimations } from "./animation-manager";

export class CubeRotateXAnimations implements TAnimations {
    constructor(private cube) {
        //
    }

    public getAnimation = () => {
        return {
            duration: 2000,
            animationFn: this.doAnimation,
            finishFn: this.endAnimation,
            repeatCount: Infinity
        };
    }

    private doAnimation = (percentage) => {
        const distance = Math.PI * 2;
        const currentRotation = (distance * percentage) / 100;

        this.cube.rotation.x = currentRotation;
    }

    private endAnimation = () => {
        this.cube.rotation.x = 0;
    }
}
