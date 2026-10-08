import { useEffect, useState } from "react"
import { social } from "../data"
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLinks, updateLink } from "../api/DevTreeAPI"
export default function LinkTreeView() {
  const queryClient = useQueryClient()
  const [devTreeLinks, setDevTreeLinks] = useState(social);
  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement> | boolean,
    name?: string) => {

    if (typeof e !== "boolean") {
      const { name, value } = e.target;
      const newDevTreeLinks = devTreeLinks.map((e) => (
        e.name === name ?
          { ...e, url: value } :
          e
      ))
      setDevTreeLinks(newDevTreeLinks);
    }
    if (typeof e === "boolean") {
      const newDevTreeLinks = devTreeLinks.map((element) => {
        if (element.name === name) {
          if (isValidUrl(element.url)) {
            return { ...element, enabled: e }
          }
          toast.error("Url no válida");
        }
        return element;

      });
      setDevTreeLinks(newDevTreeLinks);
    }
  }
  const { data } = useQuery({
    queryFn: getLinks,
    queryKey: ['link'],
    retry: 1,
    refetchOnWindowFocus: false,
  })
  const udpateLinkUser = useMutation({
    mutationFn: updateLink,
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
  const { isPending } = udpateLinkUser;
  const onSubmit = () => {
    udpateLinkUser.mutate(devTreeLinks)
  }
  useEffect(() => {
  if (data) {
    const newDevTreeLinks = devTreeLinks.map(element => {
      const findLink = data.find(
        link => link.name === element.name
      );

      if (findLink) {
        return {
          ...element,
          url: findLink.url,
          enabled: findLink.enabled,
          id: findLink.id
        };
      }

      return element;
    });
    setDevTreeLinks(newDevTreeLinks);
  }
}, [data]);
  return (
    <>
      <div className="space-y-5">
        {
          devTreeLinks.map((element, index) => (
            <div key={element?.id ? element.id : index} className="grid grid-cols-1 gap-2">
              <DevTreeInput
                key={index}
                item={element}
                onChangeInput={handleChangeInput}
              />
            </div>
          ))
        }
        <button
          disabled={isPending}
          onClick={onSubmit}
          className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer">
          {isPending ? (
            "Cargando..."
          ) : (
            "Guardar Cambios"
          )}
        </button>
      </div>
    </>
  )
}