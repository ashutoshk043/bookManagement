const bookModel = require('../Models/bookModel')
const reviewModel = require('../Models/reviewModel')
const mongoose = require("mongoose")


const createReview = async (req, res) => {
    const rBookId = req.params.bookId

    const { reviewedBy, rating, review } = req.body

    const findBooks = await bookModel.findOne({ isDeleted: false, _id: rBookId })
    if (!findBooks) {
        return res.send({ status: false, message: "No Books Found...." })
    }
    let obj = { bookId: findBooks._id, reviewedBy, rating, review }
    let createReview = await reviewModel.create(obj)

    res.status(201).send({ status: true, message: "success", data: createReview })

    // console.log(findBooks)

}

//-------------------------update review--------------------------------

const updateReview = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "bookId is not valid" })

        let reviewId = req.params.reviewId
        if (!mongoose.Types.ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: "reviewId is not valid" })

        let reviewData = req.body
        let { review, rating, reviewedBy } = reviewData

        //-----check for request body-----
        if (Object.keys(reviewData).length == 0) return res.status(404).send({ status: false, msg: "please add some data for updates!!!" })

        //----check if book exist in collection or not------
        const book = await bookModel.findById(bookId)

        if (!book) return res.status(404).send({ status: false, msg: "No Book with this bookId was found in the reviewModel" })

        if (bookId.isDeleted == true) return res.status(404).send({ status: false, msg: "Book is already deleted!!!" })

        const rev = await reviewModel.findById(reviewId)
        if (!rev) return res.status(404).send({ status: false, msg: "No reviews with this reviewID was found in the reviewModel" })

        if (reviewId.isDeleted == true) return res.status(404).send({ status: false, msg: "reviews are already deleted!!" })

        if (!/^\s*([1-5]){1}\s*$/.test(rating)) return res.status(404).send({ status: false, msg: "ratings not accepted!!!" })

        let updateReview = await reviewModel.findOneAndUpdate({ _id: reviewId, isDeleted: false },
            {
                $set: {
                    review: review, rating: rating, reviewedBy: reviewedBy, reviewedAt: new Date
                }
            }, { new: true })

        if (!updateReview) return res.status(404).send({ status: false, msg: "Something went wrong!!!!" })

        return res.status(201).send({ status: true, msg: "Updated the reviews!!!!"  ,data :updateReview })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { createReview, updateReview }
