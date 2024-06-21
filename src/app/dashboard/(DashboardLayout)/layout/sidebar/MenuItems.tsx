import { IconLayoutDashboard } from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Dashboard',
  },

  {
    id: uniqueId(),
    title: 'Home',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },

  {
    id: uniqueId(),
    title: 'Users',
    icon: IconLayoutDashboard,
    href: '/dashboard/users',
  },

  {
    id: uniqueId(),
    title: 'Roles',
    icon: IconLayoutDashboard,
    href: '/dashboard/roles',
  },

  {
    id: uniqueId(),
    title: 'Products',
    icon: IconLayoutDashboard,
    href: '/dashboard/products',
  },

  {
    id: uniqueId(),
    title: 'Transactions',
    icon: IconLayoutDashboard,
    href: '/dashboard/transactions',
  },
];

export default Menuitems;
