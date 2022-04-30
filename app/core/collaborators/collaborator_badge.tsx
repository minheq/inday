import { useCollaboratorQuery } from "../../store/queries";
import React from "react";
import { View, StyleSheet } from "react-native";

import { CollaboratorID } from "../../../models/collaborators";
import { Avatar } from "../../components/avatar";
import { Text } from "../../components/text";
import { tokens } from "../../components/tokens";

interface CollaboratorBadgeProps {
  collaboratorID: CollaboratorID;
}

export function CollaboratorBadge(props: CollaboratorBadgeProps): JSX.Element {
  const { collaboratorID } = props;
  const collaborator = useCollaboratorQuery(collaboratorID);

  return (
    <View style={styles.base}>
      <View style={styles.avatarWrapper}>
        <Avatar size="sm" name={collaborator.name} />
      </View>
      <Text numberOfLines={1}>{collaborator.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.border.radius,
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
  },
  avatarWrapper: {
    paddingRight: 4,
  },
});
