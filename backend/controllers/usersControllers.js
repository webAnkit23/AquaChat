const { options } = require('../routes/userRoutes');
const User = require('./../models/userModel');


async function searchUsers(req ,res ){
      const search = req.query.search;
    
    if(search){
        const Users =await User.find({
            $or :[{name : {$regex :search,$options :'i'}},{email: {$regex:search ,$options:'i'}}]
         } ,{password :0}).find({_id : {$ne : req.user._id}});
          res.status(200).json(Users);
     }
     else{
         res.status(404).json({
            message:'invalid query'
         })
    }

}
module.exports = {searchUsers};