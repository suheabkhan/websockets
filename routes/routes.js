const express=require('express')
const mongoose=require('mongoose')
const router=express.Router()
const Comment=mongoose.model('comment')
router.post('/addComment',(req,res)=>{
  new Comment({
      userName:req.body.userName,
      comment:req.body.comment
  }).save((err,docs)=>{
      if(!err){
          res.send(docs)
      }
      else{
          res.send(err)
      }
  })
});

router.get('/getAllComments',(req,res)=>{
    Comment.find({},(err,docs)=>{
        if(!err){
            res.send(docs)
        }
        else{
            res.send(err)
        }
    })
})

module.exports=router;