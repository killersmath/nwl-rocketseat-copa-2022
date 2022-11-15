import { Avatar, Center, HStack, Text } from "native-base";

export interface ParticipantData {
    id: string;
    user: {
        name: string;
        avatarUrl: string;
    };
}

interface ParticipantsProps {
    participants: ParticipantData[];
    count: number;
}

export function Participants({ participants, count }: ParticipantsProps) {
    return (
        <HStack>
            {participants.map((participantItem) => (
                <Avatar
                    key={participantItem.id}
                    source={{ uri: participantItem.user.avatarUrl }}
                    w={8}
                    h={8}
                    rounded="full"
                    borderWidth={2}
                    marginRight={-3}
                    borderColor="gray.800"
                >
                    {participantItem?.user?.name?.at(0)?.toUpperCase() ?? "Any"}
                </Avatar>
            ))}

            <Center
                w={8}
                h={8}
                bgColor="gray.700"
                rounded="full"
                borderWidth={1}
                borderColor="gray.800"
            >
                <Text color="gray.100" fontSize="xs" fontFamily="medium">
                    {count ? `+${count}` : 0}
                </Text>
            </Center>
        </HStack>
    );
}
