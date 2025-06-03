import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { router, usePage } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

export default function DeleteEntityDialog({ url }: { url: string }) {
    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" variant="ghost">
                    <Trash className="text-red-800" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete this record.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-600 text-white hover:bg-red-700"
                        onClick={() => router.delete(url, {
                            onSuccess: () => {
                                if (flash?.success)
                                    toast.success(flash.success);
                                else if (flash?.error)
                                    toast.error(flash.error);
                                else
                                    toast.success('Record deleted successfully.');
                            }
                        })}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
