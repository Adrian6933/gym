import React, { useEffect, useState } from "react";

export default function OfflineIndicator() {
  const [online, setOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[200] safe-top">
      <div className="bg-amber-500 text-slate-950 text-[12px] font-bold text-center py-2 px-4 animate-slide-down">
        Sin conexión — se guardará al reconectar
      </div>
    </div>
  );
}
