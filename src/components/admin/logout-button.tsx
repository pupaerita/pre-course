"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} disabled={busy}>
      {busy ? "กำลังออก…" : "ออกจากระบบ"}
    </Button>
  );
}
