import express from "express";
import db from '@repo/db/client';
const app = express();

app.use(express.json())


app.post("/hdfcWebhook", async (req, res) => {
    //TODO: Add zod validation here?
    const paymentInformation = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };
    await db.balance.update({
        where:{
            userId: paymentInformation.userId
        },data: {
            amount: {
                // You can also get this from your DB
                increment: Number(paymentInformation.amount)
            }
        }
    })
    await db.onRampTransaction.update({
        where: {
            token: paymentInformation.token
        }, 
        data: {
            status: "Success",
        }
    })
    res.json({
        message: "Captured"
    })
    // Update balance in db, add txn
})