import userService from '../Services/userService.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookieUtils.js';

//controller to handle user registration
export const register = async (req, res) => {
    try{
        const result = await userService.register(req.body);
        res.status(201).json({ message: "User registered successfully", user: result });
    }catch(err){
        res.status(400).json({error: err.message });
    }
}

//controller to handle user login
export const login = async (req, res) => {
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
export const logout = async (req, res) => {
    try {
        // Clear the authentication cookie
        clearAuthCookie(res);
        
        res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const result = await userService.resetPassword(req.body);
        res.status(200).json({ message: "Reset email sent", user: result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const userController = {
    register,
    login,
    logout,
    resetPassword
};

export default userController;