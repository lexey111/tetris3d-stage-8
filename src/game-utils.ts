import type { Array10, TGameField } from "./components/types";

function traverseBottomTop(field, callback: (row, col) => void) {
    for (let row = 0; row < field.length; row++) {
        for (let col = 0; col < field[row].length; col++) {
            callback(row, col);
        }
    }
}

function makeAllSolids(field) {
    traverseBottomTop(field, (row, col) => {
        if (field[row][col] === 1) {
            field[row][col] = 2;
        }
    });
}

export function fallDown(field) {
    let finished = false;
    let stopRow = -1;
    let hasToRemove = false;

    traverseBottomTop(field, (row, col) => {
        const block = field[row][col];

        if (block !== 1) {
            return;
        }

        if (row === 0) {
            finished = true;
            stopRow = row;
            makeAllSolids(field);
            return;
        }

        const blockBelow = row > 0 ? field[row - 1][col] : 0;
        if (block === 1 && (blockBelow && blockBelow !== 1)) {
            finished = true;
            stopRow = row;
            makeAllSolids(field);
        }
    });

    if (!finished) {
        traverseBottomTop(field, (row, col) => {
            const block = field[row][col];

            if (block !== 1) {
                // empty cell or solid block
                return;
            }
            // move it down!
            field[row - 1][col] = 1;
            field[row][col] = 0;
        });
    }

    for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
        const line = field[rowIdx];
        const filled = line.filter(cell => cell === 2).length === line.length;

        if (filled) {
            hasToRemove = true;
            for (let x = 0; x < field[rowIdx].length; x++) {
                field[rowIdx][x] = 3;
            }
        }
    }

    return {
        finished,
        stopRow,
        hasToRemove
    };
}

export function removeFilledLines(field) {
    let count = 0;
    for (let rowIdx = 0; rowIdx < 20; rowIdx++) {
        const line = field[rowIdx];
        const filled = line.filter(cell => cell === 3).length === line.length;

        if (filled) {
            for (let x = 0; x < field[rowIdx].length; x++) {
                field[rowIdx][x] = 0;
            }
            count++;

            // move all the rows above down 1 cell
            for (let i = rowIdx + 1; i < 20; i++) {
                for (let j = 0; j < line.length; j++) {
                    if (field[i][j] !== 1) {
                        field[i - 1][j] = field[i][j];
                        field[i][j] = 0;
                    }
                }
            }
            rowIdx--; // step backward
        }
    }

    return count;
}

function traverseBottomTopRight(field, callback: (row, col) => void) {
    for (let row = 0; row < field.length; row++) {
        for (let col = field[row].length - 1; col >= 0; col--) {
            callback(row, col);
        }
    }
}


export function moveFigureLeft(GameField) {
    let canMove = true;

    traverseBottomTop(GameField, (row, col) => {
        const block = GameField[row][col];

        if (block !== 1) {
            return;
        }

        if (col === 0 || GameField[row][col - 1] === 2) {
            canMove = false;
        }
    });

    if (!canMove) {
        return;
    }

    traverseBottomTop(GameField, (row, col) => {
        const block = GameField[row][col];

        if (block !== 1) {
            return;
        }

        GameField[row][col - 1] = 1;
        GameField[row][col] = 0;
    });
}

export function moveFigureRight(GameField) {
    let canMove = true;

    const width = GameField[0].length;

    traverseBottomTop(GameField, (row, col) => {
        const block = GameField[row][col];

        if (block !== 1) {
            return;
        }

        if (col === width - 1 || GameField[row][col + 1] === 2) {
            canMove = false;
        }
    });

    if (!canMove) {
        return;
    }

    traverseBottomTopRight(GameField, (row, col) => {
        const block = GameField[row][col];

        if (block !== 1) {
            return;
        }

        GameField[row][col + 1] = 1;
        GameField[row][col] = 0;
    });
}

export function rotateFigure(field) {
    // 1. scan for figure
    let figure = [];
    let minIdx = field[0].length;
    let maxIdx = 0;
    let firstRow = -1;

    for (let row = field.length - 1; row >= 0; row--) {
        let line = '';
        for (let col = 0; col < field[row].length; col++) {
            if (field[row][col] === 1) {
                line += '#';
                if (col < minIdx) {
                    minIdx = col;
                }
                if (col > maxIdx) {
                    maxIdx = col;
                }
                if (firstRow < row) {
                    firstRow = row;
                }
            } else {
                line += ' ';
            }
        }
        if (line.trim()) {
            figure.push(line);
        }
    }
    const rawWidth = maxIdx - minIdx + 1;
    const rawHeight = figure.length;
    if (rawWidth === rawHeight) {
        // square, nothing to do
        return false;
    }

    // 2. Transpond figure
    figure = figure.map(line => line.substring(minIdx, minIdx + rawWidth));
    if (firstRow > 22) {
        return false;
    }

    const newFigure = [];
    for (let i = 0; i < rawWidth; i++) {
        newFigure[i] = new Array(rawHeight);
    }

    for (let row = 0; row < newFigure.length; row++) {
        for (let col = 0; col < newFigure[row].length; col++) {
            if (figure[col][row] !== ' ') {
                newFigure[newFigure.length - row - 1][col] = '#';
            }
        }
    }

    // 3. Cleanup copy of field...
    const tempField = copyField(field);

    traverseBottomTop(tempField, (row, col) => {
        if (tempField[row][col] === 1) {
            tempField[row][col] = 0;
        }
    });

    // 4. ...and put new figure there, if possible
    let allow = true;
    let nRow = 0;

    for (let row = firstRow; row > firstRow - newFigure.length; row--) {
        for (let col = minIdx; col < minIdx + rawHeight; col++) {
            const nCol = col - minIdx;

            if (nRow >= 0 && nRow < newFigure.length && nCol >= 0 && nCol < rawHeight) {
                if (row < 0 || col < 0 || col >= tempField[0].length) {
                    allow = false;
                }
                if (newFigure[nRow][nCol]) {
                    if (tempField[row][col] === 2) {
                        allow = false;
                    }
                    if (allow) {
                        tempField[row][col] = 1;
                    }
                }
            }
        }
        nRow++;
    }

    // 5. If allowed, copy transponded figure to the real field
    if (!allow) {
        return false;
    }
    traverseBottomTop(field, (row, col) => {
        if (tempField[row][col]) {
            field[row][col] = tempField[row][col];
        } else {
            field[row][col] = 0;
        }
    });
    return true;
}

export function createGameField() {
    const field = new Array<Array10>(24) as TGameField;
    for (let row = 0; row < field.length; row++) {
        if (!field[row]) {
            field[row] = new Array<number>(10) as Array10;
        }
        for (let col = 0; col < field[row].length; col++) {
            field[row][col] = 0;
        }
    }
    return field;
}

function copyField(GameField) {
    const tempField = createGameField();

    traverseBottomTop(GameField, (row, col) => {
        if (GameField[row][col]) {
            tempField[row][col] = GameField[row][col];
        }
    });
    return tempField;
}