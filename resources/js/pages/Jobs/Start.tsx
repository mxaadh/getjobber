import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageHeadingButtons from '@/components/page-heading-buttons';

export default function Start({ job, prePhotos }: { job: any; prePhotos: any[] }) {
    const { data, setData, post, progress } = useForm({
        pre_photos: [] as File[]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('pre_photos', Array.from(e.target.files));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/jobs/${job.id}/upload-pre-photos`);
    };

    console.log(prePhotos);
    return (
        <AppLayout>
            <Head title="Start Job" />
            <div className="max-w-4xl mx-auto space-y-4 mt-8">
                <PageHeadingButtons heading={'Start Job'}>
                    {prePhotos.length > 0 && (
                        <Link href={`/jobs/${job.id}/complete`}>
                            <Button>Mark Complete</Button>
                        </Link>
                    )}
                </PageHeadingButtons>
                <Card>
                    <CardHeader>
                        <CardTitle>Start Job - Upload Pre-Job Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
                            {progress && <div>Uploading: {progress.percentage}%</div>}
                            <Button type="submit">Upload & Continue</Button>
                        </form>
                    </CardContent>
                </Card>

                {prePhotos && prePhotos.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pre-Job Photos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {prePhotos.map((photo) => (
                                    <div key={photo.id} className="border rounded overflow-hidden shadow">
                                        <a href={`/storage/${photo.path}`} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={`/storage/${photo.path}`}
                                                alt="Pre job"
                                                className="w-full h-40 object-cover hover:opacity-80 transition"
                                            />
                                        </a>
                                    </div>
                                ))}

                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
