function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
function dsigmoid(x) {
    return x * (1 - x);
}
class NeuralNetwork {
    constructor(input_nodes, hidden_nodes, output_nodes) {
        this.input_nodes = input_nodes;
        this.hidden_nodes = hidden_nodes;
        this.output_nodes = output_nodes;
        this.learning_rate = 0.1;
        this.weights_IH = new Matrix(this.hidden_nodes, this.input_nodes);
        this.weights_HO = new Matrix(this.output_nodes, this.hidden_nodes);
        this.weights_IH.randomize();
        this.weights_HO.randomize();
        this.hidden_bais = new Matrix(this.hidden_nodes, 1);
        this.output_bais = new Matrix(this.output_nodes, 1);
        this.hidden_bais.randomize();
        this.output_bais.randomize();
    }
    feedforward(input) {
        // Compute output of Hidden layer
        let input_layer = Matrix.fromArray(input);
        let hidden_layer = Matrix.multiply(this.weights_IH, input_layer);
        hidden_layer.add(this.hidden_bais);
        hidden_layer.map(sigmoid); // <-- Activation Function
        // Compute output of output layer
        let outputs = Matrix.multiply(this.weights_HO, hidden_layer);
        outputs.add(this.output_bais);
        outputs.map(sigmoid);
        return Matrix.toArray(outputs);
    }
    train(inputs, targets) {
        //let outputArr = this.feedforward(inputs);
        // Compute output of Hidden layer
        let input_layer = Matrix.fromArray(inputs);
        let hidden_layer = Matrix.multiply(this.weights_IH, input_layer);
        hidden_layer.add(this.hidden_bais);
        hidden_layer.map(sigmoid); // <-- Activation Function
        // Compute output of output layer
        let outputs = Matrix.multiply(this.weights_HO, hidden_layer);
        outputs.add(this.output_bais);
        outputs.map(sigmoid);
        // Convert to matrix objects
        //let outputs = Matrix.fromArray(outputArr);
        let target = Matrix.fromArray(targets);
        // Calculate the error (ERROR = TARGETS - OUTPUTS) 
        let output_errors = Matrix.subtract(target, outputs);
        // Work out gradient
        let gradients = Matrix.map(outputs, dsigmoid); // Derivative of sigmoid (already sigmoided so use dsigmoid func)
        gradients.hadamard(output_errors);
        gradients.multiply(this.learning_rate);
        // Calculate Deltas
        let hidden_t = Matrix.transpose(hidden_layer);
        let weight_ho_deltas = Matrix.multiply(gradients, hidden_t);
        // Adjust the weights and bias by deltas
        this.output_bais.add(gradients);
        this.weights_HO.add(weight_ho_deltas);
        // Calculate the hidden layer errors
        let who_t = Matrix.transpose(this.weights_HO);
        let hidden_errors = Matrix.multiply(who_t, output_errors);
        // Calculate hidden gradient
        let hidden_gradient = Matrix.map(hidden_layer, dsigmoid);
        hidden_gradient.hadamard(hidden_errors);
        hidden_gradient.multiply(this.learning_rate);
        // Calculate input -> hidden deltas
        let inputs_t = Matrix.transpose(input_layer);
        let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_t);
        // Adjust the weights and bias by deltas
        this.weights_IH.add(weight_ih_deltas);
        this.hidden_bais.add(hidden_gradient);
    }
}
