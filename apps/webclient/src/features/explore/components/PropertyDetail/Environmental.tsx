import { Wind01, ThermometerWarm, Droplets01, Wind02 } from '@untitledui/icons';
import { IEnvironmental } from '../../types/industrialCity';
import { formatValueWithUnit } from '../../utils/propertyDetailUtils';
import StatCard from '../UI/StatCard';

export const Environmental: React.FC<IEnvironmental> = ({
  humidity,
  temperature,
  percipitation,
  polution,
  image,
}) => {
  return (
    <div className='flex flex-col-reverse lg:flex-row gap-4 md:gap-10'>
      <div className='lg:w-7/12 grid grid-cols-1 md:grid-cols-2 gap-4'>
        {humidity && (
          <StatCard
            label={humidity.title}
            value={formatValueWithUnit(humidity.value, humidity.unit)}
            icon={<Wind01 className='size-11' strokeWidth={1} />}
            variant='large'
          />
        )}
        {temperature && (
          <StatCard
            label={temperature.title}
            value={formatValueWithUnit(temperature.value, temperature.unit)}
            icon={<ThermometerWarm className='size-11' strokeWidth={1} />}
            variant='large'
          />
        )}
        {percipitation && (
          <StatCard
            label={percipitation.title}
            value={formatValueWithUnit(percipitation.value, percipitation.unit)}
            icon={<Droplets01 className='size-11' strokeWidth={1} />}
            variant='large'
          />
        )}
        {polution && (
          <StatCard
            label={polution.title}
            value={formatValueWithUnit(polution.value, polution.unit)}
            icon={<Wind02 className='size-11' strokeWidth={1} />}
            variant='large'
          />
        )}
      </div>
      {image && (
        <img src={image} alt='Workforce and Talent' className='lg:w-5/12 h-auto rounded-2xl' />
      )}
    </div>
  );
};
