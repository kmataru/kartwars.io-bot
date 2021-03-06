require('should');
var PriorityQueue = require('../lib/index.js').PriorityQueue;
describe('PriorityQueue', function () {
    describe('insert', function () {
        it('should return correct result', function () {
            var p = new PriorityQueue();
            p.insert(1, 4);
            p.insert(2, 1);
            p.insert(3, 2);
            p.insert(4, 3);
            p.getElements().should.eql([1, 4, 3, 2]);
            p.getPriorities().should.eql([4, 3, 2, 1]);
        });
    });
    describe('init', function () {
        it('should initialize queue correctly', function () {
            var p = new PriorityQueue([1, 2, 3, 4], [4, 1, 2, 3]);
            p.getElements().should.eql([1, 4, 3, 2]);
            p.getPriorities().should.eql([4, 3, 2, 1]);
        });
    });
});
