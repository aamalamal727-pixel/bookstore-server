//import dotenv express cors
//Loads .env file contents into process.env

require('dotenv').config()
const express=require('express')
const cors=require('cors')
const router=require('./Routes/route')
require('./Connection/db')

//create a server using express
const bookStoreServer=express()
//enable cors in server
bookStoreServer.use(cors())
//parse json on server
bookStoreServer.use(express.json())
//user router in server app
bookStoreServer.use(router)
//handle image from server
bookStoreServer.use('/uploads',express.static('./uploads'))

//create a port for a server to avaiable on web
const PORT=3000
bookStoreServer.listen(PORT,()=>{
    console.log(`Bookstore server started running at PORT:${PORT}...and waiting for client request`);
    
})

bookStoreServer.get('/',(req,res)=>{
    res.status(200).send('<h1 style=color:violet>Bookstore server started running successfully.....</h1>')
})



