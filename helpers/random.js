module.exports.intExclusive = function (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
};

module.exports.intInclusive = function (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
};
