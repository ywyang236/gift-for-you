// src/pages/api/payment.ts
import type {NextApiRequest, NextApiResponse} from 'next';
import {db} from '../../lib/firebase/firebase';
import {doc, setDoc, updateDoc, arrayUnion} from 'firebase/firestore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        const {prime, amount, userId, orderData} = req.body;

        const response = await fetch('https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_TAPPAY_PARTNER_KEY!,
            },
            body: JSON.stringify({
                prime,
                partner_key: process.env.NEXT_PUBLIC_TAPPAY_PARTNER_KEY!,
                merchant_id: process.env.NEXT_PUBLIC_TAPPAY_MERCHANT_ID!,
                details: 'TapPay Test',
                amount,
                cardholder: {
                    name: orderData.name,
                    phone_number: orderData.phone,
                    email: orderData.email,
                },
                orderId: orderData.orderId,
                remember: true,
            }),
        });

        const data = await response.json();
        const paymentRef = doc(db, "users", userId, "data", 'user_checkout');

        const newPaymentInfo = {
            orderData,
            paymentStatus: data.status === 0 ? 'Payment Successful' : 'Payment Failed',
            paymentDetails: data,
        };

        try {
            await setDoc(paymentRef, {
                payments: arrayUnion(newPaymentInfo)
            }, {merge: true});

            res.status(200).json({
                data: {
                    orderId: orderData.orderId,
                    "payment": {
                        "status": data.status === 0 ? 0 : 1,
                        "message": data.status === 0 ? 'Payment Successful' : 'Payment Failed',
                        error: data.status === 0 ? null : data
                    }
                },
            });
        } catch (error) {
            res.status(500).json({error: "內部錯誤"});
        }
    }
}
