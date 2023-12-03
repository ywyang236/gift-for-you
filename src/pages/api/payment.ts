// src/pages/api/payment.ts
import type {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        const {prime, amount, userId} = req.body;

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
                    phone_number: '+886923456789',
                    name: '王小明',
                    email: '',
                },
                remember: true,
            }),
        });

        const data = await response.json();
        if (data.status === 0) {
            res.status(200).json({
                data: {
                    number: data.card_info.last_four,
                    bank: data.card_info.issuer,
                    name: data.card_info.holder,
                    amount: data.amount,
                    time: data.transaction_time,
                    prime: data.prime,
                },
            });
        } else {
            res.status(200).json({
                success: false,
                message: '支付處理失敗',
                error: data
            });
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
}
