import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Users,
  X,
  Star,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

const fetchUsers = async () => {
  const res = await fetch("http://localhost:5000/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const Browse = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedSkillToOffer, setSelectedSkillToOffer] = useState("");
  const [selectedSkillToLearn, setSelectedSkillToLearn] = useState("");

  // Mock current user's skills (in a real app, this would come from user context/auth)
  const currentUserSkills = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Photography",
    "Guitar",
  ];

  // Mock data for demonstration
  const popularSkills = [
    "JavaScript",
    "Python",
    "Guitar",
    "Photography",
    "Cooking",
    "Spanish",
    "Photoshop",
    "Yoga",
    "Marketing",
    "Drawing",
    "Excel",
    "Chess",
  ];

  // Fetch users from backend
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRequestSwap = (user: any) => {
    setSelectedUser(user);
    setShowRequestForm(true);
  };

  const handleProfileClick = (user: any) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleSendRequest = () => {
    // Validate that both skills are entered
    if (!selectedSkillToOffer.trim() || !selectedSkillToLearn.trim()) {
      alert("Please enter both skills for the swap");
      return;
    }

    // In a real app, this would send the request to your backend
    setShowRequestForm(false);
    setShowProfileModal(false);
    setRequestMessage("");
    setSelectedSkillToOffer("");
    setSelectedSkillToLearn("");
    // Show success message
    alert(
      `Swap request sent to ${selectedUser?.name}! You offered: ${selectedSkillToOffer}, Want to learn: ${selectedSkillToLearn}`
    );
  };

  // Filter users based on search and selected skills
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch =
      searchQuery === "" ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.skillsOffered.some((skill: string) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      user.skillsWanted.some((skill: string) =>
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => user.skillsOffered.includes(skill));

    return matchesSearch && matchesSkills;
  });

  const SkillCard = ({ user, onRequestSwap, onProfileClick }: any) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onProfileClick(user)}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{user.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
            <MapPin className="h-3 w-3" />
            <span>{user.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{user.rating}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">Offers:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skillsOffered.map((skill: string) => (
              <Badge key={skill} variant="default" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">Wants:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skillsWanted.map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Clock className="h-4 w-4" />
        <span>{user.availability}</span>
      </div>

      <Button onClick={() => onRequestSwap(user)} className="w-full">
        Request Swap
      </Button>
    </div>
  );

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error loading users. Please try again later.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Skills</h1>
          <p className="text-gray-600">
            Find people with the skills you need and connect with them
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for skills, people, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium">Popular Skills</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant={
                    selectedSkills.includes(skill) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSkills([])}
                className="mt-2"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>{filteredUsers.length} people found</span>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <SkillCard
              key={user.id}
              user={user}
              onRequestSwap={handleRequestSwap}
              onProfileClick={handleProfileClick}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Send Swap Request</h3>
              <button
                onClick={() => setShowRequestForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedUser.location}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Skill to Offer
                </label>
                <input
                  type="text"
                  value={selectedSkillToOffer}
                  onChange={(e) => setSelectedSkillToOffer(e.target.value)}
                  placeholder="e.g. JavaScript, Guitar, Cooking..."
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Skill You Want to Learn
                </label>
                <input
                  type="text"
                  value={selectedSkillToLearn}
                  onChange={(e) => setSelectedSkillToLearn(e.target.value)}
                  placeholder="e.g. Photography, Spanish, Yoga..."
                  className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Message (Optional)
              </label>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Tell them why you're interested in learning from them..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRequestForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendRequest}
                className="flex-1 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Profile</h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="text-center mb-6">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{selectedUser.name}</h2>
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{selectedUser.location}</span>
              </div>
              <div className="flex items-center justify-center gap-1 mb-4">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{selectedUser.rating}</span>
                <span className="text-gray-600 ml-2">
                  ({selectedUser.completedSwaps} swaps completed)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {selectedUser.bio}
              </p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Experience</h4>
              <p className="text-gray-700 text-sm">{selectedUser.experience}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Skills Offered</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUser.skillsOffered.map((skill: string) => (
                  <Badge key={skill} variant="default">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Skills Wanted</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUser.skillsWanted.map((skill: string) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Availability</h4>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span>{selectedUser.availability}</span>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowProfileModal(false);
                handleRequestSwap(selectedUser);
              }}
              className="w-full"
            >
              Request Swap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
