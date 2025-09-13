import { ButtonGroup, ButtonGroupItem } from '@compass/shared-ui';
import { mapStyles } from './styles';
import type { MapLegendProps } from '../../types/mapLegend';

export function MapLegend({
  'data-qa-id': dataQaId = 'map-legend',
}: MapLegendProps = {}) {
  return (
    <div className={mapStyles.legend.container} data-qa-id={dataQaId}>
      <ButtonGroup size='sm' className={mapStyles.legend.group} data-qa-id={`${dataQaId}-group`}>
        <ButtonGroupItem id='industrial' isSelected={true} data-qa-id={`${dataQaId}-industrial`}>
          <div className={mapStyles.legend.item.wrapper} data-qa-id={`${dataQaId}-industrial-wrapper`}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.industrial,
              )}
              data-qa-id={`${dataQaId}-industrial-dot`}
            ></div>
            <span data-qa-id={`${dataQaId}-industrial-label`}>Industrial Cities</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id='competitors' data-qa-id={`${dataQaId}-competitors`}>
          <div className={mapStyles.legend.item.wrapper} data-qa-id={`${dataQaId}-competitors-wrapper`}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.competitors,
              )}
              data-qa-id={`${dataQaId}-competitors-dot`}
            ></div>
            <span data-qa-id={`${dataQaId}-competitors-label`}>Competitors</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id='suppliers' data-qa-id={`${dataQaId}-suppliers`}>
          <div className={mapStyles.legend.item.wrapper} data-qa-id={`${dataQaId}-suppliers-wrapper`}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.suppliers,
              )}
              data-qa-id={`${dataQaId}-suppliers-dot`}
            ></div>
            <span data-qa-id={`${dataQaId}-suppliers-label`}>Suppliers</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id='consumers' data-qa-id={`${dataQaId}-consumers`}>
          <div className={mapStyles.legend.item.wrapper} data-qa-id={`${dataQaId}-consumers-wrapper`}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.consumers,
              )}
              data-qa-id={`${dataQaId}-consumers-dot`}
            ></div>
            <span data-qa-id={`${dataQaId}-consumers-label`}>Consumers</span>
          </div>
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
}
