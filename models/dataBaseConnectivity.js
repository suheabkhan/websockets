const mongoose=require('mongoose');

const URI='mongodb://localhost/comments'

mongoose.connect(URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true
},(err,connection)=>{
if(err){
    console.log("err occured while connecting")
}
else{
    console.log("Connected to the database")
}
});

require('./commentSchema')