// models
const Entry = require('./models/entry');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const moment = require('moment');

app.use(express.static('public')); // static files

var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
// app.listen(3000, () => {
//     console.log('Server is running on port 3000');
//     });
// connect to database
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {console.log("Connected to db!");app.listen(3000, () => console.log("Server Up and running"));});

async function main() {
    try {
        await mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Database connected successfully');
        app.listen(3000, () => console.log("Server Up and running"));
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}
main();

app.set('view engine', 'ejs');
app.get('/', async (req, res) => {
    try {
        const entries = await Entry.find({});
        let today = moment().startOf('day').toDate();
        today.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for comparison

        let entryForTodayExists = entries.some(entry => {
            let entryDate = moment(entry.date).toDate();
            entryDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for comparison
            return entryDate.getTime() === today.getTime();
        });
        res.render('list.ejs', { entries, entryForTodayExists });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving entries');
    }
});
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {

    if (req.body.comments == "") {
        req.body.comments = "No comments";
    }
    if (req.body.triggers == "") {
        req.body.triggers = "No triggers";
    }
    let entryDate = moment().startOf('day').toDate();
    entryDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for comparison
    
    const entry = new Entry({
        date: entryDate.toJSON().slice(0,10),
        pos1: req.body.pos1,
        pos2: req.body.pos2,
        pos3: req.body.pos3,
        triggers: req.body.triggers,
        comments: req.body.comments,
        rating: req.body.rating
    });
    
    try {
        // if date does not match an entry in the database, create a new entry, else update the entry
        let entryDate = moment().startOf('day').toDate();
        entryDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for comparison

        const entryExists = await Entry.findOne({ date: entryDate.toJSON().slice(0,10) });
        if (entryExists) {
            // await Entry.updateOne({ date: new Date().toJSON().slice(0,10) }, entry);
            // replace entry's data with new data
            entryExists.pos1 = entry.pos1;
            entryExists.pos2 = entry.pos2;
            entryExists.pos3 = entry.pos3;
            entryExists.triggers = entry.triggers;
            entryExists.comments = entry.comments;
            entryExists.rating = entry.rating;
            await entryExists.save();
        } else {
            await entry.save();
        }

        // if (entry.date != new Date().toJSON().slice(0,10)) {
        //     await entry.save();
        // }
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
    
    // var jsonData = {};
    // // add form data to json
    // // positive things
    // jsonData.pos1 = req.body.pos1;
    // jsonData.pos2 = req.body.pos2;
    // jsonData.pos3 = req.body.pos3;
    // // triggers
    // jsonData.triggers = req.body.triggers;
    // // comments
    // jsonData.comments = req.body.comments;
    // // add todays date to json
    // jsonData.date = ;
    // console.log(jsonData);
    // tell client submission was recieved
    // res.sendStatus(204);
    // eventually update database entry corresponding to date with json data
});

app.get('/history', async (req, res) => {
    try {
        const entries = await Entry.find({});
        res.render('history.ejs', { entries });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving entries');
    }
});