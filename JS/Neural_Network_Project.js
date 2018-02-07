let network;
let training_data = [
    {
        inputs: [1, 0],
        targets: [1]
    },
    {
        inputs: [0, 1],
        targets: [1]
    },
    {
        inputs: [0, 0],
        targets: [0]
    },
    {
        inputs: [1, 1],
        targets: [0]
    }
];
function setup() {
    network = new NeuralNetwork(2, 2, 1);
    for (let i = 0; i < 50000; i++) {
        let data = random(training_data);
        network.train(data.inputs, data.targets);
    }
    console.table(network.feedforward([0, 1]));
    console.table(network.feedforward([1, 0]));
    console.table(network.feedforward([0, 0]));
    console.table(network.feedforward([1, 1]));
}
function draw() {
}
function doubleIt(x) {
    return x * 2;
}
