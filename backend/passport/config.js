import passport from "passport";
import bcrypt from 'bcryptjs'

import user from '../models/userModel.js'
import { GraphQLLocalStrategy } from "graphql-passport";
import User from "../models/userModel.js";
import transactionTypeDef from "../typedefs/transactionTypeDef.js";

export const configurePassport = async () => {
    passport.serializeUser((user,done) => {
        console.log("Serializing user")
        done(null,user._id)
    });

    passport.deserializeUser(async (id,done) => {
        console.log("desrializing")
        try{
            const user = await User.findById(id)
        done(null,user.id)
  
        }catch(e){

        }

    });
    passport.use(
        new GraphQLLocalStrategy(async (username,pass,done) => {
            try{
                const user = await User.findOne({ username }   )
                if(!user){
                    throw new Error("invalid creds")
                }
                const valid = await bcrypt.compare(pass,user.password);
                if(!valid){
                    throw new Error("invalid creds")
                }
                return done(null,user)
            }catch(err){
                return done(err)
            }
        })
    )

}

 