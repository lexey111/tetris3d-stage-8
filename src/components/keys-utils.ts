import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import * as THREE from "three";
const loader = new SVGLoader();

function extrudeSVG(id, color, SVGScale, sizeL) {
    // https://muffinman.io/blog/three-js-extrude-svg-path/

    if (!document.getElementById('svg-' + id)) {
        throw new Error(`SVG [${id}] not found!`);
    }

    const svgMarkup = document.getElementById('svg-' + id).outerHTML;

    const svgData = loader.parse(svgMarkup);

    const svgGroup = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
        color
    });

    svgData.paths.forEach(path => {
        const shapes = path.toShapes(true);

        shapes.forEach(shape => {
            const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 100,
                bevelEnabled: true
            });

            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            mesh.scale.set(SVGScale, SVGScale, SVGScale);

            mesh.position.x = -(sizeL / 2);
            mesh.position.y = -(sizeL / 2);

            svgGroup.add(mesh);
        });
    });

    return svgGroup;
}


type TCreateKeyParams = {
    symbol?: string
    SVGScale: number
}

const keyColor = 0x223344;
const textColor = 0x777788;

export function createKey({
    symbol = 'arrow',
    SVGScale = 0,
}: TCreateKeyParams) {

    const grpKey = new THREE.Group();

    const keycapShape = extrudeSVG('key', keyColor, SVGScale, 3);
    const symbolShape = extrudeSVG(symbol, textColor, SVGScale, 3);

    keycapShape.position.z = -.5;
    if (symbol === 'arrow' || symbol === 'rotate') {
        symbolShape.scale.set(0.4, -0.4, 0.4);
    } else {
        symbolShape.scale.set(.8, -.8, .4);
    }
    symbolShape.position.z = -.1;

    grpKey.add(symbolShape);
    grpKey.add(keycapShape);
    grpKey.scale.set(0.96, 0.96, 1);

    return grpKey;
}
