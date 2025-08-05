'use strict';

/**
 * contact controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::contact.contact', ({ strapi }) => ({
  async create(ctx) {
    const { data } = await super.create(ctx);
    
    // Send notification email (optional)
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'admin@gonzalobaumgartner.com',
        from: 'noreply@gonzalobaumgartner.com',
        subject: 'Nueva consulta de contratación',
        text: `Nueva consulta de: ${data.attributes.name} (${data.attributes.email})`,
        html: `
          <h2>Nueva consulta de contratación</h2>
          <p><strong>Nombre:</strong> ${data.attributes.name}</p>
          <p><strong>Email:</strong> ${data.attributes.email}</p>
          <p><strong>Teléfono:</strong> ${data.attributes.phone}</p>
          <p><strong>Tipo de evento:</strong> ${data.attributes.eventType}</p>
          <p><strong>Fecha del evento:</strong> ${data.attributes.eventDate}</p>
          <p><strong>Mensaje:</strong> ${data.attributes.message}</p>
        `,
      });
    } catch (err) {
      console.log('Email notification failed:', err);
    }
    
    return { data };
  },
}));