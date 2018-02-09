const matrixJS = require('../matrix');
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
test('Testing the Mapping Function with a simple addition', () => {
    let m = new matrixJS(2, 2);
    m.data[0] = [1, 2];
    m.data[1] = [3, 4];
    m.map((x) => {
        return x + 1;
    });
    expect(m).toEqual({
        data: [
            [2, 3],
            [4, 5]
        ],
        cols: 2,
        rows: 2
    });
});
test('Testing the matrix transpose function', () => {
    let m = new matrixJS(2, 2);
    m.data[0] = [1, 2];
    m.data[1] = [3, 4];
    let m2 = matrixJS.transpose(m);
    expect(m2).toEqual({
        data: [
            [1, 3],
            [2, 4]
        ],
        cols: 2,
        rows: 2
    });
});
test('Test Matrix to Array conversion', () => {
    let m = new matrixJS(2, 2);
    m.data[0] = [1, 2];
    m.data[1] = [3, 4];
    let a = matrixJS.toArray(m);
    expect(a).toEqual([1, 2, 3, 4]);
});
test('Test Array to Matrix conversion', () => {
    let a = [1, 2, 3, 4];
    let m = matrixJS.fromArray(a);
    expect(m).toEqual({
        data: [
            [1],
            [2],
            [3],
            [4]
        ],
        cols: 1,
        rows: 4
    });
});
