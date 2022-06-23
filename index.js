import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import {loginValidation, registerValidation} from './validations/Auth.js';
import checkAuth from './utils/CheckAuth.js';
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import {postCreateValidation} from "./validations/Post.js";


mongoose
    .connect('mongodb+srv://KseniaKras:uz8Xp!6SQGiz!Cr@cluster0.9bnue.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage })

app.use(express.json()) //для чтения json данных
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});


app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update)

app.listen(3001, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log('Server OK')
})

