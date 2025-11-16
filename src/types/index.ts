export interface User {
  id: string;
  email: string;
  name: string;
  department: string;
  profile_image_url: string;
  role: 'internal' | 'external';
  created_at: string;
  updated_at: string;
}

export interface HeaderConfig {
  logo: string;
  centerText: string;
}

export interface ProfileModalConfig {
  section1: {
    items: string[];
    button: string;
  };
  section2: {
    items: Array<{
      label: string;
      type: 'button' | 'link';
    }>;
  };
}

export interface AppSearchConfig {
  title: string;
  searchPlaceholder: string;
  checkboxLabel: string;
  note: string;
  emptyMessage: string;
  footerButton: string;
}

export interface CreateContentItem {
  id: string;
  label: string;
  description: string;
  icon: string;
  restrictedTo?: 'internal' | 'external';
}

export interface CreateContentConfig {
  title: string;
  items: CreateContentItem[];
  statusUpdateModal: {
    title: string;
    postInPlaceholder: string;
    postButton: string;
    cancelButton: string;
    restrictionMessage: string;
  };
}

export interface AppConfiguration {
  header_config: HeaderConfig;
  profile_modal_config: ProfileModalConfig;
  app_search_config: AppSearchConfig;
  create_content_config: CreateContentConfig;
}

export interface StatusUpdate {
  id: string;
  user_id: string;
  content: string;
  post_in: string;
  created_at: string;
  updated_at: string;
}
