import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  linkColor: string;
}

export function FeatureCard({
  icon,
  iconColor,
  bgColor,
  borderColor,
  title,
  description,
  linkText,
  linkHref,
  linkColor,
}: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:translate-y-[-5px] duration-300">
      <div className="p-6">
        <div className={cn(`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center mb-4`)}>
          <Icon name={icon} className={cn(`${iconColor} text-xl`)} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Link
          href={linkHref}
          className={cn(`${linkColor} hover:text-opacity-80 font-medium flex items-center`)}
        >
          {linkText} <Icon name="fa-arrow-right" className="ml-2 h-4 w-4" />
        </Link>
      </div>
      <div className={cn(`h-1 w-full ${borderColor}`)}></div>
    </div>
  );
}