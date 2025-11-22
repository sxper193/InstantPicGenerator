import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://ai-polaroid.vercel.app/sitemap.xml', // 假设部署在 Vercel，需要替换为实际域名
  }
}

