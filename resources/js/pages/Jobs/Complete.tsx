import React from 'react';
import { useForm, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import PageHeadingButtons from '@/components/page-heading-buttons';

export default function Complete({ job, postPhotos }: { job: any; postPhotos: any[] }) {
    const { data, setData, post, progress } = useForm({
        post_photos: [] as File[]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('post_photos', Array.from(e.target.files));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/jobs/${job.id}/upload-post-photos`);
    };

    return (
        <div className="w-full space-y-4 mt-8">
            <PageHeadingButtons heading={'Complete Job'}>
                {job.status !== "completed" && (
                    <>
                        {postPhotos.length > 0 && (
                            <Link href={`/jobs/${job.id}/finish`}>
                                <Button variant="default" className="bg-green-600 hover:bg-green-700">
                                    Finish & Submit
                                </Button>
                            </Link>
                        )}
                    </>
                )}

            </PageHeadingButtons>

            <Card>
                <CardHeader>
                    <CardTitle>Upload Post-Job Photos</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input type="file" multiple accept="image/*" onChange={handleFileChange} />
                        {progress && <div>Uploading: {progress.percentage}%</div>}
                        <Button type="submit">Upload & Continue</Button>
                    </form>
                </CardContent>
            </Card>

            {postPhotos && postPhotos.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Post-Job Photos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {postPhotos.map((photo) => (
                                <div key={photo.id} className="border rounded overflow-hidden shadow">
                                    <a href={`/storage/${photo.path}`} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={`/storage/${photo.path}`}
                                            alt="Post job"
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
    );
}
