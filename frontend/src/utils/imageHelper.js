// ✅ Smart image URL — works with Cloudinary URLs and local paths
const BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://apevents-1.onrender.com';

function getImg(image) {
  if (!image) return null;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  return `${BASE_URL}${image}`;
}

export default getImg;
