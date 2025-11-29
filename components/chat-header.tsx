"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useWindowSize } from "usehooks-ts";
import { Heart } from "lucide-react";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";
import { LanguageSelector, RoleSelector, VoiceOutputToggle, useHealthPlatform } from "@/components/health";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  
  const {
    language,
    role,
    voiceOutputEnabled,
    setLanguage,
    setRole,
    setVoiceOutputEnabled,
  } = useHealthPlatform();

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2 border-b">
      <SidebarToggle />

      {/* Health Platform Branding */}
      <div className="flex items-center gap-2 mr-2">
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-pink-500 to-red-500">
          <Heart className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="hidden sm:inline text-sm font-medium">Health Assistant</span>
      </div>

      {(!open || windowWidth < 768) && (
        <Button
          className="h-8 px-2 md:h-fit md:px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="outline"
        >
          <PlusIcon />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}

      {!isReadonly && (
        <VisibilitySelector
          chatId={chatId}
          selectedVisibilityType={selectedVisibilityType}
        />
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Health Platform Controls */}
      <div className="flex items-center gap-1">
        <VoiceOutputToggle
          value={voiceOutputEnabled}
          onChange={setVoiceOutputEnabled}
        />
        <LanguageSelector
          value={language}
          onChange={setLanguage}
          compact
        />
        <RoleSelector
          value={role}
          onChange={setRole}
          language={language}
          compact
        />
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
