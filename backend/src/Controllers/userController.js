const userService = require('../Services/userService');
const { setAuthCookie, clearAuthCookie } = require('../utils/checkAuth');

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
        
        // Set JWT token in HTTP-only cookie
        setAuthCookie(res, result.token);

        const {token, ...userData} = result;
        
        res.status(200).json({ 
            message: "User logged in successfully", 
            token: result.token,
            userData
        });
    }catch(err){
        res.status(400).json({error: err.message });
    }
}

//controller to handle user logout
exports.logout = async (req, res) => {
    try {
        // Clear the authentication cookie
        clearAuthCookie(res);
        
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}