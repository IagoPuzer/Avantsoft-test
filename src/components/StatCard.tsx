import React from "react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: ReactNode;
  icon: IconType;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="ml-5 w-0 flex-1">
            <div>
              <div className="text-sm font-medium text-gray-500 truncate">
                {title}
              </div>
              <div className="text-lg font-medium text-gray-900">{value}</div>
              {subtitle && (
                <div className="text-sm text-gray-500">{subtitle}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
