class Matrix 
{
    public data : number[][];
    public rows : number;
    public cols : number;

    constructor (rows: number, cols: number)
    {
        this.data = [];
        this.rows = rows;
        this.cols = cols;

        for(let i = 0; i < this.rows; i++)
        {
            this.data[i] = [];
            for(let j = 0; j < this.cols; j++)
            {
                this.data[i][j] = 0;
            }
        }
    }

    /** Convert an array of numbers into a Matrix object */
    static fromArray(arr : number[]) : Matrix
    {
        let m = new Matrix(arr.length, 1);

        for (let i = 0; i < arr.length; i++) 
        {
            m.data[i][0] = arr[i];
        }

        return m;
    }

    /** Convert from a Matrix object to an array of numbers */
    static toArray(m : Matrix) : number[] 
    {
        let arr : number[] = [];

        for(let i = 0; i < m.rows; i++)
        {
            for(let j = 0; j < m.cols; j++)
            {
                arr.push(m.data[i][j]);
            }
        }

        return arr;
    }

    /** Fill the Matrix with random numbers */
    randomize() : void
    {
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                this.data[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    /** Add a number or matrix of numbers to all the values of this matrix */
    add(n) : void
    {
        if (n instanceof Matrix) 
        {
            for(let i = 0; i < this.rows; i++)
            {
                for(let j = 0; j < this.cols; j++)
                {
                    this.data[i][j] += n.data[i][j];
                }
            }
        } else 
        {
            for(let i = 0; i < this.rows; i++)
            {
                for(let j = 0; j < this.cols; j++)
                {
                    this.data[i][j] += n;
                }
            }
        }
    }

    /** Returns a new matrix, a - b */
    static subtract(a: Matrix, b : Matrix) : Matrix
    {
        let result = new Matrix(a.rows, a.cols);

        for(let i = 0; i < result.rows; i++)
            {
                for(let j = 0; j < result.cols; j++)
                {
                    result.data[i][j] = a.data[i][j] - b.data[i][j];
                }
            }

        return result;
    }

    /** multiply the values of the matrix by a number to get the Scalar Product */
    multiply(n : number) : void
    {
        // Scalar Product
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                this.data[i][j] *= n;
            }
        }   
    }

    hadamard(matrix : Matrix) : void
    {
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                this.data[i][j] *= matrix.data[i][j];
            }
        }
    }

    /** Apply a given function to each value of the matrix */
    map(func : any) : void
    {
        // Apply a function to every element of the matrix
        for(let i = 0; i < this.rows; i++)
        {
            for(let j = 0; j < this.cols; j++)
            {
                let val =  this.data[i][j];
                this.data[i][j] = func(val);
            }
        }   
    }

     /** Apply a given function to each value of a matrix and return a new version of it */
     static map(matrix : Matrix, func : any) : Matrix
     {
        let result = new Matrix(matrix.rows, matrix.cols);

        // Apply a function to every element of the matrix
        for(let i = 0; i < result.rows; i++)
        {
            for(let j = 0; j < result.cols; j++)
            {
                let val =  matrix.data[i][j];
                result.data[i][j] = func(val);
            }
        }   

        return result;          
     }

    /** Get the Dot Product of two matrices */
    static multiply(a: Matrix, b: Matrix) : Matrix
    {
        if (a.cols !== b.rows) 
        {
            console.log('Cols of A must match rows of B');
            return undefined;
        }

        let result = new Matrix(a.rows, b.cols);

        for(let i = 0; i < result.rows; i++)
        {
            for(let j = 0; j < result.cols; j++)
            {
                // Dot product of values in col
                let sum = 0;
                for (let k = 0; k < a.cols; k++) 
                {
                    sum += a.data[i][k] * b.data[k][j];
                }

                result.data[i][j] = sum;
            }
        }

        return result;
    }

    /** Transpose the Matrix to flip the rows and columns */
    static transpose(m : Matrix) : Matrix
    {
        let result = new Matrix(m.cols, m.rows);

        for(let i = 0; i < m.rows; i++)
        {
            for(let j = 0; j < m.cols; j++)
            {
                result.data[j][i] = m.data[i][j];
            }
        }

        return result;
    }

    /** Print the matrix to the console in table form */
    print() : void
    {
        console.table(this.data);
    }

}