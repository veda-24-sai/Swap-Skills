import { useUsers, useSkills } from '../hooks/useApi';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, Users, Code } from 'lucide-react';

const ApiExample = () => {
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: skills, isLoading: skillsLoading, error: skillsError } = useSkills();

  if (usersLoading || skillsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading data from API...</span>
      </div>
    );
  }

  if (usersError || skillsError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading data. Make sure your backend is running!</p>
        <p className="text-sm text-red-500 mt-1">
          Backend should be running on http://localhost:5000
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Users from API</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user, idx) => (
          <Card key={user._id || user.id || idx}>
            <CardHeader>
              <CardTitle className="text-lg">{user.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{user.email}</p>
              <div className="flex flex-wrap gap-1">
                {user.skills?.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-8">
        <Code className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Skills from API</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills?.map((skill) => (
          <Card key={skill.id}>
            <CardHeader>
              <CardTitle className="text-lg">{skill.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="outline" className="mb-2">
                {skill.category}
              </Badge>
              <p className="text-sm text-gray-600">
                {skill.users} users have this skill
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ApiExample;
