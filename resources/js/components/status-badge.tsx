import { Badge } from '@/components/ui/badge';

export function StatusBadge({ status }) {
    let _variant = 'default';

    if (status === 'pending')
        _variant = 'secondary';
    else if (status === 'active')
        _variant = 'primary';
    else if (status === 'rejected')
        _variant = 'destructive';

    const capitalized = status.charAt(0).toUpperCase() + status.slice(1);

    return (
        <Badge variant={_variant}>{capitalized}</Badge>
    );
}
