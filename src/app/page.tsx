'use client';

import ChatBox from '@/components/ChatBox';

export default function Home() {
  const placeholders = [
    "Ask anything…",
    "@ to add documents as context"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-4">
      <div className="w-full max-w-2xl">
        {/* Chat Interface */}
        <ChatBox placeholders={placeholders} />
      </div>
    </div>
  );
}