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
    title: 'Funcoin',
    url: '/admin/funcoin',
    icon: 'billing',
    shortcut: ['f', 'f'],
    isActive: false,
  },
  {
    title: 'Gamification',
    url: '/admin/gamification',
    icon: 'category',
    shortcut: ['g', 'g'],
    isActive: false,
    items: [
      {
        title: 'Overview',
        url: '/admin/gamification',
        icon: 'dashboard',
        isActive: false,
      },
      {
        title: 'Spin Configuration',
        url: '/admin/gamification/spin',
        icon: 'settings',
        isActive: false,
      },
      {
        title: 'Missions',
        url: '/admin/gamification/missions',
        icon: 'brand',
        isActive: false,
      },
      {
        title: 'Challenges',
        url: '/admin/gamification/challenges',
        icon: 'help',
        isActive: false,
      },
      {
        title: 'Badges',
        url: '/admin/gamification/badges',
        icon: 'check',
        isActive: false,
      },
      {
        title: 'Titles',
        url: '/admin/gamification/titles',
        icon: 'book',
        isActive: false,
      },
      {
        title: 'Notifications',
        url: '/admin/gamification/notifications',
        icon: 'chat',
        isActive: false,
      },
    ]
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
  {
    title: 'Funcoin',
    url: '/admin/funcoin',
    icon: 'billing',
    shortcut: ['f', 'f'],
    isActive: false,
  },
  {
    title: 'Gamification',
    url: '/admin/gamification',
    icon: 'category',
    shortcut: ['g', 'g'],
    isActive: false,
    items: [
      {
        title: 'Overview',
        url: '/admin/gamification',
        icon: 'dashboard',
        isActive: false,
      },
      {
        title: 'Spin Configuration',
        url: '/admin/gamification/spin',
        icon: 'settings',
        isActive: false,
      },
      {
        title: 'Missions',
        url: '/admin/gamification/missions',
        icon: 'brand',
        isActive: false,
      },
      {
        title: 'Challenges',
        url: '/admin/gamification/challenges',
        icon: 'help',
        isActive: false,
      },
      {
        title: 'Badges',
        url: '/admin/gamification/badges',
        icon: 'check',
        isActive: false,
      },
      {
        title: 'Titles',
        url: '/admin/gamification/titles',
        icon: 'book',
        isActive: false,
      },
      {
        title: 'Notifications',
        url: '/admin/gamification/notifications',
        icon: 'chat',
        isActive: false,
      },
    ]
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
