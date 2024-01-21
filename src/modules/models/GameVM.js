class CellVM {
    id
    constructor(row, col) {
        this.id = `${row}.${col}`;
    }
}

export class GameVM {
    rowsNum = 4
    columnsNum = 4
    cells = this.createCells()

    createCells() {
        const cells = [];
        for (let row = 0; row < this.rowsNum; row += 1) {
            for (let col = 0; col < this.columnsNum; col += 1) {
                cells.push(new CellVM(row, col))
            }
        }

        return cells;
    }
}
