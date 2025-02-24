import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SchoolFilters, type SchoolFilters as Filters } from './SchoolFilters';
import { Pagination } from './Pagination';
import { School } from '../types/school.types';
import { schoolService } from '../services/school.service';
import { useToast } from "@/components/ui/use-toast";
import { Plus, Users, MapPin } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

export function SchoolsList() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadSchools();
  }, []);

  const loadSchools = async () => {
    try {
      setIsLoading(true);
      const data = await schoolService.getAllSchools();
      setSchools(data);
      setFilteredSchools(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load schools",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: Filters) => {
    let filtered = [...schools];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(school => 
        school.name.toLowerCase().includes(searchLower) ||
        school.address.toLowerCase().includes(searchLower)
      );
    }

    // Apply student count filters
    if (filters.minStudents) {
      filtered = filtered.filter(school => 
        school.dashboard.studentCount >= filters.minStudents!
      );
    }
    if (filters.maxStudents) {
      filtered = filtered.filter(school => 
        school.dashboard.studentCount <= filters.maxStudents!
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'studentCount':
          comparison = a.dashboard.studentCount - b.dashboard.studentCount;
          break;
        case 'revenue':
          comparison = a.dashboard.revenue - b.dashboard.revenue;
          break;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredSchools(filtered);
    setCurrentPage(1);
  };

  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredSchools.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Kung Fu Schools</h2>
        <Button onClick={() => navigate('/schools/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add New School
        </Button>
      </div>

      <SchoolFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedSchools.map((school) => (
            <Card
              key={school._id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/schools/${school._id}`)}
            >
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{school.name}</h3>
                <p className="text-gray-500 flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  {school.address}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {school.dashboard.studentCount} Students
                  </div>
                  <div className="text-sm text-gray-500">
                    {school.instructors.length} Instructors
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
} 