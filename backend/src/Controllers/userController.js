const userService = require('../Services/userService');

//controller to handle user registration
exports.register = async (req, res) => {
    try{
        const result = await userService.register(req.body);
        res.status(201).json({ message: "User registered successfully", user: result });
    }catch(err){
        res.status(400).json({error: err.message });
    }
}

//controller to handle user login
exports.login = async (req, res) => {
    try{
        const result = await userService.login(req.body);
        res.status(200).json({ message: "User logged in successfully", token: result.token });
    }catch(err){
        res.status(400).json({error: err.message });
    }
}