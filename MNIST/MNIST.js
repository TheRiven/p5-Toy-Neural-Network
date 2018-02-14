/*global 
background createCanvas NeuralNetwork createGraphics createImage
mouseX mouseY pmouseX pmouseY mouseIsPressed image key select
nf
*/

// MNIST Data Vars
let training_images;
let training_labels;
let testing_images;
let testing_labels;

// MNIST data paths
const training_images_filename = 'train-images.idx3-ubyte'
const training_labels_filename = 'train-labels.idx1-ubyte'
const testing_images_filename = 't10k-images.idx3-ubyte'
const testing_labels_filename = 't10k-labels.idx1-ubyte'

// Neural Network
let network;

// Training Vars
let train_index = 0;
let correct_guesses = 0;
let train_image;

// Testing Vars
let test_index = 0;
let total_tests = 0;
let total_correct = 0;

// User input test image
let user_digit;

function setup() {
    createCanvas(400, 200).parent('container');
    network = new NeuralNetwork(784, 64, 10);
    LoadMNIST();
    user_digit = createGraphics(200, 200);
    user_digit.pixelDensity(1);

    train_image = createImage(28, 28);
}

function draw() {
    background(0);

    // Test the digit drawn by the user with the network
    testUserDigit();

    // If all the MNIST data has been loaded start runing tests
    if (training_images && training_labels && testing_images && testing_labels) {

        // Run in batches and only display the image on the last data set of the batch
        let trainBatch = 10;
        for (let i = 0; i < trainBatch; i++) {
            if (i == trainBatch - 1) {
                train(true);
            } else {
                train(false);
            }
        }

        let testBatch = 50;
        for (let i = 0; i < testBatch; i++) {
            testing();        
        }
        
    }

    // Display the editable image for the user
    image(user_digit, 0, 0);

    if (mouseIsPressed) {
        user_digit.stroke(255);
        user_digit.strokeWeight(16);
        user_digit.line(mouseX, mouseY, pmouseX, pmouseY);
    }
}

// Check if the spacebar has been pressed and reset the user image if it has
function keyPressed() {
    if (key == ' ') {
        user_digit.background(0);
    }
}

function testing() {
    let inputs = [];    

    for (let i = 0; i < 784; i++) {
        let col = testing_images[i + test_index * 784];
        inputs[i] = col / 255;
    }

    // Do the Neural network stuff...
    let label = testing_labels[test_index];

    let prediction = network.feedforward(inputs);
    let guess = findMax(prediction);

    total_tests++;

    if (guess == label) {
        total_correct++;
    }

    let percentCorrect = (total_correct / total_tests) * 100;

    select('#percent').html(nf(percentCorrect, 2, 2));
    
    test_index++;
    if (test_index == testing_labels.length){
        test_index = 0;
        console.log("Finished test set");
        console.log(percentCorrect);
        total_tests = 0;
        total_correct = 0;
    }
}

function testUserDigit() {
    let img = user_digit.get();
    let inputs = [];

    img.resize(28, 28);
    img.loadPixels();

    for (let i = 0; i < 784; i++) {
        inputs[i] = img.pixels[i * 4] / 255;
    }

    let prediction = network.feedforward(inputs);
    let guess = findMax(prediction);

    select("#user_guess").html(guess);

    return img;
}

function train(show) {
    let inputs = [];

    if (show) {
        train_image.loadPixels();
    }

    for (let i = 0; i < 784; i++) {
        let col = training_images[i + train_index * 784];
        inputs[i] = col / 255;

        if (show) {
            let index = i * 4;
            train_image.pixels[index + 0] = col;
            train_image.pixels[index + 1] = col;
            train_image.pixels[index + 2] = col;
            train_image.pixels[index + 3] = 255;
        }
    }

    if (show) {
        train_image.updatePixels();
        image(train_image, 200, 0, 200, 200);
    }

    // Do the Neural network stuff...
    let label = training_labels[train_index];
    let targets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    targets[label] = 1;

    //console.log(train_index);

    let prediction = network.feedforward(inputs);
    let guess = findMax(prediction);

    select('#label').html(label);
    select('#guess').html(guess);

    if (correct_guesses > 0) {
        select('#rate').html(nf((correct_guesses / train_index) * 100, 2, 2));
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

    train_index = (train_index + 1) % training_labels.length;
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
