import { useStore } from '@/stores/useStore';
import { formatDate, daysUntil, getUrgencyColor, piInsuranceMinimum } from '@/lib/utils';
import { AlertBanner } from '@/components/common/AlertBanner';
import { Building2, Shield, Calendar, MapPin, UserCheck, DollarSign } from 'lucide-react';

export function LicenceTracker() {
  const licence = useStore((s) => s.licence);

  if (!licence) return <p className="text-gray-400">No licence information available.</p>;

  const requiredInsurance = piInsuranceMinimum(licence.repCount);
  const insuranceAdequate = licence.insuranceAmount >= requiredInsurance;
  const licenceDaysLeft = daysUntil(licence.expiresAt);
  const cards = [
    { icon: Building2, label: 'Licence Number', value: licence.licenceNumber, sub: `Granted ${formatDate(licence.grantedAt)}` },
    { icon: Calendar, label: 'Licence Expiry', value: formatDate(licence.expiresAt), sub: `${licenceDaysLeft} days remaining`, color: getUrgencyColor(licenceDaysLeft) },
    { icon: Shield, label: 'PI Insurance', value: `S$${(licence.insuranceAmount / 1000).toFixed(0)}K`, sub: `Expires ${formatDate(licence.insuranceExpiry)}`, color: insuranceAdequate ? 'text-success' : 'text-danger' },
    { icon: UserCheck, label: 'KEO', value: licence.keoName, sub: `Since ${formatDate(licence.keoAppointmentDate)}` },
    { icon: MapPin, label: 'Registered Address', value: licence.registeredAddress, sub: 'Sec 37, Estate Agents Act' },
    { icon: DollarSign, label: 'Representatives', value: `${licence.repCount} persons`, sub: `Min insurance: S$${(requiredInsurance / 1000).toFixed(0)}K (Reg 13)` },
  ];

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Agency Licence</h3>
        <p className="text-sm text-gray-500">Estate Agents Act 2010, Part 3</p>
      </div>

      {!insuranceAdequate && (
        <AlertBanner type="error" message={`PI Insurance below required minimum! Current: S$${(licence.insuranceAmount / 1000).toFixed(0)}K, Required: S$${(requiredInsurance / 1000).toFixed(0)}K for ${licence.repCount} representatives (Reg 13).`} className="mb-4" />
      )}
      {licenceDaysLeft <= 60 && (
        <AlertBanner type="warning" message={`Licence expires in ${licenceDaysLeft} days. Prepare renewal application (fee: S$120 + licence fee based on rep count).`} className="mb-4" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-card-border p-5">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">{card.label}</span>
            </div>
            <p className={`text-lg font-semibold ${card.color ?? ''}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-card-border p-6 mt-6">
        <h4 className="font-medium text-gray-700 mb-4">Insurance Requirements (Reg 13, Estate Agency Work Regulations)</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-2 text-left font-medium text-gray-600">Representatives</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Minimum Cover</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Max Deductible</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Sole proprietor (no reps)', 'S$100,000', 'S$5,000'],
                ['2-10', 'S$200,000', 'S$5,000'],
                ['11-30', 'S$300,000', 'S$5,000'],
                ['31-50', 'S$400,000', 'S$5,000'],
                ['51-500', 'S$600,000', 'S$10,000'],
                ['500+', 'S$1,000,000', 'S$20,000'],
              ].map(([reps, cover, deductible], i) => (
                <tr key={i} className={`border-b border-gray-100 ${licence.repCount <= 10 && i === 1 ? 'bg-blue-50' : licence.repCount <= 30 && i === 2 ? 'bg-blue-50' : licence.repCount <= 50 && i === 3 ? 'bg-blue-50' : ''}`}>
                  <td className="px-4 py-2">{reps}</td>
                  <td className="px-4 py-2 font-medium">{cover}</td>
                  <td className="px-4 py-2">{deductible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
