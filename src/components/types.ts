import * as THREE from "three";

export type TThreeFrame = {
    renderer: THREE.WebGLRenderer
    scene: THREE.Scene
    camera: THREE.OrthographicCamera | THREE.PerspectiveCamera
}

type GrowToSize<T, N extends number, A extends T[]> = A['length'] extends N ? A : GrowToSize<T, N, [...A, T]>;
type FixedArray<T, N extends number> = GrowToSize<T, N, []>;
type CellType = 0 | 1 | 2 | 3;
// 0 - empty
// 1 - falling
// 2 - solid
// 3 - marked to delete

type Tuple<
    T,
    N extends number,
    R extends T[] = [],
> = R['length'] extends N ? R : Tuple<T, N, [T, ...R]>;

export type Array10 = Tuple<CellType, 10>;

export type TGameField = FixedArray<Array10, 24>;
