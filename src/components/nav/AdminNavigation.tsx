import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
export default function AdminNavigation() {
    const nav = useNavigate();
    const queryClient = useQueryClient();
    const handleLogout = () => {
        const token = window.localStorage.getItem("AUTH_TOKEN")
        queryClient.invalidateQueries({ queryKey: ["user"] })
        if (token) {
            window.localStorage.removeItem("AUTH_TOKEN")

            nav("/", { replace: true })
        }
    }
    return (

        <button
            className=" bg-lime-500 p-2 text-slate-800 uppercase font-black text-xs rounded-lg cursor-pointer"
            onClick={handleLogout}
        >
            Cerrar Sesión
        </button>
    )
}