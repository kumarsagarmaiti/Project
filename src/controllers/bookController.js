const book = require('../models/bookModel')

const getbooks = async function (req, res) {
    try {
        let obj = { isDeleted: false }

        let userId = req.query.userId
        let category = req.query.category
        let subcategory = req.query.subcategory


        if (userId) {
            obj.userId = userId;
        }
        if (category) {
            obj.category = category;
        }
        if (subcategory) {
            obj.subcategory = subcategory;
        }

        let findbook = await book.find(obj).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 });
        if (findbook.length == 0) {
            return res.status(404).send({ status: false, message: "book not found" })
        }

        return res.status(200).send({ status: true, message: "Success", data: findbook })
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

const booksbyparam = async function (req, res) {
    try {
        let bookId = req.param.bookId

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is mendatory" })
        }
        
        let findbookId = await book.findById(bookId);
        if (!findbookId) {
            return res.status(404).send({ status: false, message: "book not found" })
        }

        

        return res.status(200).send({ status: true, message: "Success", data: findbookId })
    } catch (err) {
        return res.status(500).send({ status: false, message: "Error", error: err.message })
    }
}

module.exports = { getbooks }
module.exports = { booksbyparam }