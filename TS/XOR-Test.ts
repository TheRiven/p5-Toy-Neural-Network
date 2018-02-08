// Quick fix for p5 javascript functions and values
declare let random: Function;
declare let createCanvas: Function;
declare let background: Function;
declare let rect: Function;
declare let fill: Function;
declare let noStroke: Function;
declare let createSlider;
declare let width: number;
declare let height: number;


let network : NeuralNetwork;

let training_data = [
    {
        inputs: [0, 0],
        targets: [0]
    },
    {
        inputs: [1, 1],
        targets: [0]
    },
    {
        inputs: [1, 0],
        targets: [1]
    },
    {
        inputs: [0, 1],
        targets: [1]
    }
];

let lr_slider;

function setup() 
{
    createCanvas(400, 400);
    network = new NeuralNetwork(2, 2, 1);

    lr_slider = createSlider(0.01, 0.1, 0.05, 0.01);
}

function draw() 
{
    background(0);

    network.learning_rate = lr_slider.value();

    for (let i = 0; i < 100; i++) {
        let data = random(training_data);
        network.train(data.inputs, data.targets);
    }

    let resolution = 20;
    let cols = Math.floor(width / resolution);
    let rows = Math.floor(height / resolution);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * resolution;
            let y = j * resolution;

            let input_1 = i / (cols - 1);
            let input_2 = j / (rows - 1);
            let output = network.feedforward([input_1, input_2]);
            let color = output[0] * 255;

            fill(color);
            noStroke();
            rect(x, y, resolution, resolution);
        }    
    }

}
