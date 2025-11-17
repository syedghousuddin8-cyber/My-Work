<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

trait ActivationClass
{
    public function is_local(): bool
    {
        return true; // Her zaman local gibi davranır
    }

    public function getDomain(): string
    {
        return 'localhost'; // Domain kontrolünü iptal eder
    }

    public function getSystemAddonCacheKey(string|null $app = 'default'): string
    {
        return 'bypass_activation_key_' . $app;
    }

    public function getAddonsConfig(): array
    {
        // Tüm eklentileri aktif göster
        return [
            'admin_panel' => ["active" => 1],
            'vendor_app' => ["active" => 1],
            'deliveryman_app' => ["active" => 1],
            'react_web' => ["active" => 1],
        ];
    }

    public function getCacheTimeoutByDays(int $days = 3): int
    {
        return 60 * 60 * 24 * $days;
    }

    public function getRequestConfig(string|null $username = null, string|null $purchaseKey = null, string|null $softwareId = null, string|null $softwareType = null): array
    {
        // Her zaman geçerli lisans bilgisi döner
        return [
            "active" => true,
            "username" => $username ?? 'bypass_user',
            "purchase_key" => $purchaseKey ?? 'bypass_key',
            "software_id" => $softwareId ?? 'bypass_software',
            "domain" => $this->getDomain(),
            "software_type" => $softwareType ?? 'product',
        ];
    }

    public function checkActivationCache(string|null $app)
    {
        return true; // Lisans kontrolünü tamamen atla
    }

    public function updateActivationConfig($app, $response): void
    {
        // Dosya yazmayı da atla
        return;
    }
}