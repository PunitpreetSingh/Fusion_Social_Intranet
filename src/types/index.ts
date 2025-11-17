// ===============================
// USER & AUTH TYPES
// ===============================

export type UserRole =
  | "internal"
  | "external"
  | "admin"
  | "moderator"
  | "guest";

export interface User {
  id: string | number;
  name: string;
  email: string;
  department?: string;
  role: UserRole;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

// ===============================
// STATUS UPDATE
// ===============================

export interface StatusUpdate {
  id: number;
  user_id: string | number;
  content: string;
  post_in?: string | null;
  mentions?: string[];
  attachments?: string[];
  created_at: string;
}

// Payload for creating status
export interface CreateStatusUpdatePayload {
  authorId: string | number;
  body: string;
  postIn?: string;
  mentions?: string[];
  attachments?: string[];
}

// ===============================
// DOCUMENTS
// ===============================

export type VisibilityType =
  | "place"
  | "hidden"
  | "specific_people"
  | "community"
  | "personal_blog";

export interface DocumentItem {
  id: number;
  user_id: string | number;
  title: string;
  content: string;
  visibility_type: VisibilityType;
  place_name?: string | null;
  tags?: string[];
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentPayload {
  title: string;
  body: string;
  visibility: {
    type: VisibilityType;
    placeName?: string;
  };
  placeName?: string;
  tags?: string[];
  specificPeople?: string[];
  attachments?: string[];
  mentions?: string[];
  createdBy: string | number;
}

// ===============================
// BLOG POSTS
// ===============================

export interface BlogPost {
  id: number;
  user_id: string | number;
  title: string;
  content: string;
  blog_name: string;
  visibility_type: VisibilityType;
  place_name?: string | null;
  tags?: string[];
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostPayload {
  title: string;
  body: string;
  blogFor?: string;
  tags?: string[];
  attachments?: string[];
  authorId: string | number;
  visibility?: {
    type: VisibilityType;
    placeName?: string;
  };
}

// ===============================
// SPACES
// ===============================

export interface Space {
  id: number;
  name: string;
  created_by: string | number;
  parent_place?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateSpacePayload {
  name: string;
  createdBy: string | number;
  description?: string;
  parent_place?: string | null;
}

// ===============================
// SEARCH TYPES
// ===============================

export interface SearchResultUser {
  id: string | number;
  name: string;
  email: string;
  profile_image_url?: string;
}

export interface SearchResultSpace {
  id: number;
  name: string;
  description?: string;
}

// ===============================
// APP-LEVEL CONFIG TYPES
// ===============================

export interface AppSearchConfig {
  title: string;
  searchPlaceholder: string;
  checkboxLabel: string;
  note: string;
  emptyMessage: string;
  footerButton: string;
}

// ===============================
// MODAL CONTEXT
// ===============================

export type ModalType =
  | "menu"
  | "status_update"
  | "document"
  | "blog_post"
  | "space"
  | "search";

export interface ModalState {
  type: ModalType | null;
  props?: any;
}

// ===============================
// GENERIC API RESPONSE TYPES
// ===============================

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
}

export interface ApiResponseError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;
