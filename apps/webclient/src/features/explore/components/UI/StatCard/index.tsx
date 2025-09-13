import type { StatCardProps } from '../../../types/statCard';
import { statCardStyles } from './styles';

export function StatCard({
  label,
  value,
  className = '',
  variant = 'default',
  icon,
  labelStyle,
  'data-qa-id': dataQaId = 'stat-card',
}: StatCardProps) {
  const variantClassName = statCardStyles.value.variants[variant || 'default'];

  return (
    <div className={`${statCardStyles.container.base} ${className}`} data-qa-id={dataQaId}>
      <div className='flex items-start justify-between w-full gap-2' data-qa-id={`${dataQaId}-header`}>
        <div
          className={`${statCardStyles.label} flex-1 min-w-0`}
          style={labelStyle}
          data-qa-id={`${dataQaId}-label`}
        >
          {label}
        </div>
        {icon && variant !== 'logistics' && (
          <div className='text-[#695DC2] flex-shrink-0' data-qa-id={`${dataQaId}-icon`}>{icon}</div>
        )}
      </div>
      <div
        className={`${variantClassName} ${
          variant === 'logistics' ? 'flex-wrap' : ''
        }`}
        data-qa-id={`${dataQaId}-value-container`}
      >
        {variant === 'logistics' && icon && (
          <div className='text-[#695DC2] flex-shrink-0' data-qa-id={`${dataQaId}-logistics-icon`}>{icon}</div>
        )}
        <div className='min-w-0 flex-1' data-qa-id={`${dataQaId}-value`}>{value}</div>
      </div>
    </div>
  );
}

export default StatCard;
