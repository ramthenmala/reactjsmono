import {
  Plane,
  LayersThree01,
  Bell04,
  Anchor,
  Scale01,
  Waves,
  Settings01,
  Beaker02,
  Database03,
  MedicalCross,
  Virus,
} from '@untitledui/icons';

// Mega menu configuration for Saudi Industrial Landscape
export const megaMenuConfig = {
  title: 'Saudi Industrial Landscape',
  subtitle: 'Discover all sectors and Regions',
  sections: [
    {
      title: 'Sectors',
      columns: [
        [
          { name: 'Aerospace', icon: Plane, href: '#' },
          { name: 'Building Materials', icon: LayersThree01, href: '#' },
          { name: 'Food Processing', icon: Bell04, href: '#' },
          { name: 'Maritime', icon: Anchor, href: '#' },
          { name: 'Metals', icon: Scale01, href: '#' },
          { name: 'Renewables', icon: Waves, href: '#' },
        ],
        [
          { name: 'Automotive', icon: Settings01, href: '#' },
          { name: 'Chemicals', icon: Beaker02, href: '#' },
          { name: 'Machinery & Equipment', icon: Database03, href: '#' },
          { name: 'Medical Devices', icon: MedicalCross, href: '#' },
          { name: 'Pharma', icon: Virus, href: '#' },
        ],
      ],
    },
    {
      title: 'Regions',
      columns: [
        [
          { name: 'Al-Baha', href: '#' },
          { name: 'Al-Jouf', href: '#' },
          { name: 'Ar-Riyadh', href: '#' },
          { name: 'Aseer', href: '#' },
          { name: 'E. Region', href: '#' },
          { name: 'N. Borders', href: '#' },
        ],
        [
          { name: 'Tabuk', href: '#' },
          { name: 'Jazan', href: '#' },
          { name: 'Makkah', href: '#' },
          { name: 'Madinah', href: '#' },
          { name: 'Najran', href: '#' },
          { name: 'Qassim', href: '#' },
        ],
      ],
    },
  ],
};
