import { IndustrialCitiesService } from '../services/industrialCitiesService';
import { IIndustrialCityModel } from '../types/industrialCity';

export async function fetchIndustrialCityById(
  slug: string,
): Promise<IIndustrialCityModel | null> {
  try {
    const properties = await IndustrialCitiesService.getProperties();
    const foundProperty = properties.find(p => p.slug === slug);

    if (!foundProperty) {
      return null;
    }

    const industrialCity: IIndustrialCityModel = {
      id: foundProperty.id || slug,
      slug: foundProperty.slug,
      name: foundProperty.title,
      title: foundProperty.title,
      description: `Premium industrial plot located in ${foundProperty.city}. Perfect for manufacturing, logistics, and heavy industry operations with excellent infrastructure and connectivity.`,
      banner: foundProperty.image,
      image: foundProperty.image,
      estYear: 2020,
      district: foundProperty.city,
      city: foundProperty.city,
      area: foundProperty.area,
      coordinates: foundProperty.coordinates,
      status: foundProperty.status,
      featured: foundProperty.featured,
      electricity:
        typeof foundProperty.electricity === 'string'
          ? parseFloat(foundProperty.electricity)
          : foundProperty.electricity,
      water:
        typeof foundProperty.water === 'string'
          ? parseFloat(foundProperty.water)
          : foundProperty.water,
      gas:
        typeof foundProperty.gas === 'string'
          ? parseFloat(foundProperty.gas)
          : foundProperty.gas,
      landsAndFactories: {
        totalLand: `${foundProperty.area} m²`,
        developedLand: `${Math.floor(foundProperty.area * 0.6)} m²`,
        undevelopedLand: `${Math.floor(foundProperty.area * 0.4)} m²`,
        occupancyRate: '75%',
        logisticLandPercentage: '25%',
        projectsUnderConstruction: '3',
        numberOfFactories: 15,
        currentWorkforce: '2,500',
      },
      infrastructure: {
        totalElectricityCapacity: `${foundProperty.electricity || 50} MW`,
        totalWaterCapacity: `${foundProperty.water || 5000} m³/day`,
        totalGasCapacity: `${foundProperty.gas || 10} MMSCFD`,
      },
      logisticsServices: {
        dryPort: { name: 'Riyadh Dry Port', distance: '25 km' },
        airport: {
          name: 'King Khalid International Airport',
          distance: '45 km',
        },
        railwayStation: { name: 'Riyadh Railway Station', distance: '30 km' },
        neartestSeaport: { name: 'King Abdulaziz Port', distance: '450 km' },
        nearbyLogisticCenters: ['Logistics Park 1', 'Distribution Center A'],
      },
      industries: [
        { label: 'Manufacturing', quantity: 8 },
        { label: 'Logistics', quantity: 4 },
        { label: 'Food Processing', quantity: 3 },
      ],
      workforceTalent: {
        availabilityOfSkilleLabor: 'High',
        availabilityOfNonSkilleLabor: 'High',
        skilledLaborAvgSalary: 'SAR 4,500/month',
        nonSkilledLaborAvgSalary: 'SAR 2,000/month',
      },
    };

    return industrialCity;
  } catch (error) {
    console.error('Error fetching industrial city:', error);
    return null;
  }
}
