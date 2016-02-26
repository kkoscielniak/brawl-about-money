var mongoose = require('mongoose');
    autoIncrement = require('mongoose-auto-increment');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
    question: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    answers: { type: Array, required: true }
});

questionSchema.virtual('id').get(function () {
   return this._id.toHexString();
});

questionSchema.set('toJSON', {
   virtuals: true
});

var Question = mongoose.model('Question', questionSchema);

module.exports = Question;
