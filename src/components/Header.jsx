"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "@/src/lib/firebase/auth.js";
import { addFakeRestaurantsAndReviews } from "@/src/lib/firebase/firestore.js";
import { setCookie, deleteCookie } from "cookies-next";

function useUserSession(initialUser) {
  useEffect(() => {
    return onIdTokenChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        await setCookie("__session", idToken);
      } else {
        await deleteCookie("__session");
      }

      // ✅ REMOVE reload (VERY IMPORTANT)
      // window.location.reload();
    });
  }, [initialUser]);

  return initialUser;
}

export default function Header({ initialUser }) {
  // ✅ DISABLED auto-seeding (keep it manual only)
  /*
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("seeded")) {
        addFakeRestaurantsAndReviews();
        sessionStorage.setItem("seeded", "true");
      }
    }
  }, []);
  */

  const user = useUserSession(initialUser);

  const handleSignOut = (event) => {
    event.preventDefault();
    signOut();
  };

  const handleSignIn = (event) => {
    event.preventDefault();
    signInWithGoogle();
  };

  return (
    <header>
      <Link href="/" className="logo">
        <img src="/friendly-eats.svg" alt="FriendlyEats" />
        Friendly Eats
      </Link>

      {/* ✅ Always render but safely */}
      <div className="profile">
        <p>
          <img
            className="profileImage"
            src={user?.photoURL || "/profile.svg"}
            alt={user?.email || "Guest"}
          />
          {user?.displayName || "Guest User"}
        </p>

        <div className="menu">
          ...
          <ul>
            {/* ✅ FIXED */}
            <li>{user?.displayName || "Guest User"}</li>

            {/* ✅ Still usable manually */}
            <li>
              <a href="#" onClick={addFakeRestaurantsAndReviews}>
                Add sample restaurants
              </a>
            </li>

            <li>
              <a href="#" onClick={handleSignOut}>
                Sign Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
