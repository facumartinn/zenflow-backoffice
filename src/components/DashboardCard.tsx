import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'yellow' | 'green' | 'indigo';
}

export default function DashboardCard({ title, value, icon: Icon, color }: DashboardCardProps) {
  const colors = {
    blue: 'bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400',
    yellow: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400',
    green: 'bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400',
    indigo: 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400',
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm overflow-hidden shadow rounded-lg border border-border">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon 
              className={`h-10 w-10 ${colors[color]} rounded-lg p-2`}
              aria-hidden="true" 
            />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-muted-foreground truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-foreground">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}