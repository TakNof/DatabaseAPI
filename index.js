//Using nodemon to update the app when making a change.
// npm i nodemon -D
//-D to install the module as a developement module, only active when editing the code.
import express from 'express';
import mongoose from 'mongoose';

//Allows to parse JSON data into the API.
import bodyParser from 'body-parser';

import cors from 'cors';

const app = express();

//Applying the parser.
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb+srv://afonsecat:w4BYUhYEi7gzPrZL@base1.bzjdqyk.mongodb.net/DoomScores?retryWrites=true&w=majority';

mongoose.connect(url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
     console.log("Connected successfully to server");
});

const ScoreInsert = mongoose.model('Score',
    new mongoose.Schema({
        name: {type: String, required: true},
        score: { type: Number, required: true }
    },{ versionKey: false }),
    "Scores"
);

app.post('/score', async (req, res) => {
    const Score = new ScoreInsert({ name: req.body.name, score: req.body.score });
    try {
        const savedScore = await Score.save();
        res.send(savedScore);
    } catch (err) {
        console.error(err);
    }
});

app.get('/scores', (req, res) => {
    ScoreInsert.find((err, scores) => {
        if (err) return console.error(err);
        res.send(scores);
    });
});

app.listen(3000, () => console.log('Server listening on port 3000'));