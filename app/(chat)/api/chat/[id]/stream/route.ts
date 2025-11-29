import { createUIMessageStream, JsonToSseTransformStream } from "ai";
import { differenceInSeconds } from "date-fns";
import { auth } from "@/app/(auth)/auth";
import {
  getChatById,
  getMessagesByChatId,
} from "@/lib/db/queries";
import type { Chat } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
// TODO: Fix getStreamContext import after route refactoring
// import { getStreamContext } from "../../route";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: chatId } = await params;

  // Stream resumption is not currently supported after route refactoring
  // Return early with no content to indicate streaming is complete
  const resumeRequestedAt = new Date();

  if (!chatId) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  let chat: Chat | null;

  try {
    chat = await getChatById({ id: chatId });
  } catch {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (!chat) {
    return new ChatSDKError("not_found:chat").toResponse();
  }

  if (chat.visibility === "private" && chat.userId !== session.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  // Since resumable streams are not set up, check if we can restore the last message
  const messages = await getMessagesByChatId({ id: chatId });
  const mostRecentMessage = messages.at(-1);

  const emptyDataStream = createUIMessageStream<ChatMessage>({
    // biome-ignore lint/suspicious/noEmptyBlockStatements: "Needs to exist"
    execute: () => {},
  });

  if (!mostRecentMessage) {
    return new Response(
      emptyDataStream.pipeThrough(new JsonToSseTransformStream()),
      { status: 200 }
    );
  }

  if (mostRecentMessage.role !== "assistant") {
    return new Response(
      emptyDataStream.pipeThrough(new JsonToSseTransformStream()),
      { status: 200 }
    );
  }

  const messageCreatedAt = new Date(mostRecentMessage.createdAt);

  if (differenceInSeconds(resumeRequestedAt, messageCreatedAt) > 15) {
    return new Response(
      emptyDataStream.pipeThrough(new JsonToSseTransformStream()),
      { status: 200 }
    );
  }

  const restoredStream = createUIMessageStream<ChatMessage>({
    execute: ({ writer }) => {
      writer.write({
        type: "data-appendMessage",
        data: JSON.stringify(mostRecentMessage),
        transient: true,
      });
    },
  });

  return new Response(
    restoredStream.pipeThrough(new JsonToSseTransformStream()),
    { status: 200 }
  );
}
