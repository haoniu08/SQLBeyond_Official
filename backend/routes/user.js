const express = require('express');
const { connectToMongoDB } = require('../utils/mongodb');

const router = express.Router();

const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * This API route is used to load user data if there's a session related to that user name
 */
router.get("/login", async (req, res) => {
    if (req.session.user) {
        const db = await connectToMongoDB();
        const collection = db.collection('users');
        try {
            const user = await collection.findOne({ username: req.session.user.username });
            if (user)
                return res.json({ user: user });

            throw new Error();
        } catch (err) {
            console.error("Not able to load user data: ", err);
        }
    }
    res.status(404);
});

/**
 * This API route is used to load user data when user tries to login
 */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    // make the request to the database with the username
    const user = await collection.findOne({ username: username });
    if (user) {
        try {
            const response = await bcrypt.compare(password, user.password);
            if (response) {
                req.session.user = { username: username };
                if (!user.quizData)
                    req.session.save(()=>{  
                        res.send({ user: user, missingQuiz: true });
                    })    
                else
                    res.send({ user: user });
            }
            else {
                req.session.save(()=>{
                    res.send({ msg: "Username and password don't match!" });
                }) 
            }
        } catch (err) {
            console.error("Failed to check the password", err);
        }
    }
    else {
        //user not found
        res.send({ msg: "Username and password don't match!" });
    }
});

/**
 * This API route is used to save user data when user tries to register
 */
router.post("/register", async (req, res) => {
    const { firstName, lastName, username, password } = req.body;
    //check if user name already exists 
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('users');

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);

        try {
            await collection.insertOne({
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: hash,
                isOauth: false,
                badges: []
            });
            const userData = { user: { firstName: firstName, lastName: lastName, username: username, isOauth: false, badges: [] } };
            req.session.user = { username: username };
            req.session.save(()=> {
                res.json(userData);
            })
        } catch (err) {
            console.error("Failed to insert new user: ", err);
            res.json({ status: "failed" });
        }

    } catch (err) {
        console.error("Failed to generate a hash password: ", err);
        res.json({ status: "failed" });
    }
});

/**
 * This API route is used to logout user
 */
router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.send("Logout failed!");
            return;
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logout succesfull" });
    })
});

/**
 * API route is used to save the quiz data that user does after registration 
 */
router.post("/quiz-grade", async (req, res) => {
    const { quizData } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    // console.log(req.session.user);

    try {
        await collection.updateOne({
            username: req.session.user.username
        }, {
            $set: {
                quizData: quizData
            }
        });
        res.json({ success: true });
    } catch (err) {
        console.error("Failed to update user: ", err);
        res.json({ success: false });
    }
});

module.exports = router;