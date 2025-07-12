import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';

// Custom hook for fetching users with search and skills filter
export const useUsers = (params = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => apiService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Custom hook for fetching a single user
export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => apiService.getUserById(id),
    enabled: !!id,
  });
};

// Custom hook for fetching skills
export const useSkills = () => {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => apiService.getSkills(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Custom hook for fetching projects
export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => apiService.getProjects(),
  });
};

// Custom hook for fetching requests
export const useRequests = () => {
  return useQuery({
    queryKey: ['requests'],
    queryFn: () => apiService.getRequests(),
  });
};

// Custom hook for health check
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    refetchInterval: 30000, // Check every 30 seconds
  });
};
