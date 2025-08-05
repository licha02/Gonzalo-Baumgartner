module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'local',
      providerOptions: {
        sizeLimit: 100000000, // 100MB
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      },
      formats: ['thumbnail', 'small', 'medium', 'large'],
    },
  },
});