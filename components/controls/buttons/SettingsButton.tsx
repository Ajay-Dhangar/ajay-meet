import React from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import { copyLinkToastConfig, ToastIds } from "shared/toastConfigs";

import { useScreenShare } from "hooks/useScreenShare";
import useWindowDimensions from "hooks/useWindowDimension";

import SettingsIcon from "components/icons/SettingsIcon";
import RenameParticipantModal from "components/modals/RenameParticipantModal";

interface Props {
  onLeave: () => void;
  onRename: (newName: string) => void;
}

export default function SettingsButton({
  onLeave,
  onRename,
}: Props): JSX.Element {
  const { width } = useWindowDimensions();
  const { isLocalScreenShare } = useScreenShare();

  const router = useRouter();
  const toast = useToast();

  const {
    isOpen: isRenameModalOpen,
    onOpen: onRenameModalOpen,
    onClose: onRenameModalClose,
  } = useDisclosure();

  const showCopyInviteLink = (width && width < 930) || false;
  const showLeaveOption = (width && width < 480) || false;

  const shareLink = () => {
    navigator.clipboard.writeText(
      `${window.location.protocol}//${window.location.host}/space/${router.query["id"]}`
    );
    if (!toast.isActive(ToastIds.COPY_LINK_TOAST_ID)) {
      toast(copyLinkToastConfig);
    }
  };

  return (
    <>
      <RenameParticipantModal
        onRename={onRename}
        isOpen={isRenameModalOpen}
        onClose={onRenameModalClose}
      />
      <Box>
        <Menu placement="top">
          <MenuButton
            left="-10px"
            width="60px"
            height="60px"
            as={IconButton}
            aria-label="Options"
            icon={<SettingsIcon />}
            variant="link"
            _hover={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(251, 36, 145, 0.6) 0%, rgba(251, 36, 145, 0) 100%);",
            }}
          />
          <MenuList
            background="#383838"
            border="1px solid #323232"
            color="#CCCCCC"
            padding="5px 10px"
            width="200px"
          >
            {!isLocalScreenShare && (
              <MenuItem onClick={onRenameModalOpen}>Change Name</MenuItem>
            )}
            {showCopyInviteLink && (
              <MenuItem onClick={shareLink}>Copy Invite Link</MenuItem>
            )}
            {showLeaveOption && <MenuItem onClick={onLeave}>Leave</MenuItem>}
          </MenuList>
        </Menu>
      </Box>
    </>
  );
}