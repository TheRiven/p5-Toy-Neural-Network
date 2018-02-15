
let MNIST_Test;

function setup() {
    MNIST_Test = new MNIST();
}

function draw() {
    MNIST_Test.draw();
}

function keyPressed() {
    MNIST_Test.keyPressed(key);
}
