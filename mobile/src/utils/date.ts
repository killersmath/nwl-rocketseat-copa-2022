import dayJs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

export function toPTBRFormat(dateISO: string) {
    return dayJs(dateISO)
        .locale(ptBR)
        .format("DD [de] MMMM [de] YYYY [às] HH:00[h]");
}
