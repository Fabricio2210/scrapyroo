const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchemaModelo = new Schema({
    urlSite:{
       type: String,
       required: true 
    },
    imgPath:{
        type:Array
    },
    pathId:{
        type: String,
        required: true
    }
});

mongoose.model('urlSchema',urlSchemaModelo)
