export const appConfig = {
  siteUrl: 'https://alexgl.dev',
  appName: 'Alex Gómez Portfolio',
  ownerName: 'Alex Gómez',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  isBackendEnabled: import.meta.env.VITE_BACKEND_ENABLED === 'true',
  demoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
  contactEmail: 'alexgl.dvp@gmail.com',
  cvLinks: {
    ats: '/Alex_Gomez_CV_ATS.pdf',
    visual: '/Alex_Gomez_CV_Visual.pdf',
  },
}
