const Review = require("../models/reviewModel")
const Book = require("../models/bookModel");

const putApi = async function (req, res) {
    try {
        let { bookId, reviewId } = req.params
        let findbookid = await Book.findById({ _id: bookId, isDeleted: false })
        if (!findbookid) {
            return res.status(404).send({ status: false, message: "book not found" })
        }
        let findreviewId = await Review.findById(reviewId)
        if (!findreviewId) {
            return res.status(404).send({ status: false, message: "review not found" })
        }

        let { reviewedBy, rating, review } = req.body
        if (!req.body) {
            return res.status(404).send({ status: false, message: "request body can't be empty" })
        }


        let obj = {}
        if (userId) {
            obj.reviewedBy = reviewedBy;
        }
        if (rating) {
            obj.rating = rating;
        }
        if (review) {
            obj.review = review;
        }
        obj = { reviewedAt: new Date() }

        let markdelete = await Review.updateOne({ _id: reviewId }, obj, { new: true })
        return res.status(200).send({ status: true, message: "Success", data: markdelete });

    } catch (err) {
        res.status(500).send({ status: false, message: err.message });
    }
}

module.exports = { putApi }