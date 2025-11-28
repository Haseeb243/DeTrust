import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api, authApi, userApi } from '@/lib/api';
import type { User as ApiUser } from '@/lib/api';

type User = ApiUser;

const requiresProfileCompletion = (user: User | null) => {
  if (!user) return false;
  if (user.role === 'FREELANCER') {
    return !(user.freelancerProfile && user.freelancerProfile.profileComplete);
  }
  if (user.role === 'CLIENT') {
    const profile = user.clientProfile;
    if (!profile) return true;
    return !(profile.companyName && profile.description && profile.industry);
  }
  return false;
};

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  requires2FA: boolean;
  isNewUser: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  
  // Auth methods
  register: (email: string, password: string, name: string, role: 'CLIENT' | 'FREELANCER') => Promise<boolean>;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<boolean>;
  loginWithWallet: (address: string, signMessage: (message: string) => Promise<string>) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      requires2FA: false,
      isNewUser: false,

      // State setters
      setUser: (user) => set({ user, isAuthenticated: !!user, isNewUser: requiresProfileCompletion(user) }),
      setToken: (token) => {
        set({ token });
        api.setToken(token);
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      clearAuth: () => {
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
          requires2FA: false,
          isNewUser: false,
        });
        api.setToken(null);
      },

      // Email registration
      register: async (email, password, name, role) => {
        set({ isLoading: true, error: null });
        
        const response = await authApi.register({ email, password, name, role });
        
        if (!response.success || !response.data) {
          set({ 
            isLoading: false, 
            error: response.error?.message || 'Registration failed' 
          });
          return false;
        }
        
        const { user, token, refreshToken } = response.data;
        const nextUser = user as User;
        
        api.setToken(token);
        set({
          user: nextUser,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          isNewUser: true,
        });
        
        return true;
      },

      // Email login
      login: async (email, password, twoFactorCode) => {
        set({ isLoading: true, error: null, requires2FA: false });
        
        const response = await authApi.login({ email, password, twoFactorCode });
        
        if (!response.success || !response.data) {
          set({ 
            isLoading: false, 
            error: response.error?.message || 'Login failed' 
          });
          return false;
        }
        
        // Check if 2FA is required
        if (response.data.requires2FA) {
          set({ isLoading: false, requires2FA: true });
          return false;
        }
        
        const { user, token, refreshToken } = response.data;
        const nextUser = user as User;
        const shouldCompleteProfile = requiresProfileCompletion(nextUser);
        
        api.setToken(token);
        set({
          user: nextUser,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          isNewUser: shouldCompleteProfile,
        });
        
        return true;
      },

      // Wallet login (SIWE)
      loginWithWallet: async (address, signMessage) => {
        set({ isLoading: true, error: null });
        
        try {
          // Get nonce
          const nonceResponse = await authApi.getWalletNonce(address);
          
          if (!nonceResponse.success || !nonceResponse.data) {
            throw new Error(nonceResponse.error?.message || 'Failed to get nonce');
          }
          
          const { message } = nonceResponse.data;
          
          // Sign message with wallet
          const signature = await signMessage(message);
          
          // Verify signature
          const verifyResponse = await authApi.verifyWallet(address, signature, message);
          
          if (!verifyResponse.success || !verifyResponse.data) {
            throw new Error(verifyResponse.error?.message || 'Failed to verify signature');
          }
          
          const { user, token, refreshToken, isNewUser } = verifyResponse.data;
          const nextUser = user as User;
          const profileIncomplete = requiresProfileCompletion(nextUser);
          
          api.setToken(token);
          set({
            user: nextUser,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            isNewUser: isNewUser ?? profileIncomplete,
          });
          
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Wallet login failed' 
          });
          return false;
        }
      },

      // Logout
      logout: () => {
        get().clearAuth();
        // Redirect will be handled by components/middleware
      },

      // Fetch current user
      fetchUser: async () => {
        const { token } = get();
        
        if (!token) {
          set({ isAuthenticated: false });
          return;
        }
        
        api.setToken(token);
        set({ isLoading: true });
        
        const response = await userApi.getMe();
        
        if (response.success && response.data) {
          const nextUser = response.data as User;
          set({ 
            user: nextUser, 
            isAuthenticated: true, 
            isLoading: false,
            isNewUser: requiresProfileCompletion(nextUser),
          });
        } else {
          get().clearAuth();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'detrust-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isNewUser: state.isNewUser,
      }),
    }
  )
);

export default useAuthStore;
