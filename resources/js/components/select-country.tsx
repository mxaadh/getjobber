import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function SelectCountry({ job_id }: { value: string, onChange: (value: string) => void }) {
    const { data, setData, get } = useForm({
        country: ''
    })

    useEffect(() => {
        handleCountrySelection()
    }, [data.country]);

    const handleCountrySelection = () => {
        get(`/jobs/${job_id}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="mb-4">
            <Label htmlFor="country">Country</Label>
            <Select value={data.country} onValueChange={(value) => setData('country', value)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(countries).map(([code, name]) => (
                        <SelectItem key={code} value={name}>  {/* Using name as value */}
                            {name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
