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
                    username : username,
                    name : name,
                    password : hashedPass,
                    gender : gender,
                    profilePicture : gender == "male" ? boyProfile  : girlProfile
                })
                await newUser.save();
                await context.login(newUser);
                console.log(newUser)
                return newUser
            }catch(err){
                console.log(`erorooro ${err.message}`)

            }
        },
        login : async(_,{input},context    ) => {
            try{
                const {username,password} = input;
                console.log(username)
                if(username == ''){
                    throw new Error("Emptyyy")
                    return
                }
                if(username == '' || password == '')  throw new Error("All fields are required");
                const {user} = await context.authenticate("graphql-local",{username,password})
                await context.login(user);
                return user
            }catch(err){
            

            }
        },
        logout : async(_,__,context ) => {
            try{
                await context.logout();
                context.req.session.destroy((err) => {
                    if(err) throw err
                })
                context.res.clearCookie("connect.sid");
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
            try {
				const user = await context.getUser();
				return user;
			} catch (err) {
				console.error("Error in authUser: ", err);
				throw new Error("Internal server error");
			}
        },
        user :async ( _, userId) => {
            try {
				const user = await User.findById(userId);
				return user;
			} catch (err) {
				console.error("Error in user query:", err);
				throw new Error(err.message || "Error getting user");
			}
        }
       
        
    }
}

export default userResolver;