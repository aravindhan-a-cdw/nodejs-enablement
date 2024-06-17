const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const PostSchema = new Schema(
  {
    title: { type: String, required: true, maxLength: 128, unique: true },
    location: { type: String, required: true },
    link: { type: String, required: true },
    caption: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, rec) {
        delete rec.__v;
        return rec;
      }
    }
  }
);

const PostModel = mongoose.model("Post", PostSchema);
const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = {PostModel, CommentModel};
