// Chakra imports
import { Box, ButtonGroup, Editable, EditableInput, EditablePreview, Flex, IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons';
// Custom components
import Card from "components/card/Card.js";

export default function Information(props) {
  const { title, value, onSubmitInfo, setValue, ...rest } = props;

  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");

  const EditableControls = ({ isEditing, onCancel, onEdit }) => {
    return isEditing ? (
      <ButtonGroup size="sm">
        <IconButton icon={<CheckIcon />} onClick={onSubmitInfo} />
        <IconButton icon={<CloseIcon />} onClick={onCancel} />
      </ButtonGroup>
    ) : (
      <Flex>
        <IconButton size="sm" icon={<EditIcon />} onClick={onEdit} />
      </Flex>
    );
  }

  return (
    <Card bg={bg} {...rest}>
      <Box>
        <Text fontWeight='500' color={textColorPrimary} fontSize='sm'>
          {title}
        </Text>
        <Editable
          key={Math.floor((Math.random() * 1000))}
          color={textColorSecondary}
          defaultValue={value}
          fontSize="xl"
          isPreviewFocusable={false}
          submitOnBlur={false}>
          {props => (
            <>
              <EditablePreview />
              <EditableInput onChange={event => setValue(event.target.value)}/>
              <EditableControls {...props} />
            </>
          )}
      </Editable>
      </Box>
    </Card>
  );
}
