const matrixJS = require('./matrix')

test ('Create a Matrix with 2 cols and 3 rows', () => {
    let matrix = new matrixJS(3, 2);
    expect(matrix.rows).toBe(3);
    expect(matrix.cols).toBe(2);
})
