<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PricingMail extends Mailable
{
    use Queueable, SerializesModels;

    public mixed $quotationData;
    public string $approveUrl;
    public string $rejectUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($quotationData)
    {
        $this->quotationData = $quotationData;
        $this->approveUrl = route('prices.approve', [
            'price' => $quotationData['id'], // Changed from $this->quotationData
            'token' => $this->generateToken($quotationData['id'], 'approve')
        ]);
        $this->rejectUrl = route('prices.reject', [
            'price' => $quotationData['id'], // Changed from $this->quotationData
            'token' => $this->generateToken($quotationData['id'], 'reject')
        ]);
    }


    protected function generateToken($priceId, $action)
    {
        return hash_hmac('sha256', $priceId.$action, config('app.key'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Job Pricing #' . $this->quotationData['quotation_number'],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.quotation',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
