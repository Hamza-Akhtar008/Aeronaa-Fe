// Unsplash API integration
import { createApi } from 'unsplash-js';
import { UnsplashSearchResponse } from './types/unsplash';

// Initialize the Unsplash API client with the access key
const createUnsplashApi = () => {
  // For server components, use environment variable directly
  if (typeof window === 'undefined') {
    return createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
      // Use native fetch in Node.js environment
      fetch: fetch,
    });
  }
  
  // For client components, use the public environment variable
  return createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
  });
};

const unsplashApi = createUnsplashApi();

// Function to get random photos from Unsplash
export async function getRandomPhotos(
  query: string,
  count: number = 1
): Promise<string[]> {
  try {
    const result = await unsplashApi.photos.getRandom({
      query,
      count,
    });

    if (result.errors) {
      console.error('Error fetching Unsplash images:', result.errors);
      return [];
    }

    // Extract URLs from the response
    const photos = Array.isArray(result.response)
      ? result.response.map((photo) => photo.urls.regular)
      : [];

    return photos;
  } catch (error) {
    console.error('Error fetching Unsplash images:', error);
    return [];
  }
}

// Function to search for photos
export async function searchPhotos(
  query: string,
  page: number = 1,
  perPage: number = 10
) {
  try {
    const result = await unsplashApi.search.getPhotos({
      query,
      page,
      perPage,
    });

    if (result.errors) {
      console.error('Error searching Unsplash images:', result.errors);
      return { results: [], total: 0 };
    }

    return {
      results: result.response.results.map((photo) => ({
        id: photo.id,
        url: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
        description: photo.description || photo.alt_description,
        user: {
          name: photo.user.name,
          link: photo.user.links.html,
          username: photo.user.username,
        },
        downloadLocation: photo.links.download_location,
      })),
      total: result.response.total,
    };
  } catch (error) {
    console.error('Error searching Unsplash images:', error);
    return { results: [], total: 0 };
  }
}
