function Utils() {
}
KMEANS.prototype.getRandomVector = function (extremes) {
    var maxDim = extremes.length;
    var x = [];
    var r = 0;
    // calculate radius of n-sphere which covers all points in dataset
    var nSphereRadius = 0;
    for (var i = 0; i < maxDim; i++) {
        var extreme = extremes[i];
        var er = Math.max(extreme.center - extreme.min, extreme.center - extreme.max);
        if (er > nSphereRadius)
            nSphereRadius = er;
    }
    for (var i = 0; i < maxDim; i++) {
        var val = (Math.random() * 2) - 1;
        // adjust to radius of n-sphere
        x.push(val);
        r += val * val;
    }
    r = Math.sqrt(r);
    for (var i = 0; i < maxDim; i++) {
        x[i] /= r;
        // resize to fit n-sphere
        x[i] *= nSphereRadius;
        x[i] += extremes[i].center;
    }
    return x;
};
