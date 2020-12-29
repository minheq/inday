import React, {
  useCallback,
  createContext,
  useContext,
  useMemo,
  memo,
} from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ScreenName, ScreenProps, useNavigation } from '../core/other/routes';
import {
  useGetSpace,
  useGetView,
  useGetSpaceCollections,
  useGetRecordPrimaryFieldValue,
  useGetRecord,
  useGetRecordFieldsEntries,
} from '../data/store';
import { Slide } from '../components/slide';
import { OrganizeView } from '../core/organize/organize_view';
import { ViewsMenu } from '../core/views/views_menu';
import { AutoSizer } from '../lib/autosizer';
import { View as CollectionView, ViewID, ViewType } from '../data/views';
import { ListViewView } from '../core/list_view/list_view_view';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { Record, RecordID } from '../data/records';
import { Collection, CollectionID } from '../data/collections';
import { getViewIcon, getViewIconColor } from '../core/views/icon_helpers';
import { Space, SpaceID } from '../data/spaces';
import { useTheme, useThemeStyles } from '../components/theme';
import { Screen } from '../components/screen';
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
import { CloseButton } from '../components/close_button';
import { Spacer } from '../components/spacer';
import { Column } from '../components/column';
import { RecordFieldValueEdit } from '../core/fields/field_value_input';
import { CollectionsTabs } from '../core/collections/collection_tabs';

interface SpaceScreenContext {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

const VIEWS_MENU_WIDTH = 240;
const RECORD_VIEW_WIDTH = 360;
const ORGANIZE_VIEW_WIDTH = 360;

const SpaceScreenContext = createContext<SpaceScreenContext>({
  spaceID: Space.generateID(),
  viewID: CollectionView.generateID(),
  collectionID: Collection.generateID(),
});

export function SpaceScreen(props: ScreenProps<ScreenName.Space>): JSX.Element {
  const { params } = props;
  const { spaceID, viewID } = params;
  const view = useGetView(viewID);

  const context = useMemo(
    () => ({ spaceID, viewID, collectionID: view.collectionID }),
    [spaceID, viewID, view.collectionID],
  );

  return (
    <SpaceScreenContext.Provider value={context}>
      <Screen>
        <SpaceScreenHeader />
        <CollectionsTabs viewID={viewID} spaceID={spaceID} />
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

const SpaceScreenHeader = memo(function SpaceScreenHeader(): JSX.Element {
  const navigation = useNavigation();
  const context = useContext(SpaceScreenContext);
  const { spaceID } = context;
  const space = useGetSpace(spaceID);

  const handlePressBack = useCallback(() => {
    navigation.back();
  }, [navigation]);

  return (
    <View style={styles.header}>
      <Row justifyContent="space-between">
        <Row spacing={8} alignItems="center">
          <BackButton onPress={handlePressBack} />
          <Text size="lg" weight="bold">
            {space.name}
          </Text>
        </Row>
        <TopMenu />
      </Row>
    </View>
  );
});

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
  const { viewID } = useContext(SpaceScreenContext);
  const view = useGetView(viewID);
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
    <ViewSettingsView
      viewID={view.id}
      name={view.name}
      type={view.type}
      onToggleView={handleToggleView}
      mode={mode}
    />
  );
}

interface ViewSettingsViewProps {
  onToggleView: () => void;
  mode: ModeState;
  viewID: ViewID;
  name: string;
  type: ViewType;
}

const ViewSettingsView = memo(function ViewSettingsView(
  props: ViewSettingsViewProps,
) {
  const { onToggleView, mode, viewID, name, type } = props;
  const themeStyles = useThemeStyles();

  return (
    <View style={[styles.viewSettingsRoot, themeStyles.elevation.level1]}>
      <Row justifyContent="space-between">
        <ViewMenuButton
          viewID={viewID}
          name={name}
          type={type}
          onPress={onToggleView}
        />
        {mode === 'edit' ? <ViewMenu /> : <SelectMenu />}
      </Row>
    </View>
  );
});

function SelectMenu() {
  const [, setMode] = useRecoilState(modeState);
  const [selectedRecords, setSelectedRecords] = useRecoilState(
    selectedRecordsState,
  );

  const handleToggleSelect = useCallback(() => {
    setMode('edit');
    setSelectedRecords([]);
  }, [setMode, setSelectedRecords]);

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
      <Text weight="bold">{`${selectedRecords.length} Selected`}</Text>
      <FlatButton title="Share" />
      <FlatButton title="Copy" />
      <FlatButton title="Delete" color="error" />
      <FlatButton onPress={handleToggleSelect} title="Cancel" />
    </Row>
  );
}

function ViewMenu() {
  const [sidePanel, setSidePanel] = useRecoilState(sidePanelState);
  const [, setMode] = useRecoilState(modeState);
  const [, setOpenRecord] = useRecoilState(openRecordState);

  const handleToggleOrganize = useCallback(() => {
    if (sidePanel !== 'organize') {
      setSidePanel('organize');
    } else {
      setSidePanel(null);
    }

    setOpenRecord(null);
  }, [sidePanel, setSidePanel, setOpenRecord]);

  const handleToggleSelect = useCallback(() => {
    setMode('select');
    setOpenRecord(null);
  }, [setMode, setOpenRecord]);

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
  viewID: ViewID;
  name: string;
  type: ViewType;
  onPress: (viewID: ViewID) => void;
}

function ViewMenuButton(props: ViewMenuButtonProps) {
  const { viewID, type, name, onPress } = props;
  const theme = useTheme();
  const handlePress = useCallback(() => {
    onPress(viewID);
  }, [onPress, viewID]);

  return (
    <Button onPress={handlePress} style={styles.viewMenuButton}>
      <Row spacing={4}>
        <Icon
          name={getViewIcon(type)}
          customColor={getViewIconColor(type, theme.colorScheme)}
        />
        <Text>{name}</Text>
      </Row>
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
  const themeStyles = useThemeStyles();
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
      if (openRecord === recordID) {
        setOpenRecord(null);
        return;
      }

      setOpenRecord(recordID);
    },
    [openRecord, setOpenRecord],
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
          <ListViewView
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
    <View style={styles.mainContentRoot}>
      <Slide width={VIEWS_MENU_WIDTH} visible={sidePanel === 'views'}>
        <View style={styles.leftPanel}>
          {sidePanel === 'views' && (
            <ViewsMenu spaceID={spaceID} viewID={viewID} />
          )}
        </View>
      </Slide>
      <View style={styles.viewContainer}>{renderView()}</View>
      <Slide width={ORGANIZE_VIEW_WIDTH} visible={sidePanel === 'organize'}>
        <View
          style={[
            styles.rightPanel,
            themeStyles.background.content,
            themeStyles.border.default,
          ]}
        >
          <AutoSizer>
            {({ height }) => (
              <View style={{ width: ORGANIZE_VIEW_WIDTH, height }}>
                <ScrollView>
                  <OrganizeView
                    spaceID={spaceID}
                    viewID={viewID}
                    collectionID={collectionID}
                  />
                </ScrollView>
              </View>
            )}
          </AutoSizer>
        </View>
      </Slide>
      <Slide width={RECORD_VIEW_WIDTH} visible={openRecord !== null}>
        <View
          style={[
            styles.rightPanel,
            themeStyles.background.content,
            themeStyles.border.default,
          ]}
        >
          <AutoSizer>
            {({ height }) => (
              <View style={{ width: RECORD_VIEW_WIDTH, height }}>
                {openRecord !== null && (
                  <RecordDetailsContainer recordID={openRecord} />
                )}
              </View>
            )}
          </AutoSizer>
        </View>
      </Slide>
    </View>
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
  const [primaryField, primaryFieldValue] = useGetRecordPrimaryFieldValue(
    record.id,
  );
  const [, setOpenRecord] = useRecoilState(openRecordState);

  const handleClose = useCallback(() => {
    setOpenRecord(null);
  }, [setOpenRecord]);

  return (
    <View style={styles.recordDetailsWrapper}>
      <View style={styles.recordDetailsHeader}>
        <CloseButton onPress={handleClose} />
        <Spacer direction="row" size={16} />
        <Text size="xl">
          {stringifyFieldValue(primaryField, primaryFieldValue)}
        </Text>
      </View>
      <ScrollView>
        <View style={styles.recordDetailsContainer}>
          <RecordDetails record={record} />
        </View>
      </ScrollView>
    </View>
  );
}

interface RecordDetailsProps {
  record: Record;
}

function RecordDetails(props: RecordDetailsProps) {
  const { record } = props;
  const recordFieldsEntries = useGetRecordFieldsEntries(record.id);

  return (
    <View>
      <Spacer size={24} />
      <Column spacing={16}>
        {recordFieldsEntries.map(([field, value]) => (
          <FieldInputRenderer
            record={record}
            key={field.id}
            field={field}
            value={value}
          />
        ))}
      </Column>
    </View>
  );
}

interface FieldInputRendererProps {
  record: Record;
  field: Field;
  value: FieldValue;
}

function FieldInputRenderer(props: FieldInputRendererProps) {
  const { record, field, value } = props;

  return (
    <RecordFieldValueEdit recordID={record.id} field={field} value={value} />
  );
}

const styles = StyleSheet.create({
  mainContentRoot: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 1,
    borderRightWidth: 1,
  },
  viewContainer: {
    paddingTop: 16,
    flex: 1,
  },
  recordDetailsContainer: {
    padding: 8,
  },
  rightPanel: {
    flex: 1,
    borderLeftWidth: 1,
  },
  recordDetailsWrapper: {
    flex: 1,
  },
  recordDetailsHeader: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
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
  header: {
    height: 56,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewSettingsRoot: {
    paddingVertical: 4,
    zIndex: 1,
  },
});
