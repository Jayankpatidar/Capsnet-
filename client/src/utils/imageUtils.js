import { BASE_URL } from '../api/axios';

const DEFAULT_AVATAR = "/default.png";

/**
 * Get the server base URL (without /api)
 */
const getServerBaseURL = () => {
  // If BASE_URL is absolute (http://...), use it as-is
  if (BASE_URL.startsWith('http')) {
    return BASE_URL.replace('/api', '');
  }
  
  // If BASE_URL is relative (/api), construct absolute URL
  if (BASE_URL === '/api' || BASE_URL.endsWith('/api')) {
    // Use window.location to get the protocol and host
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback
  return window.location.origin;
};

/**
 * Get the correct URL for profile images
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The complete URL for the image
 */
export const getProfileImageURL = (imagePath) => {
  if (!imagePath) return DEFAULT_AVATAR;
  if (typeof imagePath !== 'string') return DEFAULT_AVATAR;
  
  // ✅ If it's an absolute URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // ✅ If it's a relative path starting with /, prepend server base
  if (imagePath.startsWith('/')) {
    return `${getServerBaseURL()}${imagePath}`;
  }
  
  // ✅ If it's a relative path without /, prepend /uploads/
  return `${getServerBaseURL()}/${imagePath}`;
};

/**
 * Get the correct URL for cover images
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The complete URL for the image
 */
export const getCoverImageURL = (imagePath) => {
  if (!imagePath) return DEFAULT_AVATAR;
  if (typeof imagePath !== 'string') return DEFAULT_AVATAR;
  
  // ✅ If it's an absolute URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // ✅ If it's a relative path starting with /, prepend server base
  if (imagePath.startsWith('/')) {
    return `${getServerBaseURL()}${imagePath}`;
  }
  
  // ✅ If it's a relative path without /, prepend /uploads/
  return `${getServerBaseURL()}/${imagePath}`;
};

/**
 * Get the correct URL for any uploaded image
 * @param {string} imagePath - The image path from the database
 * @returns {string} - The complete URL for the image
 */
export const getImageURL = (imagePath) => {
  if (!imagePath) return DEFAULT_AVATAR;
  if (typeof imagePath !== 'string') return DEFAULT_AVATAR;
  
  // ✅ If it's an absolute URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // ✅ If it's a relative path starting with /, prepend server base
  if (imagePath.startsWith('/')) {
    return `${getServerBaseURL()}${imagePath}`;
  }
  
  // ✅ If it's a relative path without /, prepend /uploads/
  return `${getServerBaseURL()}/${imagePath}`;
};
