// types.ts
export interface Signature {
  _id: string;
  image: string;
  color: string;
  timestamp: string;
}

export interface SongSuggestion {
  _id: string;
  title: string;
  artist: string;
  timestamp: string;
}

export type CreateSignatureDTO = Pick<Signature, "image" | "color">;
export type CreateSongSuggestionDTO = Pick<SongSuggestion, "title" | "artist">;
