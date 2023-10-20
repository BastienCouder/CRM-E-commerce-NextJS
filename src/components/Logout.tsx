"use client";
import { signOut } from "next-auth/react";
import React from "react";

interface AccountMenuProps {
  visible?: boolean;
}

export default function AccountMenu({ visible }: AccountMenuProps) {
  if (visible) {
    return null;
  }

  return <div onClick={() => signOut({ callbackUrl: "/" })}>Sign out</div>;
}
