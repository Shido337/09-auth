"use client";

import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import Link from "next/link";
import css from "./ProfilePage.module.css";
import type { User } from "@/types/user";

const ProfilePageClient = () => {
  const { user: storeUser } = useAuthStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMe();
      setUser(data);
    };
    fetchUser();
  }, []);

  const currentUser = user || storeUser;
  if (!currentUser) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={currentUser.avatar || "/default-avatar.png"}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {currentUser.username}</p>
          <p>Email: {currentUser.email}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePageClient;
