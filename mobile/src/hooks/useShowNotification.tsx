import { useToast } from "native-base";

type NotificationType = "success" | "error";

export function useNotification() {
    const toast = useToast();

    const show = (title: string, type: NotificationType) => {
        return toast.show({
            title,
            placement: "top",
            bgColor: type === "error" ? "red.500" : "green.500",
        });
    };

    const showSuccess = (title: string) => {
        return show(title, "success");
    };

    const showError = (title: string) => {
        return show(title, "error");
    };

    return { showSuccess, showError };
}
