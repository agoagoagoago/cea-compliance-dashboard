import { AdvertisementTracker } from '@/components/advertisements/AdvertisementTracker';

export function AdvertisementsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Advertisements</h2>
        <p className="text-sm text-gray-500">Code of Ethics Section 12 &amp; Code of Practice Section 4(3)</p>
      </div>
      <AdvertisementTracker />
    </div>
  );
}
