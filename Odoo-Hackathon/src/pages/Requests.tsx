import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Check, X, Clock, Star, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Requests = () => {
  const { toast } = useToast();

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: "1",
      type: "received",
      from: "Marcus Johnson",
      avatar: "",
      skillOffered: "Guitar",
      skillWanted: "JavaScript",
      message: "Hey! I'd love to teach you guitar in exchange for some JavaScript lessons. I'm available weekends.",
      createdAt: "2 hours ago"
    },
    {
      id: "2", 
      type: "sent",
      to: "Elena Rodriguez",
      avatar: "",
      skillOffered: "React",
      skillWanted: "Photography",
      message: "Hi Elena! I'd like to trade React lessons for photography tips. Let me know if you're interested!",
      createdAt: "1 day ago"
    }
  ]);

  const [activeSwaps, setActiveSwaps] = useState([
    {
      id: "3",
      partner: "David Kim",
      avatar: "",
      mySkill: "Web Design",
      theirSkill: "Python",
      status: "In Progress",
      nextSession: "Tomorrow, 2:00 PM",
      sessionsCompleted: 2,
      totalSessions: 4
    }
  ]);

  const [completedSwaps, setCompletedSwaps] = useState([
    {
      id: "4",
      partner: "Aisha Patel",
      avatar: "",
      mySkill: "JavaScript",
      theirSkill: "Yoga",
      completedAt: "Last week",
      rating: 5,
      feedback: "Amazing teacher! Really helped me understand the fundamentals."
    }
  ]);

  const handleAcceptRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (request) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast({
        title: "Request Accepted!",
        description: `You've accepted ${request.from}'s swap request. You can now coordinate your sessions.`,
      });
    }
  };

  const handleRejectRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (request) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast({
        title: "Request Declined",
        description: `You've declined ${request.from}'s swap request.`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteRequest = (requestId: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (request) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast({
        title: "Request Deleted",
        description: `Your request to ${request.to} has been deleted.`,
      });
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Swap Requests</h1>
          <p className="text-muted-foreground">Manage your skill swap requests and ongoing exchanges</p>
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Active ({activeSwaps.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Completed ({completedSwaps.length})
            </TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No pending requests</h3>
                  <p className="text-muted-foreground">
                    When others request skill swaps with you, they'll appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-soft transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={request.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(request.type === 'received' ? request.from : request.to!)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">
                            {request.type === 'received' ? (
                              <>Request from {request.from}</>
                            ) : (
                              <>Request to {request.to}</>
                            )}
                          </h3>
                          <p className="text-sm text-muted-foreground">{request.createdAt}</p>
                        </div>
                      </div>
                      <Badge variant={request.type === 'received' ? 'warning' : 'secondary'}>
                        {request.type === 'received' ? 'Received' : 'Sent'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{request.skillOffered}</Badge>
                          <span className="text-muted-foreground">for</span>
                          <Badge variant="outline">{request.skillWanted}</Badge>
                        </div>
                      </div>
                      <p className="text-sm bg-muted p-3 rounded-lg">{request.message}</p>
                      <div className="flex gap-2">
                        {request.type === 'received' ? (
                          <>
                            <Button 
                              onClick={() => handleAcceptRequest(request.id)}
                              size="sm"
                              className="flex-1"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              onClick={() => handleRejectRequest(request.id)}
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Button 
                            onClick={() => handleDeleteRequest(request.id)}
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Request
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Active Swaps */}
          <TabsContent value="active" className="space-y-4">
            {activeSwaps.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active swaps</h3>
                  <p className="text-muted-foreground">
                    Once you accept a request, your active swaps will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              activeSwaps.map((swap) => (
                <Card key={swap.id} className="hover:shadow-soft transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={swap.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(swap.partner)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">Swapping with {swap.partner}</h3>
                          <p className="text-sm text-muted-foreground">Next: {swap.nextSession}</p>
                        </div>
                      </div>
                      <Badge variant="success">{swap.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{swap.mySkill}</Badge>
                          <span className="text-muted-foreground">↔</span>
                          <Badge variant="outline">{swap.theirSkill}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Progress: {swap.sessionsCompleted}/{swap.totalSessions} sessions</span>
                        <div className="flex-1 max-w-32 bg-muted rounded-full h-2 ml-4">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${(swap.sessionsCompleted / swap.totalSessions) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message {swap.partner}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Completed Swaps */}
          <TabsContent value="completed" className="space-y-4">
            {completedSwaps.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed swaps yet</h3>
                  <p className="text-muted-foreground">
                    Your completed skill swaps and feedback will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              completedSwaps.map((swap) => (
                <Card key={swap.id} className="hover:shadow-soft transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={swap.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(swap.partner)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">Completed with {swap.partner}</h3>
                          <p className="text-sm text-muted-foreground">{swap.completedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < swap.rating ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="success">{swap.mySkill}</Badge>
                          <span className="text-muted-foreground">↔</span>
                          <Badge variant="outline">{swap.theirSkill}</Badge>
                        </div>
                      </div>
                      <p className="text-sm bg-muted p-3 rounded-lg italic">"{swap.feedback}"</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Requests;