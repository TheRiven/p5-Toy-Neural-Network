let training_images;
let training_labels;
let testing_images;
let testing_labels;

const training_images_filename = 'train-images.idx3-ubyte'
const training_labels_filename = 'train-labels.idx1-ubyte'
const testing_images_filename = 't10k-images.idx3-ubyte'
const testing_labels_filename = 't10k-labels.idx1-ubyte'

let train_index = 0;
let correct_guesses = 0;
let network;

let user_digit;

function setup() {
    createCanvas(400, 200).parent('container');
    network = new NeuralNetwork(784, 16, 10);
    LoadMNIST();
    user_digit = createGraphics(200, 200);
    user_digit.pixelDensity(1);
}

function draw() {
    background(0);

    let user = testUserDigit();

    if (training_images && training_labels && testing_images && testing_labels) {
        for (let i = 0; i < 10; i++) {
            train();
        }        
    }

    image(user_digit, 0, 0);

    if (mouseIsPressed){
        user_digit.fill(255);
        user_digit.stroke(255);
        user_digit.ellipse(mouseX, mouseY, 16);
    }
}

function keyPressed() {
    if (key == ' ') {
        user_digit.background(0);
    }
}

function testUserDigit() {
    let img = user_digit.get();
    let inputs = [];

    img.resize(28, 28);
    img.loadPixels();

    for (let i = 0; i < 784; i++) {
        inputs[i] = img.pixels[i * 4];
    }

    let prediction = network.feedforward(inputs);
    let guess = findMax(prediction);

    select("#user_guess").html(guess);

    return img;
}

function train() {
    let inputs = [];

    let img = createImage(28, 28);
    img.loadPixels();

    for (let i = 0; i < 784; i++) {
        let index = i * 4;
        let col = training_images[i + train_index * 784];
        inputs[i] = col / 255;
        img.pixels[index + 0] = col;
        img.pixels[index + 1] = col;
        img.pixels[index + 2] = col;
        img.pixels[index + 3] = 255;
    }

    img.updatePixels();

    image(img, 200, 0, 200, 200);

    // Do the Neural network stuff...
    let label = training_labels[train_index];
    let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    targets[label] = 1;

    console.log(train_index);

    let prediction = network.feedforward(inputs);
    let guess = findMax(prediction);

    select('#label').html(label);
    select('#guess').html(guess);

    if (correct_guesses > 0) {
        select('#rate').html((correct_guesses / train_index) * 100);
    }
    else {
        select('#rate').html('0');
    }

    network.train(inputs, targets); 
    
    if (guess == label) {
        select('#info').class('correct');
        correct_guesses++;
    } else {
        select('#info').class('wrong');
    }

    train_index++;
}

function findMax(arr) {
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

function LoadMNIST() {
    fetchFile(training_images_filename, 16).then(data => {
        training_images = data;
    }).then(() => {
        console.log(training_images);
    });

    fetchFile(training_labels_filename, 8).then(data => {
        training_labels = data;
    }).then(() => {
        console.log(training_labels);
    });

    fetchFile(testing_images_filename, 16).then(data => {
        testing_images = data;
    }).then(() => {
        console.log(testing_images);
    });

    fetchFile(testing_labels_filename, 8).then(data => {
        testing_labels = data;
    }).then(() => {
        console.log(testing_labels);
    });
}

async function fetchFile(filename, header) {
    let r = await fetch('./MNIST data/' + filename);
    let data = await r.arrayBuffer();
    return new Uint8Array(data).slice(header);
}
