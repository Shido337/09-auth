import type { Metadata } from "next";
import ProfilePageClient from "./ProfilePage";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Your personal NoteHub profile page.",
};

export default function ProfilePage() {
  return <ProfilePageClient />;
}
