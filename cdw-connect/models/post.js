const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, required: true},
    text: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
});

const PostSchema = new Schema({
    title: {type: String, required: true, maxLength: 128},
    location: {type: String, required: true},
    link: {type: String, required: true},
    caption: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    likedBy: {type: [Schema.Types.ObjectId], default: []},
    comments: {type: [CommentSchema], default: []}
})

module.exports = mongoose.model("Post", PostSchema);