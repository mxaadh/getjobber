<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Mail\Mailables\Attachment;

class QuotationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $quotationData;
    public string $approveUrl;
    public string $rejectUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($quotationData)
    {
        $this->quotationData = $quotationData;
//        $this->approveUrl = route('quotes.approve', [
//            'quote' => $this->quotationData['id'],
//            'token' => $this->generateToken($this->quotationData['id'], 'approve')
//        ]);
//        $this->rejectUrl = route('quotes.reject', [
//            'quote' => $this->quotationData['id'],
//            'token' => $this->generateToken($this->quotationData['id'], 'reject')
//        ]);
        $this->approveUrl = route('requests.show', $this->quotationData['service_request_id']);
        $this->rejectUrl = route('requests.show', $this->quotationData['service_request_id']);
    }

    protected function generateToken($quoteId, $action)
    {
        return hash_hmac('sha256', $quoteId . $action, config('app.key'));
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Quotation Mail #' . $this->quotationData['quotation_number'],
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
        $pdf = Pdf::loadView('emails.quotation_pdf', ['quotationData' => $this->quotationData]);

        return [
            Attachment::fromData(fn() => $pdf->output(), 'quotation_' . $this->quotationData['quotation_number'] . '.pdf')
                ->withMime('application/pdf')
        ];
    }
}
