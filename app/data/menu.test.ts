import { buildMenuTags, MenuState } from './menu';
import { Tag } from './tag';

test('builds', () => {
  const tagList: Tag[] = [
    {
      id: '1',
      parentTagID: null,
      name: 'A',
      workspaceID: '1',
      typename: 'Tag',
    },
    {
      id: '2',
      parentTagID: null,
      name: 'B',
      workspaceID: '1',
      typename: 'Tag',
    },
    {
      id: '3',
      parentTagID: '1',
      name: 'C',
      workspaceID: '1',
      typename: 'Tag',
    },
    {
      id: '4',
      parentTagID: '2',
      name: 'D',
      workspaceID: '1',
      typename: 'Tag',
    },
    {
      id: '5',
      parentTagID: '4',
      name: 'E',
      workspaceID: '1',
      typename: 'Tag',
    },
  ];

  const expected = [
    {
      tag: {
        id: '1',
        parentTagID: null,
        name: 'A',
        workspaceID: '1',
        typename: 'Tag',
      },
      children: [
        {
          tag: {
            id: '3',
            parentTagID: '1',
            name: 'C',
            workspaceID: '1',
            typename: 'Tag',
          },
          children: [],
          expanded: false,
        },
      ],
      expanded: true,
    },
    {
      tag: {
        id: '2',
        parentTagID: null,
        name: 'B',
        workspaceID: '1',
        typename: 'Tag',
      },
      children: [
        {
          tag: {
            id: '4',
            parentTagID: '2',
            name: 'D',
            workspaceID: '1',
            typename: 'Tag',
          },
          children: [
            {
              tag: {
                id: '5',
                parentTagID: '4',
                name: 'E',
                workspaceID: '1',
                typename: 'Tag',
              },
              children: [],
              expanded: false,
            },
          ],
          expanded: true,
        },
      ],
      expanded: false,
    },
  ];

  const menu: MenuState = {
    tagIDs: {
      '1': { expanded: true },
      '4': { expanded: true },
    },
  };

  const menuTags = buildMenuTags(tagList, menu);

  expect(menuTags).toEqual(expected);
});
