require('dotenv').config(); //read .env
const express = require("express"),
    bodyParser = require("body-parser"),
    path = require('path'),
    PORT = process.env.API_PORT || 3001,
    app = express(),
    bcrypt = require("bcryptjs"),
    auth = require("./../middleware/auth"),
    authService = require('./authService');



// prod:Have Node serve the files for our built React app
//app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));

// Handle GET requests to /public route
app.get("/public", (req, res) => {
    res.json({ message: "Hello guest!" });
});

app.get("/secure", auth, (req, res) => {
    res.json({ message: `Welcome ${req.user.email}!` });
});

app.post("/register", async (req, res) => {
    try {
        // Get user input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = false; //await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        let user = {
            id: 5,
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        };

        // Create token
        const access_token = authService.jwt_token({ user_id: user.id, email });
        const refresh_token = authService.jwt_token({ user_id: user.id }, 'refresh');

        user.token = access_token;
        user.refresh_token = refresh_token;

        //test: verify token
        var decoded = authService.jwt_verify(access_token);
        user.decoded = decoded;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database //await User.findOne({ email });
        let user = {
            id: 5,
            email: email,
            password: password
        };

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = authService.jwt_token({ user_id: user.id, email });

            // save user token
            user.token = token;

            // user
            res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
});


// prod: All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});