import React from "react";
import FireIcon from './fire.svg?react';
import CompareIcon from './compare.svg?react';
import SarIcon from './sar.svg?react';
import FallbackIcon from './fallback.svg?react';
import SubstractIcon from './substract.svg?react';
import UnionIcon from './union.svg?react';
import IntersectIcon from './intersect.svg?react';
import StatsUpSquareIcon from './stats-up-square.svg?react';
import DeliveryTruckIcon from './delivery-truck.svg?react';
import CityIcon from './city.svg?react';
import IndustryIcon from './industry.svg?react';
import CommunityIcon from './community.svg?react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const Icon: React.FC<IconProps> = ({ name, className = '', size, color, strokeWidth }) => {
  const style: React.CSSProperties = {
    width: size || undefined,
    height: size || undefined,
    color: color || undefined,
    strokeWidth: strokeWidth || undefined,
  };

  switch(name) {
    case 'fire': return <FireIcon className={className} style={style} />;
    case 'compare': return <CompareIcon className={className} style={style} />;
    case 'sar': return <SarIcon className={className} style={style} />;
    case 'substract': return <SubstractIcon className={className} style={style} />;
    case 'union': return <UnionIcon className={className} style={style} />;
    case 'intersect': return <IntersectIcon className={className} style={style} />;
    case 'stats-up-square': return <StatsUpSquareIcon className={className} style={style} />;
  case 'delivery-truck': return <DeliveryTruckIcon className={className} style={style} />;
  case 'city': return <CityIcon className={className} style={style} />;
  case 'industry': return <IndustryIcon className={className} style={style} />;
  case 'community': return <CommunityIcon className={className} style={style} />;
    default: 
      return <FallbackIcon className={className} style={style} />;
  }
};

export { Icon };
export default Icon;
