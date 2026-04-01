import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Shield, FileCheck, ArrowRightLeft, FolderArchive,
  Scale, AlertOctagon, Users, Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/aml', icon: Shield, label: 'AML / CDD' },
  { to: '/licensing', icon: FileCheck, label: 'Licensing & CPE' },
  { to: '/transactions', icon: ArrowRightLeft, label: 'Transactions' },
  { to: '/documents', icon: FolderArchive, label: 'Documents' },
  { to: '/disputes', icon: Scale, label: 'Disputes' },
  { to: '/disciplinary', icon: AlertOctagon, label: 'Regulatory Events' },
  { to: '/salespersons', icon: Users, label: 'Salespersons' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-white text-lg font-semibold leading-tight">CEA Comply</h1>
            <p className="text-slate-400 text-xs">Estate Agency Dashboard</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-slate-300 hover:bg-sidebar-hover hover:text-white'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 border-t border-white/10">
        <p className="text-slate-500 text-xs">Estate Agents Act 2010</p>
        <p className="text-slate-500 text-xs">Compliance Framework v1.0</p>
      </div>
    </aside>
  );
}
