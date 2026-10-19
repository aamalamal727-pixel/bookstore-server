const books = require("../model/bookModel");
const stripe = require("stripe")(process.env.stripesecret);

//addBookController

exports.addBookController = async (req, res) => {
  console.log("inside add book controller");
  const {
    title,
    author,
    pages,
    imageUrl,
    price,
    discountPrice,
    abstract,
    publisher,
    language,
    isbn,
    category,
  } = req.body;
  const uploadImg = req.files.map((item) => item.filename);
  const sellerMail = req.payload;
  // console.log(title,
  // author,
  // pages,
  // imageUrl,
  // price,
  // discountPrice,
  // abstract,
  // publisher,
  // language,
  // isbn,
  // category,uploadImg,sellerMail);

  try {
    const existingBook = await books.findOne({ title, sellerMail });
    if (existingBook) {
      res.status(409).json("book already exist...add another one");
    } else {
      const newBook = await books.create({
        title,
        author,
        pages,
        imageUrl,
        price,
        discountPrice,
        abstract,
        publisher,
        language,
        isbn,
        category,
        uploadImg,
        sellerMail,
      });
      res.status(200).json(newBook);
    }
  } catch (error) {
    console.log(error);
    res.status(500).server;
  }

  console.log(req.body);
  console.log(req.files);

  res.status(200).json("add book request received");
};

//homeBookController

exports.getHomeBooksController = async (req, res) => {
  console.log("inside home book controller");
  try {
    const homeBooks = await books.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(homeBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//getAllUserBookController
exports.getAllUserBookController = async (req, res) => {
  console.log("inside get All UserBookcontroller");
  const searchKey = req.query.search;
  console.log(searchKey);

  const loginUserMail = req.payload;
  try {
    const allBooks = await books.find({
      sellerMail: { $ne: loginUserMail },
      title: { $regex: searchKey, $options: "i" },
    });
    res.status(200).json(allBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
//getUserProfileBookController
exports.getUserProfileBookController = async (req, res) => {
  console.log("inside get All UserBookcontroller");
  const loginUserMail = req.payload;
  try {
    const allBooks = await books.find({ sellerMail: loginUserMail });
    res.status(200).json(allBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//getPurchaseBookController
exports.getPurchaseBookController = async (req, res) => {
  console.log("inside get All getPurchaseBookController");
  const loginUserMail = req.payload;
  try {
    const purchaseBooks = await books.find({ buyerMail: loginUserMail });
    res.status(200).json(purchaseBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
//viewBookController
exports.viewBookController = async (req, res) => {
  console.log("inside get All viewBookController");
  const { id } = req.params;
  try {
    const viewBooks = await books.findById({ _id: id });
    res.status(200).json(viewBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//getAllBooksController
exports.getAllBooksController = async (req, res) => {
  console.log("inside get AllBooks Controller");
  try {
    const allBooks = await books.find();
    res.status(200).json(allBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//updateBooksStatusController
exports.updateBooksStatusController = async (req, res) => {
  console.log("inside update Books Status Controller");
  const { id } = req.params;
  try {
    const updateBook = await books.findById({ _id: id });
    updateBook.status = "Approved";
    await updateBook.save();
    res.status(200).json(updateBook);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//removeBooksController
exports.removeBooksController = async (req, res) => {
  console.log("inside remove Books Controller");
  const { id } = req.params;
  try {
    const removeBooks = await books.findByIdAndDelete({ _id: id });
    res.status(200).json(removeBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//bookPaymentController
exports.bookPaymentController = async (req, res) => {
  console.log("inside book Payment Controller");
  //book details from url
  const { id } = req.params;
  //buyer mail
  const email = req.payload;
  try {
    const bookDetails = await books.findById({ _id: id });
    bookDetails.status = "sold";
    bookDetails.buyerMail = email
    await bookDetails.save()
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookDetails.title,
            description: `${bookDetails.author} | ${bookDetails.publisher}`,
            images: bookDetails.uploadImg,
            metadata: {
              title: bookDetails.title,
              author: bookDetails.author,
              
              price: bookDetails.price,
            },
          },
          unit_amount: Math.round(bookDetails.discountPrice * 100),
        },
        quantity: 1,
      },
    ];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items,
      mode: "payment",
      success_url: "http://localhost:5173/payment-success",
      cancel_url:'http://localhost:5173/payment-failed'
    });
    console.log(session);
    res.status(200).json({checkOutURL:session.url})
    
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
