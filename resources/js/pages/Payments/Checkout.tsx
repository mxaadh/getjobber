import React from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { loadStripe } from '@stripe/stripe-js';

const Checkout = () => {
    const { stripeKey } = usePage().props;

    const handleCheckout = async () => {
        const stripe = await loadStripe(stripeKey);

        // This will redirect to the Laravel checkout route
        window.location.href = route('checkout');
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
