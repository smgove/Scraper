var mongoose = require("mongoose");

var Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false);

var ArticleSchema = new Schema({
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      unique: true
    },
    text: {
      type: String,
      required: true
    },
    saved: {
      type: Boolean,
      default: false
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
      }]

  });

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;