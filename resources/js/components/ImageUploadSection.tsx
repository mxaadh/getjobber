import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';

export default function ImageUploadSection({ title, jobId, type }: {
    title: string,
    jobId: number,
    type: 'before' | 'after'
}) {
    const { post, setData } = useForm();
    const [files, setFiles] = useState<File[]>([]);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        setFiles(selected);
        setData('images', selected);
        post(`/jobs/${jobId}/upload-images`, { data: { type } });
    };

    return (
        <div className="mb-4">
            <h4 className="text-md font-semibold mb-2">{title}</h4>
            <Input type="file" multiple onChange={handleUpload} />
        </div>
    );
}
