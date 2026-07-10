export const mockBoards = [
  {
    id: 1,
    name: 'FlowZen Board',
    columns: [
      {
        id: 1,
        title: 'To Do',
        position: 1,
        cards: [
          { id: 1, title: 'Set up project structure', position: 1 },
          { id: 2, title: 'Design database schema', position: 2 },
          { id: 3, title: 'Write API endpoints', position: 3 },
        ],
      },
      {
        id: 2,
        title: 'In Progress',
        position: 2,
        cards: [
          { id: 4, title: 'Build board layout', position: 1 },
          { id: 5, title: 'Add drag and drop', position: 2 },
        ],
      },
      {
        id: 3,
        title: 'Done',
        position: 3,
        cards: [
          { id: 6, title: 'Initialize React app', position: 1 },
          { id: 7, title: 'Configure Vite', position: 2 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Sprint 12',
    columns: [
      {
        id: 4,
        title: 'To Do',
        position: 1,
        cards: [
          { id: 8, title: 'Fix login bug', position: 1 },
          { id: 9, title: 'Update dependencies', position: 2 },
        ],
      },
      {
        id: 5,
        title: 'In Progress',
        position: 2,
        cards: [
          { id: 10, title: 'Refactor auth module', position: 1 },
        ],
      },
      {
        id: 6,
        title: 'Done',
        position: 3,
        cards: [
          { id: 11, title: 'Deploy staging', position: 1 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Product Roadmap',
    columns: [
      {
        id: 7,
        title: 'To Do',
        position: 1,
        cards: [
          { id: 12, title: 'Mobile app prototype', position: 1 },
          { id: 13, title: 'Analytics dashboard', position: 2 },
          { id: 14, title: 'Team permissions', position: 3 },
        ],
      },
      {
        id: 8,
        title: 'In Progress',
        position: 2,
        cards: [
          { id: 15, title: 'Notification system', position: 1 },
        ],
      },
      {
        id: 9,
        title: 'Done',
        position: 3,
        cards: [
          { id: 16, title: 'User onboarding flow', position: 1 },
          { id: 17, title: 'Dark mode support', position: 2 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: 'Bug Tracker',
    columns: [
      {
        id: 10,
        title: 'To Do',
        position: 1,
        cards: [
          { id: 18, title: 'Card drag offset on mobile', position: 1 },
        ],
      },
      {
        id: 11,
        title: 'In Progress',
        position: 2,
        cards: [],
      },
      {
        id: 12,
        title: 'Done',
        position: 3,
        cards: [
          { id: 19, title: 'Column scroll overflow', position: 1 },
        ],
      },
    ],
  },
];
