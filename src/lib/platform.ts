// companiprofilesm/src/lib/platform.ts
// Platform Admin integration for Company Profile Astro frontend

interface FeatureData {
  enabled: boolean;
  config: Record<string, any>;
}

interface SiteConfig {
  brandColor: string;
  phone: string;
  address: string;
  coordinates: { lat: number; lng: number };
  socialLinks: Record<string, string>;
  aiConfig: Record<string, any>;
  paymentMethods: string[];
  expressLevels: string[];
  brandName: string;
}

class PlatformFeatureService {
  private config = {
    apiUrl: import.meta.env.PUBLIC_PLATFORM_API_URL || 'http://localhost:8080/api/v1',
    apiKey: import.meta.env.PUBLIC_PLATFORM_API_KEY || 'portfolio_live_placeholder',
    appCode: import.meta.env.PUBLIC_PLATFORM_APP_CODE || 'portfolio',
    cacheTtl: parseInt(import.meta.env.PUBLIC_PLATFORM_CACHE_TTL || '300', 10),
  };

  private cache = new Map<string, { data: any; timestamp: number }>();

  private getCacheKey(key: string): string {
    return `platform_${this.config.appCode}_${key}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.config.cacheTtl * 1000;
  }

  async getTenantSettings(tenantSlug: string): Promise<SiteConfig> {
    const cacheKey = `tenant_settings_${tenantSlug}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.config.cacheTtl * 1000) {
      return cached.data;
    }

    try {
      // Get tenant settings from platform
      const response = await fetch(
        `${this.config.apiUrl}/api/v1/tenants/${tenantSlug}`,
        {
          headers: {
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn('Failed to fetch tenant settings from platform:', response.status);
        return this.getDefaultConfig();
      }

      const data = await response.json();
      const settings = data.settings || {};

      const config: SiteConfig = {
        brandColor: settings.brand_color || '#3b82f6',
        phone: settings.whatsapp_number || '6288808888880',
        address: settings.address || 'Jl. Sudirman No. 123, Jakarta',
        coordinates: settings.coordinates || { lat: -6.2088, lng: 106.8456 },
        socialLinks: settings.social_links || {
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          twitter: 'https://twitter.com',
        },
        aiConfig: settings.ai_config || {
          provider: 'openai',
          model: 'gpt-4',
          maxTokens: 1000,
        },
        paymentMethods: settings.payment_methods || ['bank_transfer', 'qris', 'dana', 'cod'],
        expressLevels: settings.express_levels || ['regular', 'express', 'instant'],
        brandName: settings.brand_name || 'Company Profile',
      };

      this.cache.set(`tenant_settings_${tenantSlug}`, { data: config, timestamp: Date.now() });
      return config;
    } catch (error) {
      console.error('Failed to fetch tenant settings from platform:', error);
      return this.getDefaultConfig();
    }
  }

  async getEnabledFeatures(tenantId: string): Promise<Record<string, { enabled: boolean; config: Record<string, any> }>> {
    const cacheKey = `features_${tenantId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/v1/features/status?tenant=${tenantId}&app=${this.config.appCode}`,
        {
          headers: {
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) return {};

      const data = await response.json();
      const features = data.features || {};

      this.cache.set(`features_${tenantId}`, { data: features, timestamp: Date.now() });
      return features;
    } catch (error) {
      console.error('Failed to fetch features from platform:', error);
      return {};
    }
  }

  async isEnabled(tenantId: string, featureCode: string): Promise<boolean> {
    const features = await this.getEnabledFeatures(tenantId);
    return features[featureCode]?.enabled ?? false;
  }

  async getConfig(tenantId: string, featureCode: string): Promise<Record<string, any>> {
    const features = await this.getEnabledFeatures(tenantId);
    return features[featureCode]?.config ?? {};
  }

  async getMenus(tenantId: string): Promise<any[]> {
    const cacheKey = `menus_${tenantId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.config.cacheTtl * 1000) {
      return cached.data;
    }

    try {
      const response = await fetch(
        `${this.config.apiUrl}/api/v1/tenants/${tenantId}/menus`,
        {
          headers: {
            'X-API-Key': this.config.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      const menus = data.menus || [];

      this.cache.set(cacheKey, { data: menus, timestamp: Date.now() });
      return menus;
    } catch (error) {
      console.error('Failed to fetch menus from platform:', error);
      return [];
    }
  }

  getDefaultConfig(): SiteConfig {
    return {
      brandColor: '#3b82f6',
      phone: '6288808888880',
      address: 'Jl. Sudirman No. 123, Jakarta',
      coordinates: { lat: -6.2088, lng: 106.8456 },
      socialLinks: {
        instagram: 'https://instagram.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
      },
      aiConfig: {
        provider: 'openai',
        model: 'gpt-4',
        maxTokens: 1000,
      },
      paymentMethods: ['bank_transfer', 'qris', 'dana', 'cod'],
      expressLevels: ['regular', 'express', 'instant'],
      brandName: 'Company Profile',
    };
  }

  async clearCache(tenantSlug?: string): void {
    if (tenantSlug) {
      this.cache.delete(`tenant_settings_${tenantSlug}`);
    }
    this.cache.clear();
  }
}

// Export singleton
const platformFeatureService = new PlatformFeatureService();
export default platformFeatureService;

// Utility functions for Astro components
export async function getTenantSettings(tenantSlug: string) {
  return platformFeatureService.getTenantSettings(tenantSlug);
}

export async function isFeatureEnabled(tenantId: string, featureCode: string): Promise<boolean> {
  const features = await platformFeatureService.getEnabledFeatures(tenantId);
  return features[featureCode]?.enabled ?? false;
}

export async function getFeatureConfig(tenantId: string, featureCode: string) {
  const features = await platformFeatureService.getEnabledFeatures(tenantId);
  return features[featureCode]?.config ?? {};
}

export async function getTenantMenus(tenantId: string) {
  return platformFeatureService.getMenus(tenantId);
}
