"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import css from "./EditProfilePage.module.css";
import type { User } from "@/types/user";

const EditProfilePage = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { setUser: setStoreUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getMe();
      setUser(data);
      setUsername(data.username);
    };
    fetchUser();
  }, []);

  if (!user) return null;
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updated = await updateMe(username);
    setStoreUser(updated);
    router.push("/profile");
  };
  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        <Image
          src={user.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />
        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {user.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" className={css.cancelButton} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfilePage;
