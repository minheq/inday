import React, { useCallback, createContext, useContext, Fragment } from 'react';
import { StyleSheet } from 'react-native';

import { ScreenName, ScreenProps, useNavigation } from '../routes';
import {
  useGetSpace,
  useGetView,
  useGetSpaceCollections,
  useGetRecordPrimaryFieldValue,
  useGetRecord,
} from '../data/store';
import { Slide } from '../components/slide';
import { OrganizeMenu } from '../core/organize_menu';
import { ViewsMenu } from '../core/views_menu';
import { AutoSizer } from '../lib/autosizer';
import { View, ViewID } from '../data/views';
import { ListViewDisplay } from '../core/list_view_display';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { Record, RecordID } from '../data/records';
import { Collection, CollectionID } from '../data/collections';
import { getViewIcon, getViewIconColor } from '../core/icon_helpers';
import { Space, SpaceID } from '../data/spaces';
import { useTheme } from '../components/theme';
import { Screen } from '../components/screen';
import { Container } from '../components/container';
import { Row } from '../components/row';
import { BackButton } from '../components/back_button';
import { Text } from '../components/text';
import { IconButton } from '../components/icon_button';
import { FlatButton } from '../components/flat_button';
import { Button } from '../components/button';
import { Icon } from '../components/icon';
import { tokens } from '../components/tokens';
import { isEmpty } from '../../lib/lang_utils';
import { Field, FieldValue, stringifyFieldValue } from '../data/fields';

interface SpaceScreenContext {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

const SpaceScreenContext = createContext<SpaceScreenContext>({
  spaceID: Space.generateID(),
  viewID: View.generateID(),
  collectionID: Collection.generateID(),
});

export function SpaceScreen(props: ScreenProps<ScreenName.Space>): JSX.Element {
  const { params } = props;
  const { spaceID, viewID } = params;
  const view = useGetView(viewID);

  return (
    <SpaceScreenContext.Provider
      value={{ spaceID, viewID, collectionID: view.collectionID }}
    >
      <Screen>
        <SpaceScreenHeader />
        <CollectionsList />
        <ViewSettings />
        <MainContent />
      </Screen>
    </SpaceScreenContext.Provider>
  );
}

type SidePanelState = 'views' | 'organize' | null;

const sidePanelState = atom<SidePanelState>({
  key: 'SpaceScreen_SidePanel',
  default: null,
});

type ModeState = 'edit' | 'select';

const modeState = atom<ModeState>({
  key: 'SpaceScreen_Mode',
  default: 'edit',
});

type SelectedRecordsState = RecordID[];

const selectedRecordsState = atom<SelectedRecordsState>({
  key: 'SpaceScreen_SelectedRecords',
  default: [],
});

type OpenRecordState = RecordID | null;

const openRecordState = atom<OpenRecordState>({
  key: 'SpaceScreen_OpenRecord',
  default: null,
});

function SpaceScreenHeader(): JSX.Element {
  const navigation = useNavigation();
  const context = useContext(SpaceScreenContext);
  const space = useGetSpace(context.spaceID);

  const handlePressBack = useCallback(() => {
    navigation.back();
  }, [navigation]);

  return (
    <Container height={56} paddingHorizontal={8} paddingVertical={4}>
      <Row justifyContent="space-between">
        <Container>
          <Row spacing={8} alignItems="center">
            <BackButton onPress={handlePressBack} />
            <Text size="lg" weight="bold">
              {space.name}
            </Text>
          </Row>
        </Container>
        <Container>
          <TopMenu />
        </Container>
      </Row>
    </Container>
  );
}

function TopMenu() {
  return (
    <Row spacing={4}>
      <IconButton icon="Users" title="Share" />
      <IconButton icon="Bolt" title="Automate" />
      <IconButton icon="Help" title="Help" />
      <IconButton icon="DotsInCircle" title="More" />
    </Row>
  );
}

function ViewSettings() {
  const context = useContext(SpaceScreenContext);
  const view = useGetView(context.viewID);
  const [mode, setMode] = useRecoilState(modeState);
  const [sidePanel, setSidePanel] = useRecoilState(sidePanelState);
  const [, setOpenRecord] = useRecoilState(openRecordState);

  const handleToggleView = useCallback(() => {
    if (sidePanel !== 'views') {
      setSidePanel('views');
    } else {
      setSidePanel(null);
    }

    setMode('edit');
    setOpenRecord(null);
  }, [sidePanel, setSidePanel, setMode, setOpenRecord]);

  return (
    <Container paddingVertical={4} color="content" shadow zIndex={1}>
      <Row justifyContent="space-between">
        <ViewMenuButton view={view} onPress={handleToggleView} />
        {mode === 'edit' ? <ViewMenu /> : <SelectMenu />}
      </Row>
    </Container>
  );
}

function SelectMenu() {
  const [, setMode] = useRecoilState(modeState);
  const [selectedRecords, setSelectedRecords] = useRecoilState(
    selectedRecordsState,
  );
  const [, setOpenRecord] = useRecoilState(openRecordState);

  const handleToggleSelect = useCallback(() => {
    setMode('edit');
    setSelectedRecords([]);
    setOpenRecord(null);
  }, [setMode, setSelectedRecords, setOpenRecord]);

  if (isEmpty(selectedRecords)) {
    return (
      <Row spacing={4} alignItems="center">
        <Text color="muted">Press on records to select</Text>
        <FlatButton onPress={handleToggleSelect} title="Cancel" />
      </Row>
    );
  }

  return (
    <Row spacing={4} alignItems="center">
      <Text weight="bold">{selectedRecords.length} Selected</Text>
      <FlatButton title="Move" />
      <FlatButton title="Copy" />
      <FlatButton title="Delete" color="error" />
      <FlatButton onPress={handleToggleSelect} title="Cancel" />
    </Row>
  );
}

function ViewMenu() {
  const [sidePanel, setSidePanel] = useRecoilState(sidePanelState);
  const [, setMode] = useRecoilState(modeState);

  const handleToggleOrganize = useCallback(() => {
    if (sidePanel !== 'organize') {
      setSidePanel('organize');
    } else {
      setSidePanel(null);
    }
  }, [sidePanel, setSidePanel]);

  const handleToggleSelect = useCallback(() => {
    setMode('select');
  }, [setMode]);

  return (
    <Row spacing={4}>
      <FlatButton title="Search" />
      <FlatButton onPress={handleToggleOrganize} title="Organize" />
      <FlatButton onPress={handleToggleSelect} title="Select" />
      <FlatButton
        weight="bold"
        color="primary"
        icon="Plus"
        title="Add record"
      />
    </Row>
  );
}

interface ViewMenuButtonProps {
  view: View;
  onPress: (viewID: ViewID) => void;
}

function ViewMenuButton(props: ViewMenuButtonProps) {
  const { view, onPress } = props;
  const theme = useTheme();
  const handlePress = useCallback(() => {
    onPress(view.id);
  }, [onPress, view]);

  return (
    <Button onPress={handlePress} style={styles.viewMenuButton}>
      <Row spacing={4}>
        <Icon
          name={getViewIcon(view.type)}
          customColor={getViewIconColor(view.type, theme)}
        />
        <Text>{view.name}</Text>
      </Row>
    </Button>
  );
}

function CollectionsList() {
  const context = useContext(SpaceScreenContext);
  const space = useGetSpace(context.spaceID);
  const view = useGetView(context.viewID);
  const collections = useGetSpaceCollections(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error(
      `Active collection not found. Expected to find collectionID=${view.collectionID} in viewID=${view.id}`,
    );
  }

  return (
    <Container color="content" zIndex={2} borderBottomWidth={1}>
      <Row>
        <Button style={[styles.collectionItem, styles.addCollectionItem]}>
          <Icon name="Plus" color="muted" />
        </Button>
        {collections.map((collection) => (
          <CollectionItem
            active={collection.id === activeCollection.id}
            key={collection.id}
            collection={collection}
            onPress={() => {
              return;
            }}
          />
        ))}
      </Row>
    </Container>
  );
}

interface CollectionItemProps {
  active: boolean;
  collection: Collection;
  onPress: (collectionID: CollectionID) => void;
}

function CollectionItem(props: CollectionItemProps) {
  const { active, collection, onPress } = props;
  const theme = useTheme();

  const handlePress = useCallback(() => {
    onPress(collection.id);
  }, [onPress, collection]);

  return (
    <Button
      onPress={handlePress}
      style={[
        styles.collectionItem,
        active && styles.activeCollectionItem,
        theme === 'dark'
          ? styles.activeCollectionItemDark
          : styles.activeCollectionItemLight,
      ]}
    >
      <Text
        weight={active ? 'bold' : 'normal'}
        color={active ? 'primary' : 'muted'}
      >
        {collection.name}
      </Text>
    </Button>
  );
}

function MainContent() {
  const sidePanel = useRecoilValue(sidePanelState);
  const context = useContext(SpaceScreenContext);
  const { spaceID, viewID, collectionID } = context;
  const space = useGetSpace(spaceID);
  const view = useGetView(viewID);
  const mode = useRecoilValue(modeState);
  const [selectedRecords, setSelectedRecords] = useRecoilState(
    selectedRecordsState,
  );
  const [openRecord, setOpenRecord] = useRecoilState(openRecordState);
  const collections = useGetSpaceCollections(space.id);
  const activeCollection = collections.find((c) => c.id === view.collectionID);

  if (activeCollection === undefined) {
    throw new Error('Invalid collection');
  }

  const handleOpenRecord = useCallback(
    (recordID: RecordID) => {
      setOpenRecord(recordID);
    },
    [setOpenRecord],
  );

  const handleSelectRecord = useCallback(
    (recordID: RecordID, selected: boolean) => {
      if (selected === true) {
        setSelectedRecords((prevSelectedRecords) =>
          prevSelectedRecords.concat(recordID),
        );
      } else {
        setSelectedRecords((prevSelectedRecords) =>
          prevSelectedRecords.filter((id) => id !== recordID),
        );
      }
    },
    [setSelectedRecords],
  );

  const renderView = useCallback((): React.ReactNode => {
    switch (view.type) {
      case 'list':
        return (
          <ListViewDisplay
            mode={mode}
            view={view}
            onOpenRecord={handleOpenRecord}
            selectedRecords={selectedRecords}
            onSelectRecord={handleSelectRecord}
          />
        );
      case 'board':
        return null;
    }
  }, [mode, view, handleOpenRecord, selectedRecords, handleSelectRecord]);

  return (
    <Container flex={1} color="content">
      <Row expanded flex={1}>
        <Slide width={240} open={sidePanel === 'views'}>
          <Container width={240} expanded color="content" borderRightWidth={1}>
            {sidePanel === 'views' && (
              <ViewsMenu spaceID={spaceID} viewID={viewID} />
            )}
          </Container>
        </Slide>
        <Container paddingTop={16} color="content" flex={1}>
          {renderView()}
        </Container>
        <Slide
          width={360}
          open={sidePanel === 'organize' || openRecord !== null}
        >
          <Container flex={1} width={360} color="content" borderLeftWidth={1}>
            <AutoSizer>
              {({ height }) => (
                <Container height={height}>
                  {sidePanel === 'organize' && (
                    <OrganizeMenu
                      spaceID={spaceID}
                      viewID={viewID}
                      collectionID={collectionID}
                    />
                  )}
                  {openRecord !== null && (
                    <RecordDetailsContainer recordID={openRecord} />
                  )}
                </Container>
              )}
            </AutoSizer>
          </Container>
        </Slide>
      </Row>
    </Container>
  );
}

interface RecordDetailsContainerProps {
  recordID: RecordID;
}

function RecordDetailsContainer(
  props: RecordDetailsContainerProps,
): JSX.Element {
  const { recordID } = props;
  const record = useGetRecord(recordID);

  return <RecordDetails record={record} />;
}

interface RecordDetailsProps {
  record: Record;
}

function RecordDetails(props: RecordDetailsProps) {
  const { record } = props;
  const [field, value] = useGetRecordPrimaryFieldValue(record.id);

  return (
    <Container>
      <Text>{stringifyFieldValue(field, value)}</Text>
    </Container>
  );
}

interface FieldRendererProps {
  field: Field;
  value: FieldValue;
}

function FieldRenderer(props: FieldRendererProps) {
  return <Text>TODO</Text>;
}

const styles = StyleSheet.create({
  collectionItem: {
    borderTopLeftRadius: tokens.border.radius,
    borderTopRightRadius: tokens.border.radius,
    minWidth: 40,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  addCollectionItem: {
    paddingHorizontal: 8,
  },
  activeCollectionItem: {
    borderBottomWidth: 2,
  },
  activeCollectionItemDark: {
    borderColor: tokens.colors.lightBlue[50],
  },
  activeCollectionItemLight: {
    borderColor: tokens.colors.lightBlue[700],
  },
  viewMenuButton: {
    borderRadius: tokens.border.radius,
    flexDirection: 'row',
    minWidth: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
});
