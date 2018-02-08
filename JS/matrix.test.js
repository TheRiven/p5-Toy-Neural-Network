const matrixJS = require('./matrix');
test('Create a Matrix with 2 cols and 3 rows', () => {
    let matrix = new matrixJS(3, 2);
    expect(matrix.rows).toBe(3);
    expect(matrix.cols).toBe(2);
});
test('Adding scalar to a matrix', () => {
    let m = new matrixJS(3, 3);
    m.data[0] = [1, 2, 3];
    m.data[1] = [4, 5, 6];
    m.data[2] = [7, 8, 9];
    m.add(1);
    expect(m).toEqual({
        data: [
            [2, 3, 4],
            [5, 6, 7],
            [8, 9, 10]
        ],
        cols: 3,
        rows: 3
    });
});
