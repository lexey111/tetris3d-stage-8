import * as THREE from "three";
import type { TFigure, TFigureType } from "./figures";
import { Figures } from "./figures";

const FigureCache: Record<keyof typeof Figures, TFigure> = {};

export function createFigure(type: TFigureType): TFigure {
    if (!FigureCache[type]) {
        renderFigureToCache(type);
    }
    return FigureCache[type];
}

const cubeGeometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffa600 });

export function createCube(material?) {
    return new THREE.Mesh(cubeGeometry, material || cubeMaterial);
}

function renderFigureToCache(type: TFigureType) {
    const symbol = Figures[type];
    if (!symbol) {
        return;
    }

    const group = new THREE.Group();

    const SymbolHeight = symbol.length;
    let maxWidth = 0;

    for (let line = 0; line < SymbolHeight; line++) {
        let matrix = symbol[line].split('');
        if (matrix.length > maxWidth) {
            maxWidth = matrix.length;
        }

        for (let cell = 0; cell < matrix.length; cell++) {
            if (matrix[cell] !== ' ') {
                const pixel = createCube();
                pixel.position.set(cell, SymbolHeight - line, 0);
                pixel.castShadow = true;
                pixel.receiveShadow = true;

                group.add(pixel);
            }
        }
    }

    FigureCache[type] = {
        type,
        object: group,
        width: maxWidth,
        height: SymbolHeight
    };
}
