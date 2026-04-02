"use client";

import { use, useEffect, useState, useRef } from "react";
import { MessageBubble } from "@/components/messaging/MessageBubble";
import { createBrowserSupabaseClient } from "@/lib/supabase";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string; avatarUrl?: string | null };
}

export default function ConversationPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = use(params);

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch initial messages (GET also marks thread as read)
  useEffect(() => {
    async function loadMessages() {
      const res = await fetch(`/api/messages/${profileId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
        // Determine current profile from session user's messages
        if (data.length > 0) {
          // The recipient of others' messages is the current profile
        }
      }
    }
    loadMessages();
  }, [profileId]);

  // Get current profile id from session
  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/auth/session");
      if (res.ok) {
        const data = await res.json();
        if (data?.user?.profileId) {
          setCurrentProfileId(data.user.profileId);
        }
      }
    }
    loadProfile();
  }, []);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!currentProfileId) return;

    // supabase cleanup now handled in setupRealtime()

    async function setupRealtime(): Promise<() => void> {
      let channel: any = null;
      try {
        const tokenRes = await fetch("/api/messages/realtime-token");
        if (!tokenRes.ok) throw new Error("Failed to get realtime token");
        const { token } = await tokenRes.json();

        const supabase = createBrowserSupabaseClient();
        supabase.realtime.setAuth(token);

        channel = supabase
          .channel("messages")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `recipient_id=eq.${currentProfileId}`,
            },
            (payload: any) => {
              const msg = payload.new as Message;
              setMessages((prev) => [...prev, msg]);
            }
          )
          .subscribe();

        return () => {
          if (channel) channel.unsubscribe();
          supabase.removeAllChannels();
        };
      } catch (e) {
        console.error("Realtime setup failed:", e);
        // Fall back to polling
        const intervalId = setInterval(async () => {
          const res = await fetch(`/api/messages/${profileId}`);
          if (res.ok) {
            const data = await res.json();
            setMessages(data);
          }
        }, 10000);
        return () => {
          if (intervalId) clearInterval(intervalId);
        };
      }
    }

    const cleanupPromise = setupRealtime();

    return () => {
      // Fire-and-forget cleanup (sync return for React)
      cleanupPromise.then(cleanupFn => cleanupFn?.());
    };
  }, [currentProfileId, profileId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !currentProfileId) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    // Optimistic update
    const tempMsg: Message = {
      id: `temp-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      senderId: currentProfileId,
      sender: { id: currentProfileId, name: "You" },
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: profileId, content }),
      });

      if (res.ok) {
        const saved = await res.json();
        // Replace optimistic message with actual saved one
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMsg.id ? { ...saved, createdAt: saved.createdAt } : m))
        );
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="mx-auto flex h-[calc(100vh-4rem-56px)] md:h-[calc(100vh-4rem)] max-w-2xl flex-col px-4 py-4">
      <div className="flex-1 overflow-y-auto pb-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-zinc-500">
            No messages yet. Say hello!
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              currentProfileId={currentProfileId ?? ""}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-cyan-500/10 pt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-4 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-[0_0_12px_rgba(34,211,238,0.2)]"
        >
          Send
        </button>
      </form>
    </main>
  );
}
