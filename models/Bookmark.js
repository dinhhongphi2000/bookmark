var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookmarkSchema = new Schema({
    name : {
        type: String,
        required : true
    },
    description : String,
    url : {
        type : String,
        required : function() {
            return this.isFolder === false
        }
    },
    parent : {
        type : String,
        required : true
    },
    index : {
        type : String,
        required : true
    },
    isFolder : {
        type : Boolean,
        default : true
    }
});

var Bookmark = mongoose.model('Bookmark',bookmarkSchema);
module.exports = Bookmark