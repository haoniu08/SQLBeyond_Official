const express = require('express');
const { connectToMongoDB } = require('../utils/mongodb');

const router = express.Router();

/**
 * This file contains the API routes that handles user-game interactions
 */

/**
 * API route is used to load the game data for the user 
 */
router.get("/load-data/:username", async (req, res) => {
    const db = await connectToMongoDB();
    const collection = db.collection('game');
    const username = req.params.username;
    
    try {
        const gameData = await collection.findOne({ username });
        if (gameData)
            return res.json({ gameData });

        return res.json({});
    } catch (err) {
        console.error("Not able to load game data: ", err);
    }
})



/**
 * API route is used to save the data of a new user 
 */
router.post("/starter-game-data", async (req, res) => {
    const { username, initialGameData } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');

    try {
        await collection.insertOne({
            username,
            gameData: initialGameData
        });
        res.json({ok: true});
    }
    catch(err){
        console.error(err);
        res.json({ok: false});
    }    
});

/**
 * API route is used to update any game data using key and value system 
 */
router.post("/update-game-data", async (req, res) => {
    const { username, key, value } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');

    try {
        await collection.updateOne(
            { username },
            { $set : { [`gameData.${key}`]: value} }
        );
        res.json({ok: true});
    }
    catch(err){
        console.error(err);
        res.json({ok: false});
    }    
});

/**
 * API route is used to update any game data object using key and value system 
 * Level is important as the way the object saves the data uses the level
 */
router.post("/update-game-data-object", async (req, res) => {
    const { username, key, value, level } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');

    try {
        await collection.updateOne(
            { username },
            { $addToSet : { [`gameData.${key}.${level}`]: value} }
        );
        res.json({ok: true});
    }
    catch(err){
        console.error(err);
        res.json({ok: false});
    }    
});

/**
 * API route is used to update any game data object using key and value system 
 * Level is important as the way the object saves the data uses the level
 * NOT FULLY WORKING
 */
router.post("/update-game-data-badges", async (req, res) => {
    const { username, newBadges } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');
    try {
        await collection.updateOne(
            { username },
            { $set : { "gameData.badges": newBadges} }
        );
        res.json({ok: true});
    }
    catch(err){
        console.error(err);
        res.json({ok: false});
    }    
});

/**
 * API route is used to reset any game data object using key and value system 
 */
router.post("/reset-game-data-object", async (req, res) => {
    const { username, key, level } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('game');

    try {
        await collection.updateOne(
            { username },
            { $set : { [`gameData.${key}.${level}`]: []} }
        );
        res.json({ok: true});
    }
    catch(err){
        console.error(err);
        res.json({ok: false});
    }    
});
module.exports = router;