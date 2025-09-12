import type { StatCardProps } from '../../../types/statCard';
import { statCardStyles } from './styles';

export function StatCard({
  label,
  value,
  className = '',
  variant = 'default',
  icon,
  labelStyle,
}: StatCardProps) {
  const variantClassName = statCardStyles.value.variants[variant || 'default'];

  return (
    <div className={`${statCardStyles.container.base} ${className}`}>
      <div className='flex items-start justify-between w-full gap-2'>
        <div
          className={`${statCardStyles.label} flex-1 min-w-0`}
          style={labelStyle}
        >
          {label}
        </div>
        {icon && variant !== 'logistics' && (
          <div className='text-[#695DC2] flex-shrink-0'>{icon}</div>
        )}
      </div>
      <div
        className={`${variantClassName} ${
          variant === 'logistics' ? 'flex-wrap' : ''
        }`}
      >
        {variant === 'logistics' && icon && (
          <div className='text-[#695DC2] flex-shrink-0'>{icon}</div>
        )}
        <div className='min-w-0 flex-1'>{value}</div>
      </div>
    </div>
  );
}

export default StatCard;
