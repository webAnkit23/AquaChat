const mongoose = require('mongoose');
require('dotenv').config();
let connection =null;
const setConnectionToDb = async() =>{
    try{
     connection = await mongoose.connect(process.env.MONGO_URL);
    }
    catch(err){
        console.log(err);
    }
}
const getConnection =async () =>{
    return await connection;
}
module.exports ={setConnectionToDb,getConnection};