import * as THREE from "three";

const wallGeometry = new THREE.BoxGeometry(0.98, 0.98, 1.8);
const wallCubeMaterial = new THREE.MeshStandardMaterial({
    color: 0x7888a0,
    transparent: true,
    opacity: .5,
});
const wallCube = new THREE.Mesh(wallGeometry, wallCubeMaterial);

function createWallBrick(x, y, z) {
    const cube = wallCube.clone();
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cube.receiveShadow = true;

    return cube;
}

export function createWalls() {
    const wallGroup = new THREE.Group();
    // left
    const verticalWall = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        verticalWall.add(createWallBrick(0, i, 0));
    }
    // right
    const verticalWall2 = verticalWall.clone();
    verticalWall.position.setX(-5 - .5);
    verticalWall.position.setY(-9 - .5);

    verticalWall2.position.setX(5 + .5);
    verticalWall2.position.setY(-9 - .5);

    wallGroup.add(verticalWall);
    wallGroup.add(verticalWall2);

    // bottom
    const bottomWall = new THREE.Group();
    for (let i = 0; i < 12; i++) {
        bottomWall.add(createWallBrick(i, 0, 0));
    }
    bottomWall.position.setX(-6 + .5);
    bottomWall.position.setY(-10 - .5);
    wallGroup.add(bottomWall);

    return wallGroup;
}

const spaceGeometry = new THREE.SphereGeometry(0.03, 4, 4);
const spaceMaterial = new THREE.MeshStandardMaterial({ color: 0x9999FF });

export function createSpaceItems() {
    const spaceGroup = new THREE.Group();

    for (let i = 0; i <= 9; i++) {
        for (let j = 0; j <= 19; j++) {
            const item = new THREE.Mesh(spaceGeometry, spaceMaterial);
            item.position.set(i, j, -1);
            spaceGroup.add(item);
        }
    }
    spaceGroup.position.setX(-5 + .5);
    spaceGroup.position.setY(-10 + .5);

    return spaceGroup;
}
