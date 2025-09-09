import { ButtonGroup, ButtonGroupItem } from '@compass/shared-ui';
import { mapStyles } from './styles';

export function MapLegend() {
  return (
    <div className={mapStyles.legend.container}>
      <ButtonGroup size="sm" className={mapStyles.legend.group}>
        <ButtonGroupItem id="industrial" isSelected={true}>
          <div className={mapStyles.legend.item.wrapper}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.industrial
              )}
            ></div>
            <span>Industrial Cities</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id="competitors">
          <div className={mapStyles.legend.item.wrapper}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.competitors
              )}
            ></div>
            <span>Competitors</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id="suppliers">
          <div className={mapStyles.legend.item.wrapper}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.suppliers
              )}
            ></div>
            <span>Suppliers</span>
          </div>
        </ButtonGroupItem>
        <ButtonGroupItem id="consumers">
          <div className={mapStyles.legend.item.wrapper}>
            <div
              className={mapStyles.legend.item.dot(
                mapStyles.legend.item.colors.consumers
              )}
            ></div>
            <span>Consumers</span>
          </div>
        </ButtonGroupItem>
      </ButtonGroup>
    </div>
  );
}
