import { useState, useEffect } from "react";
import { User } from "../types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔥 ALWAYS return a logged-in user (mock/admin)
    const mockUser: User = {
      id: 1,
      name: "Mohit Verma",
      email: "mohit.verma@example.com",
      department: "IT/IAS-C",
      role: "admin",
      profile_image_url: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setLoading(false);
  }, []);

  return { user, loading, error: null };
}
