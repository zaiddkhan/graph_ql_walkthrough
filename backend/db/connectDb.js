import mongoose from "mongoose";


export const connectDb = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log('Mongo is connected!')
    }catch(err){
        process.exit(1);

    }
}