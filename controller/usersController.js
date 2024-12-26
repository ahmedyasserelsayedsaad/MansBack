const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {generateToken,generateRefreshToken} = require('../utils/generateToken');
//register

const userRegister = async (req, res) => {
    const { userName, email, password, phone } = req.body;
    console.log(req.body);
    console.log('request', req.file)
    try {
        if (!userName || !email || !password || !phone) {
            return res.status(400).json({ message: 'all fields required' });
        }
        const foundUser = await User.findOne({ email }).exec();
        if (foundUser) {
            return res.status(400).json({ message: 'found user by this email' });

        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let role = 'User';
        const adminNames = [process.env.ADMIN_ONE, process.env.ADMIN_TWO];
        if (adminNames.includes(userName)) {
            role = 'Admin';
        }
        const NewUser = new User({
            userName,
            email,
            phone,
            password: hashedPassword,
            avatar: req.file.filename,
            role,
        });

        //generateToken
        const token = generateToken({ email: NewUser.email, id: NewUser._id });
        const refreshToken = generateRefreshToken({ email: NewUser.email, id: NewUser._id });
        
        NewUser.token = token;
        NewUser.refreshToken = refreshToken

        const user = await NewUser.save();
        return res.status(201).json({ message: `you're registered successfully`, user });


    }
    catch (err) {
        res.status(500).json({ message: `server error==>${err.message}` })
    }
}

//login

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json("all fileds are required");
        }
        const user = await User.findOne({ email: email }).exec();
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }
        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(404).json({ message: "not found email" });
        }
        
        
        
        const token = generateToken({ email: user.email, id: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ email: user.email, id: user._id });

        user.token = token;
        user.refreshToken = refreshToken;

        await user.save();
        return res.status(201).json({
            message: "You are logged in successfully",
            token: token,
            refreshToken: refreshToken
        });

    }
    catch (err) {
        res.status(500).json({ message: ` server errorr ==>${err.message}` });
    }
}



//get allusers

const GetAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        if (!users) {
            return res.status(404).json({ message: "not found users in your application" })
        }
        return res.status(200).json(users);

    }
    catch (err) {
        return res.status(500).json({ message: err.message })

    }
}

//logout 

const logout=async(req,res)=>{

try{
const userId=req.user.id;
await User.findByIdAndUpdate(userId,{token:null});
return res.status(200).json({message:'you loged out successfully'});
}
catch(err){
    return res.status(500).json({ message: err.message });

}


}



const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }

    try {
        const user = await User.findOne({ refreshToken }).exec();
        if (!user) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = generateToken({ email: payload.email, id: payload.id });

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
};






module.exports = {
    GetAllUsers,
    Login,
    userRegister,
    logout,
    refreshAccessToken
}