import { useState, useEffect } from "react";
import { authService } from "@/modules/auth/auth.service";
import { User } from "@/types";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsLoading(false);
        return;
      }

      if (authService.isAuthenticated()) {
        try {
          const me = await authService.fetchCurrentUser();
          setUser(me);
        } catch {
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    void init();
  }, []);

  useEffect(() => {
    if (!authService.isAuthenticated()) return;
    const interval = setInterval(async () => {
      try {
        const me = await authService.fetchCurrentUser();
        setUser(me);
      } catch {
        setUser(null);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ email, password });
      const me = await authService.fetchCurrentUser();
      setUser(me);
      return { success: true, data: me };
    } catch (error) {
      return { success: false, error: "Identifiants invalides" };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout
  };
};
