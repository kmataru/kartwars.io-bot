var KMEANS = require('../lib/index.js').KMEANS;
var dataset = [
    [1, 1], [0, 1], [1, 0],
    [10, 10], [10, 13], [13, 13],
    [54, 54], [55, 55], [89, 89], [57, 55]
];
var kmeans = new KMEANS();
var clusters = kmeans.run(dataset, 3);
console.log(clusters);
