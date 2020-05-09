const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const ToDo = require('./models/ToDo');
// Config
const db = require('./config').dbURI;

// Connect MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true
        }
    )
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.log(err);
    });

// EJS
app.set('view engine', 'ejs');

// Static Folder
app.use("/public", express.static(path.join(__dirname, "public")));

// Express body parser
app.use(express.urlencoded({
    extended: true
}));

// Routes
app.get('/', function (req, res) {
    res.render('index', {
        title: "Database Pegawai Banyu Biru Coffe"
    });
});

app.get('/list', function (req, res) {
    ToDo.find({}, null, {
        sort: {
            date: -1
        }
    }, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            res.status(200).json(results);
        }
    });
});

app.post('/add', (req, res) => {
    const {
        name,
        description,
        location
    } = req.body;

    let newToDo = new ToDo({
        name,
        description,
        location
    });

    newToDo
        .save()
        .then((todo) => {
            res.status(200).json(todo);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

app.get("/delete/:id", function (req, res) {
    ToDo.findOneAndRemove({
        _id: req.params.id
    }, req.body, function (err, data) {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            res.status(200).json(data);
        }
    });
});

app.get('/read/:id', function (req, res) {
    ToDo.findOne({
        _id: req.params.id
    }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            if (!result) {
                res.status(404).json({
                    message: "Not Found"
                });
            } else {
                res.status(200).json(result);
            }
        }
    });
});

app.post('/edit', function (req, res) {
    const {
        id,
        name,
        description,
        location
    } = req.body;

    ToDo.updateOne({
            _id: id
        }, {
            $set: {
                name: name,
                description: description,
                location: location,
                date: date
            }
        },
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            } else {
                res.status(200).json(result);
            }
        }
    );
});

// Error
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

// Port
const PORT = process.env.PORT || 3000;

// Listen
app.listen(PORT, console.log(`Server started on port ${PORT}`));