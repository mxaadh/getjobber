import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { usePage } from '@inertiajs/react';
import { SharedData } from '@/types';

const Checkout = () => {
    const { stripeKey } = usePage<SharedData>().props;

    const handleCheckout = async () => {
        await loadStripe(stripeKey);

        // This will redirect to the Laravel checkout route
        window.location.href = route('requests.checkout');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Checkout</h1>
            <button
                onClick={handleCheckout}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Pay with Stripe
            </button>
        </div>
    );
};

export default Checkout;
