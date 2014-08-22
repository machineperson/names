var brain = require('brain')
var fs = require('fs') 

var nameNet = require("./name_network.js")

var utils = {
    normalisedSequence : function(str) {
        var sequence = [];

        for(var i = 0, len = str.length; i < len; i++) {
            var char = str[i];
            if(/[AEIOU]/.test(char))
            {
                sequence.push(0.5);
            }     
            else      
            {
                sequence.push(0.99);    
            }     
        }     

        while(sequence.length < 12)
        {
            sequence.push(0);
        }

        return sequence;
    }
}

var trainer = {
    training_data : [],
    network : function() {},

    // assumes that each word is on a single line in a text file
    readTrainingData: function(file, isName) {
        var names = fs.readFileSync(file).toString().split("\n");
        this.training_data = names.map(function(item) {
            return {input: utils.normalisedSequence(item),
                         output: [1]};
        });
        for(var i = 0; i < names.length; i++) {
        // generate random non-name string
            var string = Math.random().toString(36).toUpperCase().substr(0,12);
            this.training_data.push({input: utils.normalisedSequence(string), output: [0]});
        }
    },

    trainNetwork : function() {
        this.network = new brain.NeuralNetwork();
        console.log(this.network.train(this.training_data, {log: true}));
    }
}

var nnIsName = function(name) {
    trainer.trainNetwork();
    var output = trainer.network.run(utils.normalisedSequence(name));
    console.log(output);
    if(output > .5) {
        return "yes";
    }
    else {
        return "no";
    }
}

 trainer.readTrainingData("names.txt", 1.0);
 trainer.trainNetwork();
 console.log(trainer.network.toFunction().toString());

// console.log(nameNet.network(utils.normalisedSequence(process.argv[2].toUpperCase())));

if(process.argv.length >= 2) {
    console.log(trainer.network.run(utils.normalisedSequence(process.argv[2].toUpperCase())));
}

var results = {};
var names = fs.readFileSync("names.txt").toString().split("\n");
for(var i = 0; i < names.length; i++) {
    results[names[i]] = trainer.network.run(utils.normalisedSequence(names[i]));
}

// console.log(results);
