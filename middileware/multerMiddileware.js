const multer=require('multer')

const storage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'./uploads')

    },
    filename:(req,file,callback)=>{
        callback(null,`Image-${Date.now()}-${file.originalname}`)
    }
})

const fileFilter=(req,file,callback)=>{
 if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png'||file.mimetype=='image/webp'){
    callback(null,true)
 }else{
    callback(null,false)
 }

}

const multerMiddileware=multer({
    storage,fileFilter
})

module.exports=multerMiddileware