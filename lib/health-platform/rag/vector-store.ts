/**
 * Vector Store - 100% FREE In-Memory Implementation
 * Uses OpenAI embeddings with simple cosine similarity search
 * No external database required!
 */

import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import type { HealthCategory, SupportedLanguage } from "../types";

// Document structure
interface StoredDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    title: string;
    category: HealthCategory;
    language: SupportedLanguage;
    source?: string;
    tags?: string[];
  };
}

// In-memory storage
const documents: Map<string, StoredDocument> = new Map();

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Initialize the vector store
 * Returns the document count (for compatibility)
 */
export async function initializeVectorStore(): Promise<{ count: number }> {
  console.log("✅ In-memory vector store initialized");
  return { count: documents.size };
}

/**
 * Generate embedding using OpenAI
 * Uses text-embedding-3-small (cheapest option)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: text,
  });
  return embedding;
}

/**
 * Generate embeddings for multiple texts (batch - more efficient)
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: texts,
  });
  return embeddings;
}

/**
 * Add a document to the vector store
 */
export async function addDocument(
  id: string,
  content: string,
  metadata: {
    title: string;
    category: HealthCategory;
    language: SupportedLanguage;
    source?: string;
    tags?: string[];
  }
): Promise<void> {
  const embedding = await generateEmbedding(content);
  
  documents.set(id, {
    id,
    content,
    embedding,
    metadata,
  });
}

/**
 * Add multiple documents in batch (more efficient)
 */
export async function addDocuments(
  docs: Array<{
    id: string;
    content: string;
    metadata: {
      title: string;
      category: HealthCategory;
      language: SupportedLanguage;
      source?: string;
      tags?: string[];
    };
  }>
): Promise<void> {
  if (docs.length === 0) return;

  const contents = docs.map((d) => d.content);
  const embeddings = await generateEmbeddings(contents);

  for (let i = 0; i < docs.length; i++) {
    documents.set(docs[i].id, {
      id: docs[i].id,
      content: docs[i].content,
      embedding: embeddings[i],
      metadata: docs[i].metadata,
    });
  }
}

/**
 * Search for similar documents
 */
export async function searchDocuments(
  query: string,
  options?: {
    topK?: number;
    category?: HealthCategory;
    language?: SupportedLanguage;
  }
): Promise<
  Array<{
    id: string;
    content: string;
    score: number;
    metadata: Record<string, unknown>;
  }>
> {
  const queryEmbedding = await generateEmbedding(query);
  const topK = options?.topK || 5;

  // Filter and score documents
  const results: Array<{
    id: string;
    content: string;
    score: number;
    metadata: Record<string, unknown>;
  }> = [];

  for (const doc of documents.values()) {
    // Apply filters
    if (options?.category && doc.metadata.category !== options.category) {
      continue;
    }
    if (options?.language && doc.metadata.language !== options.language) {
      continue;
    }

    // Calculate similarity
    const score = cosineSimilarity(queryEmbedding, doc.embedding);
    
    results.push({
      id: doc.id,
      content: doc.content,
      score,
      metadata: doc.metadata as Record<string, unknown>,
    });
  }

  // Sort by score (descending) and return top K
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Delete a document from the vector store
 */
export async function deleteDocument(id: string): Promise<void> {
  documents.delete(id);
}

/**
 * Get collection stats
 */
export async function getCollectionStats(): Promise<{
  count: number;
  name: string;
}> {
  return {
    count: documents.size,
    name: "health_documents",
  };
}

/**
 * Clear all documents (use with caution!)
 */
export async function clearCollection(): Promise<void> {
  documents.clear();
  console.log("⚠️ Collection cleared");
}

/**
 * Get a document by ID
 */
export async function getDocument(id: string): Promise<StoredDocument | null> {
  return documents.get(id) || null;
}

/**
 * Check if document exists
 */
export async function hasDocument(id: string): Promise<boolean> {
  return documents.has(id);
}
