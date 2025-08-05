'use strict';

/**
 * site-setting controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::site-setting.site-setting', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },
}));