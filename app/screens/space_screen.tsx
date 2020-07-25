import React from 'react';
import { Screen } from '../components';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useGetSpace } from '../data/api';
import { RootStackParamsMap } from '../linking';

type SpaceScreenParams = RouteProp<RootStackParamsMap, 'Space'>;

export function SpaceScreen() {
  const route = useRoute<SpaceScreenParams>();
  const space = useGetSpace(route.params.spaceID);

  console.log(space, 'space');

  return (
    <Screen>
      <SpaceHeader />
    </Screen>
  );
}

function SpaceHeader() {
  return null;
}

function CollectionsMenu() {}
