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
        score: { type: Number, required: true },
        difficulty: {type: String, required: true}
    },{ versionKey: false }),
    "Scores"
);

//Base Endpoint
app.get("/", (req, res) =>{
    res.send("Welcome the DOOM API.");
});

//Post Endpoint
app.post('/score', async (req, res) => {
    const Score = new ScoreInsert({
        name: req.body.name,
        score: req.body.score,
        difficulty: req.body.difficulty
    });
    try {
        const savedScore = await Score.save();
        res.send(savedScore);
    } catch (err) {
        console.error(err);
    }
});

const difficulties = ["Im_too_young_to_die", "Hurt_me_Plenty", "Ultra-Violence", "Nightmare"];

for (let difficulty of difficulties) {
    app.get(`/scores/${difficulty}`, async (req, res) => {
        let scores = [];
        try{
            let difficultyName = difficulty.replace(/_/g, ' ').replace(/Im/g, "I'm");
            scores = [...await ScoreInsert.find({difficulty: difficultyName}).sort({score: -1}).limit(10), ...scores];
            res.send(scores);
        }catch (err){
            console.error(err);
        }
    });
}

app.listen(3000, () => console.log('Server listening on port 3000'));