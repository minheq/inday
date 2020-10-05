export const FastListItemTypes = {
  // Spacers create empty space to create illusion that the visible items are scrolled by that amount.
  Spacer: 0,
  Header: 1,
  Footer: 2,
  Section: 3,
  Row: 4,
  SectionFooter: 5,
};

export type FastListItemType = number;

export type FastListItem = {
  type: FastListItemType;
  key: number;
  layoutY: number;
  layoutHeight: number;
  section: number;
  row: number;
};
