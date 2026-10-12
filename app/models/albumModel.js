const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let albumSchema = new Schema({
    _id: {  
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true
    },     
    numero: {type:Number},
    description: {type: String}
    
});

module.exports = mongoose.model("album", albumSchema,"album");