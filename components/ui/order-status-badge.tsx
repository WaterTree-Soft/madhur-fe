import {
  Clock,
  CheckCheck,
  Truck,
  PackageCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  wrapper: string;
  iconBg: string;
  iconClass?: string;
  shine?: boolean;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock,
    wrapper:
      "bg-linear-to-r from-amber-400 via-orange-500 to-amber-500 text-white ring-1 ring-amber-300/60 shadow-[0_6px_18px_-6px_rgba(251,146,60,0.65)]",
    iconBg: "bg-white/25 text-white ring-1 ring-white/30",
    iconClass: "status-icon-clock",
    shine: true,
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCheck,
    wrapper:
      "bg-linear-to-r from-sky-500 via-blue-600 to-indigo-600 text-white ring-1 ring-blue-300/60 shadow-[0_6px_18px_-6px_rgba(37,99,235,0.7)]",
    iconBg: "bg-white/25 text-white ring-1 ring-white/30",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    wrapper:
      "bg-linear-to-r from-indigo-500 via-violet-600 to-fuchsia-600 text-white ring-1 ring-violet-300/60 shadow-[0_8px_22px_-6px_rgba(139,92,246,0.75)]",
    iconBg: "bg-white/25 text-white ring-1 ring-white/30",
    iconClass: "status-icon-truck",
    shine: true,
  },
  delivered: {
    label: "Delivered",
    icon: PackageCheck,
    wrapper:
      "bg-linear-to-r from-emerald-500 via-green-600 to-teal-600 text-white ring-1 ring-emerald-300/60 shadow-[0_8px_22px_-6px_rgba(16,185,129,0.7)]",
    iconBg: "bg-white/25 text-white ring-1 ring-white/30",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    wrapper:
      "bg-linear-to-r from-rose-500 via-red-600 to-rose-700 text-white ring-1 ring-rose-300/60 shadow-[0_6px_18px_-6px_rgba(225,29,72,0.65)]",
    iconBg: "bg-white/25 text-white ring-1 ring-white/30",
  },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function OrderStatusBadge({
  status,
  size = "md",
  className,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const sizeStyles = {
    sm: {
      wrapper: "gap-1.5 pl-1 pr-2.5 py-0.5 text-[11px]",
      iconBox: "h-4 w-4",
      icon: "h-2.5 w-2.5",
    },
    md: {
      wrapper: "gap-1.5 pl-1 pr-3 py-1 text-xs",
      iconBox: "h-5 w-5",
      icon: "h-3 w-3",
    },
    lg: {
      wrapper: "gap-2 pl-1.5 pr-4 py-1.5 text-sm",
      iconBox: "h-7 w-7",
      icon: "h-4 w-4",
    },
  }[size];

  return (
    <span
      className={cn(
        "relative inline-flex items-center overflow-hidden rounded-full font-semibold tracking-wide",
        "[text-shadow:0_1px_2px_rgba(0,0,0,0.25)]",
        sizeStyles.wrapper,
        config.wrapper,
        config.shine && "status-shine",
        className
      )}
    >
      <span
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center rounded-full",
          sizeStyles.iconBox,
          config.iconBg
        )}
      >
        <Icon
          className={cn("drop-shadow", sizeStyles.icon, config.iconClass)}
          strokeWidth={2.5}
        />
      </span>
      <span className="relative z-10">{config.label}</span>
    </span>
  );
}
