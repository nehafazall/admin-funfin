import { NavItem } from '@/types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const superAdminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Courses',
    url: '/admin/courses',
    icon: 'class',
    shortcut: ['c', 'c'],
    isActive: false,
  },
  {
    title: 'Admins',
    url: '/admin/admins',
    icon: 'employee',
    shortcut: ['a', 'a'],
    isActive: false,
  },
];

export const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Courses',
    url: '/admin/courses',
    icon: 'class',
    shortcut: ['c', 'c'],
    isActive: false,
  },
];

export const counselorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
];

export const mentorNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: 'dashboard',
    isActive: false,
  },
];

export const userNavItems = (role: string) => {
  if (role === "superadmin") {
    return superAdminNavItems;
  } else if (role === "admin") {
    return adminNavItems;
  } else if (role === "counsilor") {
    return counselorNavItems;
  } else if (role === "mentor") {
    return mentorNavItems;
  } else {
    return [];
  }
};

export const roles = ["admin", "mentor", "counsilor"];
