import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Plus, X, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    location: "San Francisco, CA",
    bio: "Passionate developer and musician looking to share knowledge and learn new skills.",
    avatar: "",
    isPublic: true,
    availability: "Weekends, Evenings"
  });

  const [skillsOffered, setSkillsOffered] = useState(["JavaScript", "React", "Web Design"]);
  const [skillsWanted, setSkillsWanted] = useState(["Guitar", "Photography"]);
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  const availabilityOptions = [
    "Weekdays (9-5)",
    "Weekdays after 6pm", 
    "Weekends",
    "Weekends, Evenings",
    "Flexible",
    "Morning sessions",
    "By appointment"
  ];

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !skillsOffered.includes(newSkillOffered.trim())) {
      setSkillsOffered([...skillsOffered, newSkillOffered.trim()]);
      setNewSkillOffered("");
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !skillsWanted.includes(newSkillWanted.trim())) {
      setSkillsWanted([...skillsWanted, newSkillWanted.trim()]);
      setNewSkillWanted("");
    }
  };

  const removeSkillOffered = (skill: string) => {
    setSkillsOffered(skillsOffered.filter(s => s !== skill));
  };

  const removeSkillWanted = (skill: string) => {
    setSkillsWanted(skillsWanted.filter(s => s !== skill));
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your profile and skills</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-card">
              <CardHeader className="text-center">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2 mt-4">
                  <h3 className="text-xl font-semibold">{profile.name}</h3>
                  {profile.location && (
                    <div className="flex items-center justify-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {profile.availability}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="public-profile" className="text-sm font-medium">
                    Public Profile
                  </Label>
                  <Switch
                    id="public-profile"
                    checked={profile.isPublic}
                    onCheckedChange={(checked) => 
                      setProfile(prev => ({ ...prev, isPublic: checked }))
                    }
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {profile.isPublic ? "Visible to all users" : "Only visible to you"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell others about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select 
                    value={profile.availability} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, availability: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Skills Offered */}
            <Card>
              <CardHeader>
                <CardTitle className="text-success">Skills I Can Offer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill you can teach..."
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                  />
                  <Button onClick={addSkillOffered} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsOffered.map((skill) => (
                    <Badge key={skill} variant="success" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => removeSkillOffered(skill)}
                        className="hover:bg-success/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card>
              <CardHeader>
                <CardTitle className="text-primary">Skills I Want to Learn</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill you want to learn..."
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                  />
                  <Button onClick={addSkillWanted} size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => removeSkillWanted(skill)}
                        className="hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full" size="lg">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;