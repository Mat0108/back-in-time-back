const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let imageSchema = new Schema({
    _id: {  
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
    },     
    image: { type: String },
    albumId: {type: Number},
    page: { type: Number},
    description:{ type:String}
});

module.exports = mongoose.model("images", imageSchema,"images");