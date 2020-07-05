const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Post = require('./models/post');
const User = require('./models/user');
const user = require('./models/user');

mongoose.connect('mongodb+srv://Ankur:Trelleborg@123@cluster0-rifa1.mongodb.net/mean-stack?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,POST,PUT,PATCH,OPTIONS');
    next();
})

const MIME_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png '
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid Mime type');
        if (isValid) {
            error = null;
        }
        callback(null, 'backend/images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        callback(null, name + '-' + Date.now() + '.' + ext);
    }
})

const userAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedUser = jwt.verify(token, 'this is some random text');
        req.userData = { 'email': decodedUser.email, 'userId': decodedUser.userId };
        next();
    }
    catch (err) {
        res.status(401).json({
            message: 'Authentication failed due to jwt token issue'
        })
    }

}

app.post('/api/post', userAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    } else {
        imagePath = null;
    }

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        createdBy: req.userData.userId
    })

    post.save().then(createdPost => {
        res.status(201).json({
            ...createdPost,
            status: 'success',
            message: 'Post is created successfully'
        });
    })
        .catch(error => {
            res.status(500).json({
                status: 'failure',
                message: 'Some error occured during new Post creation'
            })
        });

})

app.get('/api/posts', (req, res, next) => {
    const pageSize = Number(req.query.pageSize);
    const currentPage = Number(req.query.currentPage);
    const postData = Post.find();
    let searchedData;
    if (pageSize && currentPage) {
        postData.skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postData.then(documents => {
        searchedData = documents;
        return Post.count();

    }).then(count => {
        res.status(200).json({
            status: 'success',
            message: 'Posts fetched successfully',
            data: searchedData,
            maxCount: count
        });
    })
        .catch(error => {
            res.status(200).json({
                status: 'failure',
                message: 'Some error occured during fetching of Posts'
            });
        })
});

app.delete('/api/posts/:id', userAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, createdBy: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                status: 'success',
                message: 'Post is deleted successfully'
            })
        } else {
            res.status(401).json({
                status: 'failure',
                message: 'Authentication failed'
            })
        }

    })
        .catch(error => {
            res.status(500).json({
                status: 'failure',
                message: 'Some error ocured during Post deletion'
            })
        })
})

app.put('/api/posts/:id', userAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename;
    } else if (req.body.imagePath === 'null') {
        imagePath = null;
    } else {
        imagePath = req.body.imagePath;
    }

    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    Post.updateOne({ _id: req.body.id, createdBy: req.userData.userId }, post).then(result => {
        if (result.n > 0) {
            res.status(200).json({
                ...result,
                status: 'success',
                message: 'Post is editted successfully'
            })
        } else {
            res.status(401).json({
                status: 'failure',
                message: 'authorization failed !!'
            })
        }

    })
        .catch(error => {
            res.status(500).json({
                status: 'failure',
                message: 'Some error occured during editing of the Post'
            })
        })
})

app.get('/api/posts/:id', (req, res, next) => {
    Post.findById({ _id: req.params.id }).then(result => {
        res.status(200).json({
            status: 'success',
            message: 'Post fetched successfully',
            data: result
        })
    })
        .catch(error => {
            res.status(500).json({
                status: 'failure',
                message: 'Some error occured during fetching the Post'
            })
        })
})

app.post('/api/users/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        status: 'success',
                        message: 'User created successfully',
                        data: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        status: 'failure',
                        message: 'Some error ocured while user sign up'
                    });
                });
        })
})

app.post('/api/users/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    status: 'failure',
                    message: 'Authentication failed'
                })
            }
            fetchedUser = user
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    status: 'failure',
                    message: 'Authentication failed'
                })
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'this is some random text',
                { expiresIn: '1h' }
            )
            res.status(200).json({
                message: 'success',
                token: token,
                createdBy: fetchedUser._id,
                expiresIn: 3600
            })
        })
        .catch(err => {
            res.status(201).json({
                status: 'failure',
                message: 'Authentication failed'
            })
        })
})

module.exports = app;