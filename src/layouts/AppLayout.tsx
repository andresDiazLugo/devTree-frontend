import { Link, Outlet } from "react-router-dom";
import { toast, Toaster } from "sonner";
import NavigationTabs from "../components/NavigationTabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser, updateLinkOrder } from "../api/DevTreeAPI";
import { Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import type { SocialNetwork } from "../types";
import Header from "../components/Header";
interface Props {
    onlyHeader?: boolean
}
export default function AppLayout({ onlyHeader }: Props) {
    const queryClient = useQueryClient()
    const updateLinksOrderMutation = useMutation({
        mutationFn: ({ links }: { links: SocialNetwork[] }) =>
        updateLinkOrder( links),
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Error al actualizar links'
            toast.error(errorMessage, {
                style: {
                    whiteSpace: "pre-line",
                },
            });
        },
        onSuccess: (data) => {
            toast.success(data.message)
            queryClient.invalidateQueries({ queryKey: ['user'] })
        }
    })
    // const nav = useNavigate();
    const { data, isLoading, isError } = useQuery({
        queryFn: getUser,
        queryKey: ['user'],
        retry: 1,
        refetchOnWindowFocus: false,
    })
    
    const [links, setLinks] = useState<SocialNetwork[]>([]);

    useEffect(() => {
        if (data?.links) {
            setLinks(data.links.filter(link => link.enabled));
        }
    }, [data?.links]);

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <Navigate to="/auth/login" replace />
    }

    // const handleLogout = () => {
    //     const token = window.localStorage.getItem("AUTH_TOKEN")
    //     if (token) {
    //         window.localStorage.removeItem("AUTH_TOKEN")
    //         nav("/", { replace: true })
    //     }
    // }
    
  

    return (
        <>
            <Header/>
            <div className={`${onlyHeader ? 'bg-slate-800' : 'bg-gray-100'}  min-h-screen py-10`}>
                {
                    onlyHeader ? 
                    <Outlet /> :

                    <main className="mx-auto max-w-5xl p-10 md:p-0">
                        <NavigationTabs />

                        <div className="flex justify-end">
                            <Link
                                className="font-bold text-right text-slate-800 text-2xl"
                                to={`/${data?.user?.handle}`}
                                target="_blank"
                                rel="noreferrer noopener"
                            >Visitar Mi Perfil: /{data?.user?.handle}</Link>
                        </div>

                        <div className="flex flex-col md:flex-row gap-10 mt-10">
                            <div className="flex-1 ">
                                <Outlet />
                            </div>
                            <div className="w-full md:w-96 bg-slate-800 px-5 py-10 space-y-6">
                                <p className="text-4xl text-white text-center">{data?.user?.handle}</p>
                                <div className="w-full max-h-60 bg-slate-100 flex justify-center items-center">
                                    {
                                        data?.user?.avatar && <img className="w-full object-cover" src={data?.user?.avatar} />
                                    }
                                </div>
                                <p className="text-xl text-white text-center">{data?.user?.description}</p>
                                <DragDropProvider
                                    onDragEnd={(event) => {
                                        setLinks((items) => {
                                        const result = move(items, event).map((items, index) => ({
                                            ...items,
                                            order: index,
                                        }))
                                        updateLinksOrderMutation.mutate({ links: result })
                                        return result
                                        });
                                    }}
                                >
                                    <div className="flex flex-col gap-2">
                                        {links.map((link, index) => (
                                            <SortableLink
                                                key={link.id}
                                                link={link}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </DragDropProvider>
                            </div>
                        </div>
                    </main>
                }
            </div>
            <Toaster position="top-right" />
        </>
    )
}

function SortableLink({ link, index }: { link: SocialNetwork, index: number }) {
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const [element, setElement] = useState<Element | null>(null);

    const { isDragging } = useSortable({
        id: link.id,
        index,
        element,
        handle: handleRef,
    });

    return (
        <div
            ref={setElement}
            className={`flex  items-center gap-3 bg-slate-600 rounded-lg pr-6 ${isDragging ? "opacity-50" : ""
                }`}
        >
            <div className="flex items-center gap-3 p-2 rounded-lg w-full cursor-default">
                <div
                    className="w-12 h-12 bg-cover p-2 bg-white rounded-full"
                    style={{
                        backgroundImage: `url('/social/icon_${link.name}.svg')`,
                    }}
                />

                <div className="flex gap-2">
                    <span className="text-white font-medium">
                        Visita mi:
                    </span>

                    <a
                        className="text-white uppercase font-bold cursor-pointer"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {link.name}
                    </a>
                </div>
            </div>
            <button
                ref={handleRef}
                type="button"
                className="cursor-grab text-white"
            >
                ☰
            </button>
        </div>
    );
}

