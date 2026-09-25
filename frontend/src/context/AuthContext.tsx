"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

interface AuthContextType {
  user: User;
  users: User[];
  isHost: boolean;
  switchUser: (user: User) => void;
  toggleHostMode: () => void;
}

const DEFAULT_GUEST: User = {
  id: 1,
  name: "Scalar AI",
  email: "scalar.ai@example.com",
  avatar_url: "https://ui-avatars.com/api/?name=Scalar+AI&background=0D8ABC&color=fff&rounded=true&size=200",
  is_host: false,
  is_superhost: false,
  joined_date: "Joined May 2022",
};

const DEFAULT_HOST: User = {
  id: 2,
  name: "Anshuman",
  email: "anshuman@example.com",
  avatar_url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&q=80",
  is_host: true,
  is_superhost: true,
  joined_date: "Superhost · 5 years hosting",
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_GUEST,
  users: [DEFAULT_GUEST, DEFAULT_HOST],
  isHost: false,
  switchUser: () => {},
  toggleHostMode: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(DEFAULT_GUEST);
  const [users, setUsers] = useState<User[]>([DEFAULT_GUEST, DEFAULT_HOST]);

  useEffect(() => {
    // Attempt to load users from backend or localStorage
    const saved = localStorage.getItem("airbnb_active_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const switchUser = (selectedUser: User) => {
    setUser(selectedUser);
    localStorage.setItem("airbnb_active_user", JSON.stringify(selectedUser));
  };

  const toggleHostMode = () => {
    if (user.is_host) {
      switchUser(DEFAULT_GUEST);
    } else {
      switchUser(DEFAULT_HOST);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isHost: user.is_host,
        switchUser,
        toggleHostMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
