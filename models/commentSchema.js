const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
userName:{
    type:String,
    required:true
},
comment:{
    type:String,
    required:true
}
},{
    timestamps:true
})

mongoose.model('comment',commentSchema);
