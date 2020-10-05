import { FastListItem, FastListItemTypes } from './fast_list_item';
import { FastListItemRecycler } from './fast_list_recycler';

export type HeaderHeight = number | (() => number);
export type FooterHeight = number | (() => number);
export type SectionHeight = number | ((section: number) => number);
export type RowHeight = number | ((section: number, row?: number) => number);
export type SectionFooterHeight = number | ((section: number) => number);

type FastListComputerProps = {
  headerHeight: HeaderHeight;
  footerHeight: FooterHeight;
  sectionHeight: SectionHeight;
  rowHeight: RowHeight;
  sectionFooterHeight: SectionFooterHeight;
  sections: number[];
  insetTop: number;
  insetBottom: number;
};

export class FastListComputer {
  headerHeight: HeaderHeight;
  footerHeight: FooterHeight;
  sectionHeight: SectionHeight;
  rowHeight: RowHeight;
  sectionFooterHeight: SectionFooterHeight;
  sections: number[];
  insetTop: number;
  insetBottom: number;
  // When true, all rows are equal height
  uniform: boolean;

  constructor({
    headerHeight,
    footerHeight,
    sectionHeight,
    rowHeight,
    sectionFooterHeight,
    sections,
    insetTop,
    insetBottom,
  }: FastListComputerProps) {
    this.headerHeight = headerHeight;
    this.footerHeight = footerHeight;
    this.sectionHeight = sectionHeight;
    this.rowHeight = rowHeight;
    this.sectionFooterHeight = sectionFooterHeight;
    this.sections = sections;
    this.insetTop = insetTop;
    this.insetBottom = insetBottom;
    this.uniform = typeof rowHeight === 'number';
  }

  getHeightForHeader(): number {
    const { headerHeight } = this;
    return typeof headerHeight === 'number' ? headerHeight : headerHeight();
  }

  getHeightForFooter(): number {
    const { footerHeight } = this;
    return typeof footerHeight === 'number' ? footerHeight : footerHeight();
  }

  getHeightForSection(section: number): number {
    const { sectionHeight } = this;
    return typeof sectionHeight === 'number'
      ? sectionHeight
      : sectionHeight(section);
  }

  getHeightForRow(section: number, row?: number): number {
    const { rowHeight } = this;
    return typeof rowHeight === 'number' ? rowHeight : rowHeight(section, row);
  }

  getHeightForSectionFooter(section: number): number {
    const { sectionFooterHeight } = this;
    return typeof sectionFooterHeight === 'number'
      ? sectionFooterHeight
      : sectionFooterHeight(section);
  }

  compute(
    top: number,
    bottom: number,
    prevItems: FastListItem[],
  ): {
    height: number;
    items: FastListItem[];
  } {
    const { sections } = this;

    let height = this.insetTop;
    let spacerHeight = height;
    let items: FastListItem[] = [];

    const recycler = new FastListItemRecycler(prevItems);

    function isVisible(itemHeight: number): boolean {
      const prevHeight = height;
      height += itemHeight;
      if (height < top || prevHeight > bottom) {
        spacerHeight += itemHeight;
        return false;
      } else {
        return true;
      }
    }

    function isBelowVisibility(itemHeight: number): boolean {
      if (height > bottom) {
        spacerHeight += itemHeight;
        return false;
      } else {
        return true;
      }
    }

    function push(item: FastListItem) {
      if (spacerHeight > 0) {
        items.push(
          recycler.get(
            FastListItemTypes.Spacer,
            item.layoutY - spacerHeight,
            spacerHeight,
            item.section,
            item.row,
          ),
        );
        spacerHeight = 0;
      }

      items.push(item);
    }

    let layoutY;

    const headerHeight = this.getHeightForHeader();
    if (headerHeight > 0) {
      layoutY = height;
      if (isVisible(headerHeight)) {
        push(recycler.get(FastListItemTypes.Header, layoutY, headerHeight));
      }
    }

    for (let section = 0; section < sections.length; section++) {
      const rows = sections[section];

      if (rows === 0) {
        continue;
      }

      const sectionHeight = this.getHeightForSection(section);
      layoutY = height;
      height += sectionHeight;

      // Replace previous spacers and sections, so we only render section headers
      // whose children are visible + previous section (required for sticky header animation).
      if (
        section > 1 &&
        items.length > 0 &&
        items[items.length - 1].type === FastListItemTypes.Section
      ) {
        const spacerLayoutHeight = items.reduce((totalHeight, item, i) => {
          if (i !== items.length - 1) {
            return totalHeight + item.layoutHeight;
          }
          return totalHeight;
        }, 0);
        const prevSection = items[items.length - 1];
        const spacer = recycler.get(
          FastListItemTypes.Spacer,
          0,
          spacerLayoutHeight,
          prevSection.section,
          0,
        );

        items = [spacer, prevSection];
      }

      if (isBelowVisibility(sectionHeight)) {
        push(
          recycler.get(
            FastListItemTypes.Section,
            layoutY,
            sectionHeight,
            section,
          ),
        );
      }

      if (this.uniform) {
        const rowHeight = this.getHeightForRow(section);
        for (let row = 0; row < rows; row++) {
          layoutY = height;
          if (isVisible(rowHeight)) {
            push(
              recycler.get(
                FastListItemTypes.Row,
                layoutY,
                rowHeight,
                section,
                row,
              ),
            );
          }
        }
      } else {
        for (let row = 0; row < rows; row++) {
          const rowHeight = this.getHeightForRow(section, row);
          layoutY = height;
          if (isVisible(rowHeight)) {
            push(
              recycler.get(
                FastListItemTypes.Row,
                layoutY,
                rowHeight,
                section,
                row,
              ),
            );
          }
        }
      }

      const sectionFooterHeight = this.getHeightForSectionFooter(section);
      if (sectionFooterHeight > 0) {
        layoutY = height;
        if (isVisible(sectionFooterHeight)) {
          push(
            recycler.get(
              FastListItemTypes.SectionFooter,
              layoutY,
              sectionFooterHeight,
              section,
            ),
          );
        }
      }
    }

    const footerHeight = this.getHeightForFooter();
    if (footerHeight > 0) {
      layoutY = height;
      if (isVisible(footerHeight)) {
        push(recycler.get(FastListItemTypes.Footer, layoutY, footerHeight));
      }
    }

    height += this.insetBottom;
    spacerHeight += this.insetBottom;

    if (spacerHeight > 0) {
      items.push(
        recycler.get(
          FastListItemTypes.Spacer,
          height - spacerHeight,
          spacerHeight,
          sections.length,
        ),
      );
    }

    recycler.fill();

    return {
      height,
      items,
    };
  }

  computeScrollPosition(
    targetSection: number,
    targetRow: number,
  ): {
    scrollTop: number;
    sectionHeight: number;
  } {
    const { sections, insetTop } = this;
    let scrollTop = insetTop + this.getHeightForHeader();
    let section = 0;
    let foundRow = false;

    while (section <= targetSection) {
      const rows = sections[section];
      if (rows === 0) {
        section += 1;
        continue;
      }
      scrollTop += this.getHeightForSection(section);
      if (this.uniform) {
        const uniformHeight = this.getHeightForRow(section);
        if (section === targetSection) {
          scrollTop += uniformHeight * targetRow;
          foundRow = true;
        } else {
          scrollTop += uniformHeight * rows;
        }
      } else {
        for (let row = 0; row < rows; row++) {
          if (
            section < targetSection ||
            (section === targetSection && row < targetRow)
          ) {
            scrollTop += this.getHeightForRow(section, row);
          } else if (section === targetSection && row === targetRow) {
            foundRow = true;
            break;
          }
        }
      }
      if (!foundRow) {
        scrollTop += this.getHeightForSectionFooter(section);
      }
      section += 1;
    }

    return {
      scrollTop,
      sectionHeight: this.getHeightForSection(targetSection),
    };
  }
}

export interface Block {
  batchSize: number;
  blockStart: number;
  blockEnd: number;
}

export function computeBlock(
  containerHeight: number,
  scrollTop: number,
): Block {
  if (containerHeight === 0) {
    return {
      batchSize: 0,
      blockStart: 0,
      blockEnd: 0,
    };
  }
  const batchSize = Math.ceil(containerHeight / 2);
  const blockNumber = Math.ceil(scrollTop / batchSize);
  const blockStart = batchSize * blockNumber;
  const blockEnd = blockStart + batchSize;

  return { batchSize, blockStart, blockEnd };
}
