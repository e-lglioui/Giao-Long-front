import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Search, SlidersHorizontal } from 'lucide-react';

interface SchoolFiltersProps {
  onFilterChange: (filters: SchoolFilters) => void;
}

export interface SchoolFilters {
  search: string;
  sortBy: 'name' | 'studentCount' | 'revenue';
  sortOrder: 'asc' | 'desc';
  minStudents?: number;
  maxStudents?: number;
}

export function SchoolFilters({ onFilterChange }: SchoolFiltersProps) {
  const [filters, setFilters] = useState<SchoolFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (
    key: keyof SchoolFilters,
    value: string | number
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search schools..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => 
            handleFilterChange('sortBy', value as 'name' | 'studentCount' | 'revenue')
          }
        >
          <option value="name">Name</option>
          <option value="studentCount">Student Count</option>
          <option value="revenue">Revenue</option>
        </Select>
        <Select
          value={filters.sortOrder}
          onValueChange={(value) => 
            handleFilterChange('sortOrder', value as 'asc' | 'desc')
          }
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </Select>
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium">Min Students</label>
            <Input
              type="number"
              value={filters.minStudents || ''}
              onChange={(e) => 
                handleFilterChange('minStudents', parseInt(e.target.value))
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Students</label>
            <Input
              type="number"
              value={filters.maxStudents || ''}
              onChange={(e) => 
                handleFilterChange('maxStudents', parseInt(e.target.value))
              }
            />
          </div>
        </div>
      )}
    </div>
  );
} 