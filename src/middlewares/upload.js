module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url.includes('/upload') && ctx.request.method === 'POST') {
      // Add custom image processing logic here
      console.log('Processing image upload...');
    }
    await next();
  };
};