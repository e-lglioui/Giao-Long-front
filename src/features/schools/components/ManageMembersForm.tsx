import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { schoolService } from '../services/school.service';
import { School } from '../types/school.types';

const memberSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type MemberFormData = z.infer<typeof memberSchema>;

interface ManageMembersFormProps {
  school: School;
  onUpdate: () => void;
}

export function ManageMembersForm({ school, onUpdate }: ManageMembersFormProps) {
  const [activeTab, setActiveTab] = useState('instructors');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = async (data: MemberFormData) => {
    try {
      setIsLoading(true);
      if (activeTab === 'instructors') {
        await schoolService.addInstructor(school._id, data.email);
        toast({
          title: "Success",
          description: "Instructor added successfully",
        });
      } else {
        await schoolService.addStudent(school._id, data.email);
        toast({
          title: "Success",
          description: "Student added successfully",
        });
      }
      reset();
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Members</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructors">Instructors</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="instructors">
            <div className="space-y-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    {...register("email")}
                    placeholder="Enter instructor email"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Instructor"}
                </Button>
              </form>

              <div className="mt-6">
                <h4 className="font-medium mb-4">Current Instructors</h4>
                <div className="space-y-2">
                  {school.instructors.map((instructor) => (
                    <div
                      key={instructor._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{instructor.username}</div>
                        <div className="text-sm text-gray-500">
                          {instructor.email}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {/* Handle remove instructor */}}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="students">
            {/* Similar structure for students */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 