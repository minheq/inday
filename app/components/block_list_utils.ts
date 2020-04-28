import { PositionedBlock } from './block_card';

export function logTable(positionedBlocks: PositionedBlock[]) {
  console.table(positionedBlocks.map(toInteresting));
}

export function toInteresting(block: PositionedBlock) {
  return {
    id: block.id,
    y: block.y,
    height: block.height,
    index: block.index,
  };
}

export function debugIsValid(positionedBlocks: PositionedBlock[]): boolean {
  let currentY = 0;
  for (let i = 0; i < positionedBlocks.length - 1; i++) {
    const block = positionedBlocks[i];
    currentY = block.y;

    const nextBlock = positionedBlocks[i + 1];
    if (currentY + block.height !== nextBlock.y) {
      console.log(`Expected ${nextBlock.y} to be ${currentY + block.height}`);

      return false;
    }
  }

  return true;
}

export function logIfFaulty(positionedBlocks: PositionedBlock[]) {
  if (debugIsValid(positionedBlocks)) {
    return;
  }

  logTable(positionedBlocks);
}
