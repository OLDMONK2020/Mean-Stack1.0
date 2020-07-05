/* 
const express = require('express');
const Post = require('../models/post');
const router = express.Router();

router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save().then(createdPost => {
        console.log(createdPost);
        res.status(201).json({
            message: 'success'
        });
    }, error => {
        console.log(error);
    });
})

router.get('', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'success',
            data: documents
        });
    })
});

router.delete('/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id }).then(result => {
        res.status(200).json({
            message: 'success'
        })
    })
})

router.put('/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content
    });
    Post.updateOne({ _id: req.body.id }, post).then(result => {
        res.status(200).json({
            message: 'success'
        })
    })
})

router.get('/:id', (req, res, next) => {
    Post.findById({ _id: req.params.id }).then(result => {
        res.status(200).json({
            message: 'success',
            data: result
        })
    })
})

module.exports = router;

*/