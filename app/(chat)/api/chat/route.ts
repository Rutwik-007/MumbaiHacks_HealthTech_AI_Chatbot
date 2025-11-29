import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { unstable_cache as cache } from "next/cache";
import type { ResumableStreamContext } from "resumable-stream";
import type { ModelCatalog } from "tokenlens/core";
import { fetchModels } from "tokenlens/fetch";
import { getUsage } from "tokenlens/helpers";
import { auth, type UserType } from "@/app/(auth)/auth";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { myProvider } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { isProductionEnvironment } from "@/lib/constants";
import {
  createStreamId,
  deleteChatById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  updateChatLastContextById,
} from "@/lib/db/queries";
import { ChatSDKError } from "@/lib/errors";
import type { AppUsage } from "@/lib/usage";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";
// Health Platform Tools - Basic
import {
  searchHealthKnowledge,
  detectEmergency,
  getVaccineSchedule,
  assessRiskLevel,
  getHealthSchemeInfo,
  getNearbyFacilities,
} from "@/lib/health-platform";
// Health Platform Tools - Agentic (Phase 6)
import {
  findHealthFacility,
  bookAppointment,
  sendNotification,
  getWeatherHealthAlerts,
  scheduleReminder,
  checkSchemeEligibility,
  applyForScheme,
  getPersonalizedRecommendations,
} from "@/lib/health-platform/ai/tools";

export const maxDuration = 60;

const _globalStreamContext: ResumableStreamContext | null = null;

const getTokenlensCatalog = cache(
  async (): Promise<ModelCatalog | undefined> => {
    try {
      return await fetchModels();
    } catch (err) {
      console.warn("TokenLens: catalog fetch failed", err);
      return;
    }
  },
  ["tokenlens-catalog"],
  { revalidate: 24 * 60 * 60 }
);

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const { id, message, selectedChatModel, selectedVisibilityType, healthLanguage, healthRole } =
      requestBody;

    const session = await auth();
    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const userType: UserType = session.user.type;
    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const chat = await getChatById({ id });
    if (!chat) {
      const title = await generateTitleFromUserMessage({ message });
      await saveChat({
        id,
        userId: session.user.id,
        title,
        visibility: selectedVisibilityType,
      });
    }

    const messagesFromDb = await getMessagesByChatId({ id });
    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);
    const requestHints: RequestHints = { longitude, latitude, city, country };

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    let finalMergedUsage: AppUsage | undefined;

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        const llm = myProvider.languageModel(selectedChatModel);
        console.log("🔥 Using model:", selectedChatModel);
        
        // Determine which tools to enable based on health context
        const isHealthMode = Boolean(healthLanguage && healthRole);

        const result = streamText({
          model: llm,
          system: systemPrompt({ selectedChatModel, requestHints, healthLanguage, healthRole }),
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_activeTools: isHealthMode
            ? [
                "getWeather",
                "createDocument",
                "updateDocument",
                "requestSuggestions",
                // Basic health tools
                "searchHealthKnowledge",
                "detectEmergency",
                "getVaccineSchedule",
                "assessRiskLevel",
                "getHealthSchemeInfo",
                "getNearbyFacilities",
                // Agentic health tools (Phase 6)
                "findHealthFacility",
                "bookAppointment",
                "sendNotification",
                "getWeatherHealthAlerts",
                "scheduleReminder",
                "checkSchemeEligibility",
                "applyForScheme",
                "getPersonalizedRecommendations",
              ]
            : [
                "getWeather",
                "createDocument",
                "updateDocument",
                "requestSuggestions",
              ],
          experimental_transform: smoothStream({ chunking: "word" }),
          tools: {
            getWeather,
            createDocument: createDocument({ session, dataStream }),
            updateDocument: updateDocument({ session, dataStream }),
            requestSuggestions: requestSuggestions({ session, dataStream }),
            // Basic Health Platform Tools
            searchHealthKnowledge,
            detectEmergency,
            getVaccineSchedule,
            assessRiskLevel,
            getHealthSchemeInfo,
            getNearbyFacilities,
            // Agentic Health Tools (Phase 6)
            findHealthFacility,
            bookAppointment,
            sendNotification,
            getWeatherHealthAlerts,
            scheduleReminder,
            checkSchemeEligibility,
            applyForScheme,
            getPersonalizedRecommendations,
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
          onFinish: async ({ usage }) => {
            try {
              const providers = await getTokenlensCatalog();
              const summary = providers
                ? getUsage({
                    modelId: "llama-v3p1-8b-instruct",
                    usage,
                    providers,
                  })
                : undefined;
              finalMergedUsage = { ...usage, ...summary };
              dataStream.write({ type: "data-usage", data: finalMergedUsage });
            } catch (err) {
              console.warn("TokenLens enrichment failed", err);
              finalMergedUsage = usage;
              dataStream.write({ type: "data-usage", data: finalMergedUsage });
            }
          },
        });

        result.consumeStream();
        dataStream.merge(result.toUIMessageStream({ sendReasoning: false }));
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((m) => ({
            id: m.id,
            role: m.role,
            parts: m.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });

        if (finalMergedUsage) {
          await updateChatLastContextById({
            chatId: id,
            context: finalMergedUsage,
          });
        }
      },
    });

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    console.error("Unhandled error in chat API:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Chat ID is required", { status: 400 });
  }

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (!chat) {
      return new Response("Chat not found", { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteChatById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new Response("Failed to delete chat", { status: 500 });
  }
}
