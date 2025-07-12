import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, MessageSquare } from "lucide-react";

interface SkillCardProps {
  user: {
    id: string;
    name: string;
    location?: string;
    avatar?: string;
    rating: number;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string;
  };
  onRequestSwap?: (userId: string) => void;
}

const SkillCard = ({ user, onRequestSwap }: SkillCardProps) => {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  
  return (
    <Card className="w-full bg-gradient-card hover:shadow-hover transition-all duration-300 animate-scale-in">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            {user.location && (
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {user.location}
              </div>
            )}
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 fill-warning text-warning mr-1" />
              <span className="text-sm font-medium">{user.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2 text-success">Skills Offered</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.map((skill, index) => (
              <Badge key={index} variant="skill" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2 text-primary">Skills Wanted</h4>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Available: {user.availability}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onRequestSwap?.(user.id)}
          className="w-full"
          size="sm"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Request Swap
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SkillCard;