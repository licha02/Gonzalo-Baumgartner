'use strict';

/**
 * timeline-event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::timeline-event.timeline-event', ({ strapi }) => ({
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },
}));