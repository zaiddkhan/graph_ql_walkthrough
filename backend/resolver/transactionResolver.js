import { Query } from "mongoose";
import Transaction from '../models/transactionModel.js';


const transactionResolver = {
    Query : {
        transactions : async(_,__,context) => {
            try{
                if(!context.getUser())
                    throw new Error("User not found")
                const userId = await context.getUser()._id;
                const transaction = await Transaction.find({   userId });
                return transaction;

            }catch(err){
                console.log("cannot find transactions");
            }
        },
        transaction : async(_, {transactionId }, context) => {
            try{
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            }catch(err){
                console.log("cannot find transactions");
            }
        },
        //TODO => ADD category statistics

    },
    Mutation : {
        createTransaction : async(_, {input },context) => {
            try{
                const newTransaction = new Transaction({
                    ...input,
                    userId : context.getUser()._id
                } )
                await newTransaction.save();
                return newTransaction;

                
            }catch(err){

            }
        },
        updateTransaction : async(_, {input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    input.transactionId,input,{new : true}
                );
                return updatedTransaction;


            } catch (error) {
                console.log(error.message)
            }
        },
        deleteTransaction : async(_, {transactionId}) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction
            } catch (error) {
                console.log(error.message)
            }
        }
        //TODO => ADD TRANSACTION/USER RELATIONSHIP
    }
}

export default transactionResolver