class XORTest {
    constructor() {
        this.training_data = [
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
        createCanvas(400, 400);
        this.network = new NeuralNetwork(2, 2, 1);
        this.lr_slider = createSlider(0.01, 0.1, 0.05, 0.01);
    }
    draw() {
        background(0);
        this.network.learning_rate = this.lr_slider.value();
        for (let i = 0; i < 100; i++) {
            let data = random(this.training_data);
            this.network.train(data.inputs, data.targets);
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
                let output = this.network.feedforward([input_1, input_2]);
                let color = output[0] * 255;
                fill(color);
                noStroke();
                rect(x, y, resolution, resolution);
            }
        }
    }
}
