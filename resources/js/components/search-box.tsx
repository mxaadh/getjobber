import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchInputProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                                 searchValue,
                                                                 onSearchChange,
                                                                 onSearchSubmit
                                                             }) => {
    return (
        <div className="relative w-full md:w-64">
            <form onSubmit={onSearchSubmit}>
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                {/*{searchValue && (
                    <X
                        className="absolute right-3 top-3 h-4 w-4 text-muted-foreground cursor-pointer"
                        onClick={onClearSearch}
                    />
                )}*/}
                <Input
                    placeholder="Search clients..."
                    className="pl-9"
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            onSearchSubmit(e);
                        }
                    }}
                />
            </form>
        </div>
    );
};

export default SearchInput;
