import React from 'react';
import { CardList } from '../core/card_list';
import { useGetAllCards } from '../data/atoms';

export function InboxScreen() {
  const cards = useGetAllCards();

  return <CardList cards={cards} />;

  // return (
  //   <Screen>
  //     <Content>
  //       <Text bold size="lg">
  //         Inbox
  //       </Text>
  //       <Spacer size={16} />
  //       <CardList cards={cards} />
  //     </Content>
  //   </Screen>
  // );
}

// function AddCard() {
//   const createCard = useCreateCard();
//   const { onOpen } = useCardList();

//   const handleCreateCard = React.useCallback(async () => {
//     const card = await createCard();

//     onOpen(card.id);
//   }, [createCard, onOpen]);

//   return (
//     <Button onPress={handleCreateCard}>
//       <Text color="primary">+ Add new card</Text>
//     </Button>
//   );
// }
