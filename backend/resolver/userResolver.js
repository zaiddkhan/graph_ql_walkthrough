import { users } from "../dummyData/data.js"
import User from "../models/userModel.js";
import bycrypt from 'bcryptjs'

const userResolver = {
    
    Mutation : {
        signUp : async(_,{input},context) => {
            try{
                const {username,name,password,gender} = input;
                if(!username || !name || !password || !gender){
                    throw new Error("All field required");
                }
                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error("User exists")
                }
                const salt = await bycrypt.genSalt(10);
                const hashedPass = await bycrypt.hash(password,salt);
                const boyProfile = `https://avatar.iran.liara.run/public/boy?username=${username}`
                const girlProfile = `https://avatar.iran.liara.run/public/girl?username=${username}`

                const newUser = new User({
                    username,
                    name,
                    hashedPass,
                    gender,
                    profilePicture : gender == "male" ? boyProfile  : girlProfile
                })
                await newUser.await()
                await context.login(newUser);
                return newUser
            }catch(err){
                console.log(`erorooro ${err.message}`)

            }
        },
        login : async(_,{input},context    ) => {
            try{
                const {username,password} = input
                const {user} = await context.authenticate("graphql-local",{username,password})
                await context.login(user);
                return user
            }catch(err){
            

            }
        },
        logout : async(_,__,context ) => {
            try{
                await context.logout();
                req.session.destroy((err) => {
                    if(err) throw err
                })
                res.clearCookie("connect.sid");
                return { 
                    "message" : "logged out"
                }
            }catch {
                return {
                    "message" : "adli"
                }
            }
        }
     },
    Query : {
        authUser : async(_,__,context) => {
            try{
                const user = await context.getUser();
                return user

            }catch(err){

            }
        },
        user :async ( _, userId) => {
            try{
                const user = await User.find((user) => user._id === userId)
            
                return user
            }catch(err){

            }
        }
       
        
    }
}

export default userResolver;