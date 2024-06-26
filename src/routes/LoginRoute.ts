import express,{type Request,type Response} from "express";
import user from "../models/User.ts";
import type { ObjectId } from "mongoose";
require('dotenv').config();


const LoginRoute=express.Router();
interface UserData{
    _id:string;
    username:string;
    email:string;
}

LoginRoute.get('/login', (req: Request, res: Response) => {

    if (req.session.user) {
        res.redirect('/dashboard');
    }
    res.render('login',{error:false});
});

LoginRoute.post('/login',async (req:Request,res:Response)=>{
    const email:string=req.body.email;
    const password:string=req.body.password;
    const flame = await user.findOne({ email: email });

    if (flame) {
        if (await Bun.password.verify(password, flame.password)) {
            const ds:UserData = {
                _id: flame._id.toString(), // Convert ObjectId to string
                username:flame.username,
                email:flame.email
            }
            req.session.user = ds;
            console.log(flame.username + " logged in")
            res.redirect('/dashboard');
        } else {
            res.render('login',{error:true,message:"Password is incorrect"})
        }
    } else {
        res.render('login',{error:true,message:"user not found"})
    }

});



export default LoginRoute;