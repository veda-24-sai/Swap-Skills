import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Star, Clock, ArrowLeft, Edit, Save, X } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, updateProfile } = useAuth();
  const { data: user, isLoading, error } = useUser(id);
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    experience: currentUser?.experience || '',
    availability: currentUser?.availability || '',
    skillsOffered: currentUser?.skillsOffered?.join(', ') || '',
    skillsWanted: currentUser?.skillsWanted?.join(', ') || '',
    avatar: null as File | null
  });

  // Check if this is the current user's profile
  const isOwnProfile = !id || (currentUser && currentUser._id === id);
  const needsProfileCompletion = isOwnProfile && currentUser && !currentUser.profileCompleted;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, avatar: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('availability', formData.availability);
    formDataToSend.append('skillsOffered', formData.skillsOffered);
    formDataToSend.append('skillsWanted', formData.skillsWanted);
    if (formData.avatar) {
      formDataToSend.append('avatar', formData.avatar);
    }

    try {
      await updateProfile(formDataToSend);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    }
  };

  // Show profile completion form for new users
  if (needsProfileCompletion) {
    return (
      <div className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-gray-600">Tell us about yourself to get started with SkillSwap</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="City, Country"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                placeholder="Describe your experience and background..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Weekends, Evenings, Flexible"
              />
            </div>

            <div>
              <Label htmlFor="skillsOffered">Skills You Can Teach</Label>
              <Input
                id="skillsOffered"
                name="skillsOffered"
                value={formData.skillsOffered}
                onChange={handleInputChange}
                placeholder="e.g., JavaScript, Guitar, Spanish (comma separated)"
              />
            </div>

            <div>
              <Label htmlFor="skillsWanted">Skills You Want to Learn</Label>
              <Input
                id="skillsWanted"
                name="skillsWanted"
                value={formData.skillsWanted}
                onChange={handleInputChange}
                placeholder="e.g., Python, Photography, Cooking (comma separated)"
              />
            </div>

            <div>
              <Label htmlFor="avatar">Profile Picture (Optional)</Label>
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <Button type="submit" className="w-full">
              Complete Profile
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading profile...</span>
      </div>
    );
  }

  // Show error state
  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600 font-semibold mb-2">User not found</p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Show profile view/edit
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {isOwnProfile && currentUser && (
          <div className="mb-4">
            <h2 className="text-primary text-lg font-semibold">Welcome to your Profile, {currentUser.username}!</h2>
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {isOwnProfile && (
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <div className="relative">
                <img
                  src={user.avatar || '/placeholder.svg'}
                  alt={user.name || user.username}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="experience">Experience</Label>
              <Textarea
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label htmlFor="skillsOffered">Skills You Can Teach</Label>
              <Input
                id="skillsOffered"
                name="skillsOffered"
                value={formData.skillsOffered}
                onChange={handleInputChange}
                placeholder="comma separated"
              />
            </div>

            <div>
              <Label htmlFor="skillsWanted">Skills You Want to Learn</Label>
              <Input
                id="skillsWanted"
                name="skillsWanted"
                value={formData.skillsWanted}
                onChange={handleInputChange}
                placeholder="comma separated"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
              <img
                src={user.avatar || '/placeholder.svg'}
                alt={user.name || user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{user.name || user.username}</h1>
                {user.location && (
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-lg">{user.rating || 4.5}</span>
                  <span className="text-gray-600 ml-2">
                    ({user.completedSwaps || 0} swaps completed)
                  </span>
                </div>
                {user.availability && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>{user.availability}</span>
                  </div>
                )}
              </div>
            </div>

            {user.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">About</h2>
                <p className="text-gray-700 text-base leading-relaxed">{user.bio}</p>
              </div>
            )}

            {user.experience && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Experience</h2>
                <p className="text-gray-700 text-base">{user.experience}</p>
              </div>
            )}

            {user.skillsOffered && user.skillsOffered.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Skills Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered.map((skill) => (
                    <Badge key={skill} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.skillsWanted && user.skillsWanted.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Skills Wanted</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
