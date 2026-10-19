const express=require('express')
const userController=require('../controller/userController')
const bookController=require('../controller/bookController')
const jwtMiddileware=require('../middileware/jwtMiddileware')
const multerMiddileware=require('../middileware/multerMiddileware')
const adminMiddileware = require('../middileware/adminMiddileware')

const router=new express.Router()

//register
router.post('/register',userController.registerController)


//login
router.post('/login',userController.loginController)

//google-login
router.post('/google-login',userController.googleLoginController)
//home-books
router.get('/home-books',bookController.getHomeBooksController)
//---------Authorized users routes------------------------------------
//addBook

router.post('/user/add-book',jwtMiddileware,multerMiddileware.array('uploadImg',3),bookController.addBookController)

//getAllUserBook
router.get('/all-books',jwtMiddileware,bookController.getAllUserBookController)
//getUserProfileBook
router.get('/user-books',jwtMiddileware,bookController.getUserProfileBookController)
//getUserPurchasedBooks
router.get('/user-books/buy',jwtMiddileware,bookController.getPurchaseBookController)
//viewBook
router.get('/view/:id',jwtMiddileware,bookController.viewBookController)
//updateUser
router.put('/user/:id/edit',jwtMiddileware,multerMiddileware.single('picture'),userController.editUserController)
//makepayment
router.put('/user/:id/buy',jwtMiddileware,bookController.bookPaymentController)
//removebook
router.delete('/user/:id/delete',jwtMiddileware,bookController.removeBooksController)

//--------------------Admin Routes-------------------
//getAllBooks
router.get('/admin/all-books',adminMiddileware,bookController.getAllBooksController)
//getAllUsers
router.get('/admin/all-users',adminMiddileware,userController.getAllUsersController)
//updateStatus
router.put('/admin/:id/update',adminMiddileware,bookController.updateBooksStatusController)

module.exports=router