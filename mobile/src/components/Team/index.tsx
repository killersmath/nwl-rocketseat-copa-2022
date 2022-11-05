import { HStack } from "native-base";
import CountryFlag from "react-native-country-flag";

import { Input } from "../Input";

interface TeamProps {
    code: string;
    position: "left" | "right";
    points?: number;
    onChangeText: (value: string) => void;
}

export function Team({ code, points, position, onChangeText }: TeamProps) {
    return (
        <HStack alignItems="center">
            {position === "left" && (
                <CountryFlag
                    isoCode={code}
                    size={25}
                    style={{ marginRight: 12 }}
                />
            )}
            <Input
                w={10}
                h={9}
                textAlign="center"
                fontSize="xs"
                keyboardType="numeric"
                defaultValue={points ? String(points) : undefined}
                placeholder="0"
                onChangeText={onChangeText}
                _disabled={{
                    opacity: 100,
                }}
            />

            {position === "right" && (
                <CountryFlag
                    isoCode={code}
                    size={25}
                    style={{ marginLeft: 12 }}
                />
            )}
        </HStack>
    );
}
