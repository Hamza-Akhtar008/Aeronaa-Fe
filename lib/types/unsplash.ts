// Types for Unsplash API responses
export interface UnsplashPhoto {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  user: {
    id: string;
    updated_at: string;
    username: string;
    name: string;
    first_name: string;
    last_name: string | null;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    links: {
      self: string;
      html: string;
      photos: string;
      likes: string;
      portfolio: string;
    };
  };
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export interface PropertyImage {
  name: string;
  url: string;
}

export interface UnsplashImageResult {
  id: string;
  url: string;
  small: string;
  thumb: string;
  description: string | null;
  user: {
    name: string;
    username: string;
    link: string;
  };
  downloadLocation: string;
}

export interface PropertyImages {
  main: UnsplashImageResult;
  gallery: UnsplashImageResult[];
}
