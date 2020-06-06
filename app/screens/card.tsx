import React from 'react';
import { Screen, Content } from '../components';
import { ScrollView } from 'react-native';
import { Card } from '../data/card';
import { Editor } from '../editor';
import { AppBar } from '../core/app_bar';

interface CardScreenProps {
  card: Card;
}

export function CardScreen(props: CardScreenProps) {
  const { card } = props;

  return (
    <Screen>
      <AppBar />
      <ScrollView>
        <Content>
          <Editor initialValue={card.content} />
        </Content>
      </ScrollView>
    </Screen>
  );
}
