var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class MNIST {
    constructor() {
        // MNIST data paths
        this.training_images_filename = 'train-images.idx3-ubyte';
        this.training_labels_filename = 'train-labels.idx1-ubyte';
        this.testing_images_filename = 't10k-images.idx3-ubyte';
        this.testing_labels_filename = 't10k-labels.idx1-ubyte';
        // Training Vars
        this.train_index = 0;
        this.correct_guesses = 0;
        // Testing Vars
        this.test_index = 0;
        this.total_tests = 0;
        this.total_correct = 0;
        createCanvas(400, 200).parent('container');
        this.network = new NeuralNetwork(784, 64, 10);
        this.LoadMNIST();
        this.user_digit = createGraphics(200, 200);
        this.user_digit.pixelDensity(1);
        this.train_image = createImage(28, 28);
    }
    draw() {
        background(0);
        // Test the digit drawn by the user with the network
        this.testUserDigit();
        // If all the MNIST data has been loaded start runing tests
        if (this.training_images && this.training_labels &&
            this.testing_images && this.testing_labels) {
            // Run in batches and only display the image on the last data set of the batch
            let trainBatch = 10;
            for (let i = 0; i < trainBatch; i++) {
                if (i == trainBatch - 1) {
                    this.train(true);
                }
                else {
                    this.train(false);
                }
            }
            let testBatch = 50;
            for (let i = 0; i < testBatch; i++) {
                this.testing();
            }
        }
        // Display the editable image for the user
        image(this.user_digit, 0, 0);
        if (mouseIsPressed) {
            this.user_digit.stroke(255);
            this.user_digit.strokeWeight(16);
            this.user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
        }
    }
    keyPressed(key) {
        if (key == ' ') {
            this.user_digit.background(0);
        }
    }
    testing() {
        let inputs = [];
        for (let i = 0; i < 784; i++) {
            let col = this.testing_images[i + this.test_index * 784];
            inputs[i] = col / 255;
        }
        // Do the Neural network stuff...
        let label = this.testing_labels[this.test_index];
        let prediction = this.network.feedforward(inputs);
        let guess = this.findMax(prediction);
        this.total_tests++;
        if (guess == label) {
            this.total_correct++;
        }
        let percentCorrect = (this.total_correct / this.total_tests) * 100;
        select('#percent').html(nf(percentCorrect, 2, 2));
        this.test_index++;
        if (this.test_index == this.testing_labels.length) {
            this.test_index = 0;
            console.log("Finished test set");
            console.log(percentCorrect);
            this.total_tests = 0;
            this.total_correct = 0;
        }
    }
    testUserDigit() {
        let img = this.user_digit.get();
        let inputs = [];
        img.resize(28, 28);
        img.loadPixels();
        for (let i = 0; i < 784; i++) {
            inputs[i] = img.pixels[i * 4] / 255;
        }
        let prediction = this.network.feedforward(inputs);
        let guess = this.findMax(prediction);
        select("#user_guess").html(guess);
        return img;
    }
    train(show) {
        let inputs = [];
        if (show) {
            this.train_image.loadPixels();
        }
        for (let i = 0; i < 784; i++) {
            let col = this.training_images[i + this.train_index * 784];
            inputs[i] = col / 255;
            if (show) {
                let index = i * 4;
                this.train_image.pixels[index + 0] = col;
                this.train_image.pixels[index + 1] = col;
                this.train_image.pixels[index + 2] = col;
                this.train_image.pixels[index + 3] = 255;
            }
        }
        if (show) {
            this.train_image.updatePixels();
            image(this.train_image, 200, 0, 200, 200);
        }
        // Do the Neural network stuff...
        let label = this.training_labels[this.train_index];
        let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        targets[label] = 1;
        //console.log(train_index);
        let prediction = this.network.feedforward(inputs);
        let guess = this.findMax(prediction);
        select('#label').html(label);
        select('#guess').html(guess);
        if (this.correct_guesses > 0) {
            select('#rate').html(nf((this.correct_guesses / this.train_index) * 100, 2, 2));
        }
        else {
            select('#rate').html('0');
        }
        this.network.train(inputs, targets);
        if (guess == label) {
            select('#info').class('correct');
            this.correct_guesses++;
        }
        else {
            select('#info').class('wrong');
        }
        this.train_index = (this.train_index + 1) % this.training_labels.length;
    }
    findMax(arr) {
        let record = 0;
        let index = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] > record) {
                record = arr[i];
                index = i;
            }
        }
        return index;
    }
    LoadMNIST() {
        this.fetchFile(this.training_images_filename, 16).then(data => {
            this.training_images = data;
        }).then(() => {
            console.log(this.training_images);
        });
        this.fetchFile(this.training_labels_filename, 8).then(data => {
            this.training_labels = data;
        }).then(() => {
            console.log(this.training_labels);
        });
        this.fetchFile(this.testing_images_filename, 16).then(data => {
            this.testing_images = data;
        }).then(() => {
            console.log(this.testing_images);
        });
        this.fetchFile(this.testing_labels_filename, 8).then(data => {
            this.testing_labels = data;
        }).then(() => {
            console.log(this.testing_labels);
        });
    }
    fetchFile(filename, header) {
        return __awaiter(this, void 0, void 0, function* () {
            let r = yield fetch('./MNIST data/' + filename);
            let data = yield r.arrayBuffer();
            return new Uint8Array(data).slice(header);
        });
    }
}
