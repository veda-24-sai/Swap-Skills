import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const Signup = () => {
  const { register, loading, error, user } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('password', password);
      if (avatar) formData.append('avatar', avatar);
      await register(formData);
      toast({
        title: "Registration Successful",
        description: "Welcome to SkillSwap! Please complete your profile.",
      });
      // Redirect to browse page
      navigate('/browse');
    } catch (err: any) {
      setFormError(err.message || 'Registration failed');
      toast({
        title: "Registration Failed",
        description: err.message || "Please try again.",
        variant: "destructive"
      });
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" encType="multipart/form-data">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {formError || error ? (
          <div className="mb-4 text-red-600 text-sm text-center">{formError || error}</div>
        ) : null}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Username</label>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="Choose a username"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="Create a password"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Avatar (optional)</label>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={e => setAvatar(e.target.files?.[0] || null)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Sign Up
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
