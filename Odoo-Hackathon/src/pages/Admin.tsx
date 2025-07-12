import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  Download, 
  Send, 
  Ban, 
  Check, 
  X,
  Search,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  
  const [message, setMessage] = useState("");
  
  // Mock data
  const stats = [
    { icon: Users, label: "Total Users", value: "2,547", change: "+12%" },
    { icon: MessageSquare, label: "Active Swaps", value: "1,234", change: "+8%" },
    { icon: AlertTriangle, label: "Pending Reports", value: "5", change: "-20%" },
    { icon: BarChart3, label: "Success Rate", value: "94%", change: "+2%" },
  ];

  const [reportedContent, setReportedContent] = useState([
    {
      id: "1",
      type: "skill",
      content: "Expert hacker - can teach you to hack anything",
      reportedBy: "user123",
      reason: "Inappropriate content",
      userId: "hacker_pro",
      userName: "Alex Smith",
      createdAt: "2 hours ago"
    },
    {
      id: "2", 
      type: "profile",
      content: "Selling drugs and other illegal stuff. Contact me for details.",
      reportedBy: "user456",
      reason: "Illegal activities",
      userId: "sketchy_user",
      userName: "John Doe",
      createdAt: "1 day ago"
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@example.com",
      status: "active",
      joinDate: "2023-01-15",
      swapsCompleted: 12,
      rating: 4.9
    },
    {
      id: "2",
      name: "Marcus Johnson", 
      email: "marcus@example.com",
      status: "banned",
      joinDate: "2023-02-20",
      swapsCompleted: 3,
      rating: 2.1
    }
  ]);

  const [swaps, setSwaps] = useState([
    {
      id: "1",
      user1: "Sarah Chen",
      user2: "Marcus Johnson",
      skill1: "JavaScript",
      skill2: "Guitar",
      status: "completed",
      startDate: "2024-01-10",
      endDate: "2024-01-25"
    },
    {
      id: "2",
      user1: "Elena Rodriguez",
      user2: "David Kim", 
      skill1: "Spanish",
      skill2: "Python",
      status: "in_progress",
      startDate: "2024-01-20",
      endDate: null
    }
  ]);

  const handleApproveContent = (contentId: string) => {
    setReportedContent(prev => prev.filter(c => c.id !== contentId));
    toast({
      title: "Content Approved",
      description: "The reported content has been approved and will remain visible.",
    });
  };

  const handleRejectContent = (contentId: string) => {
    const content = reportedContent.find(c => c.id === contentId);
    setReportedContent(prev => prev.filter(c => c.id !== contentId));
    toast({
      title: "Content Rejected",
      description: `The inappropriate ${content?.type} has been removed.`,
      variant: "destructive"
    });
  };

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: "banned" } : user
    ));
    toast({
      title: "User Banned",
      description: "The user has been banned from the platform.",
      variant: "destructive"
    });
  };

  const handleUnbanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: "active" } : user
    ));
    toast({
      title: "User Unbanned",
      description: "The user has been unbanned and can access the platform again.",
    });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      toast({
        title: "Message Sent",
        description: "Your platform-wide message has been sent to all users.",
      });
      setMessage("");
    }
  };

  const handleDownloadReport = (type: string) => {
    toast({
      title: "Report Generated",
      description: `${type} report has been generated and will download shortly.`,
    });
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "banned":
        return <Badge variant="destructive">Banned</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in_progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, content, and platform settings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-success">{stat.change} from last month</p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="reports">
              Content Reports ({reportedContent.length})
            </TabsTrigger>
            <TabsTrigger value="users">
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="swaps">
              Swaps ({swaps.length})
            </TabsTrigger>
            <TabsTrigger value="messages">
              Messages
            </TabsTrigger>
            <TabsTrigger value="reports-download">
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Content Reports */}
          <TabsContent value="reports">
            <div className="space-y-4">
              {reportedContent.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No pending reports</h3>
                    <p className="text-muted-foreground">All reported content has been reviewed</p>
                  </CardContent>
                </Card>
              ) : (
                reportedContent.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{content.type} Report</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Reported by {content.reportedBy} • {content.createdAt}
                          </p>
                        </div>
                        <Badge variant="warning">Pending Review</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Reported Content:</p>
                          <p className="text-sm bg-muted p-3 rounded-lg">{content.content}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Reason:</p>
                          <p className="text-sm">{content.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">User:</p>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                {getInitials(content.userName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{content.userName} (@{content.userId})</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleApproveContent(content.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleRejectContent(content.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove Content
                          </Button>
                          <Button 
                            onClick={() => handleBanUser(content.userId)}
                            variant="destructive"
                            size="sm"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban User
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search users..." className="w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {user.joinDate} • {user.swapsCompleted} swaps • {user.rating}⭐
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(user.status)}
                        {user.status === "active" ? (
                          <Button 
                            onClick={() => handleBanUser(user.id)}
                            variant="destructive" 
                            size="sm"
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleUnbanUser(user.id)}
                            variant="outline" 
                            size="sm"
                          >
                            Unban
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Swaps Monitoring */}
          <TabsContent value="swaps">
            <Card>
              <CardHeader>
                <CardTitle>Swap Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {swaps.map((swap) => (
                    <div key={swap.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{swap.user1} ↔ {swap.user2}</p>
                        <p className="text-sm text-muted-foreground">
                          {swap.skill1} for {swap.skill2}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Started: {swap.startDate} {swap.endDate && `• Ended: ${swap.endDate}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(swap.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Messages */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Send Platform-Wide Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Message Content</label>
                  <Textarea
                    placeholder="Enter your platform-wide message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] mt-1"
                  />
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message to All Users
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Download */}
          <TabsContent value="reports-download">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Download comprehensive user activity data including registrations, swaps, and engagement metrics.
                  </p>
                  <Button onClick={() => handleDownloadReport("User Activity")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Feedback & Ratings Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all user feedback, ratings, and review data for analysis and quality improvement.
                  </p>
                  <Button onClick={() => handleDownloadReport("Feedback & Ratings")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Swap Statistics Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get detailed statistics on skill swaps, success rates, and platform performance metrics.
                  </p>
                  <Button onClick={() => handleDownloadReport("Swap Statistics")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Content Moderation Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Review all content moderation actions, reports, and platform safety metrics.
                  </p>
                  <Button onClick={() => handleDownloadReport("Content Moderation")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;