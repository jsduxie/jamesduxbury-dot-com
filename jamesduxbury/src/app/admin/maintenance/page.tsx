import { AdminPanel } from '@/components/admin/AdminPanel';
import { MaintenancePanel } from '@/components/admin/MaintenancePanel';

export default function MaintenancePage() {
  return (
    <AdminPanel title="blob maintenance">
      <div className="px-4 py-5 sm:px-6">
        <MaintenancePanel />
      </div>
    </AdminPanel>
  );
}
