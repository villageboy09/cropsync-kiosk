// Placeholder images for dashboard cards
// Replace these with actual images from your assets

export const dashboardImages = {
  weather: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=400&h=300&fit=crop',
  cropAdvice: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop',
  seeds: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
  shop: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
  market: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&h=300&fit=crop',
  drone: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
};

export const getImageUrl = (key) => {
  return dashboardImages[key] || dashboardImages.weather;
};
