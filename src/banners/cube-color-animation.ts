import type { TAnimations } from "./animation-manager";

export class CubeColorAnimations implements TAnimations {
    private material;

    constructor(private cube) {
        this.material = this.cube.children[0].material;
    }

    public getAnimation = () => {
        return {
            duration: 10000,
            animationFn: this.doAnimation,
            repeatCount: Infinity
        };
    }

    private doAnimation = (percentage) => {
        const distance = Math.PI * 2;
        const currentScale = Math.abs(Math.sin((distance * percentage) / 100));

        const currentColor = Math.floor(255 * currentScale);

        this.material.color.set((256 - currentColor) + currentColor * 256 + currentColor * 256 * 256);
    }
}
