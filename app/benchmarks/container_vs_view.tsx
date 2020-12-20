import React, { Fragment, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { range } from '../../lib/array_utils';
import { Container } from '../components/container';
import { tokens } from '../components/tokens';

/**
 * Results:
 * View -> 580ms
 * Container -> 680ms
 */

export function BenchmarkContainerVsView(): JSX.Element {
  const [state, setState] = useState('');

  return (
    <View>
      <Button onPress={() => setState('view')} title="View" />
      <Button onPress={() => setState('container')} title="Container" />
      {state === 'container' && (
        <Fragment>
          {range(0, 1000).map((key) => (
            <Container
              key={key}
              width={100}
              height={100}
              color="content"
              borderWidth={1}
              shape="pill"
            />
          ))}
        </Fragment>
      )}
      {state === 'view' && (
        <Fragment>
          {range(0, 1000).map((key) => (
            <View key={key} style={styles.view} />
          ))}
        </Fragment>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    width: 100,
    height: 100,
    backgroundColor: tokens.colors.blue[50],
    borderRadius: 999,
    borderWidth: 1,
  },
});
