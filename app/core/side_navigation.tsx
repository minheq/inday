import React from 'react';
import { Container } from '../components';
import { NavigationMenu } from './navigation_menu';

export function SideNavigation() {
  return (
    <Container expanded width={320} color="tint">
      <NavigationMenu />
    </Container>
  );
}
