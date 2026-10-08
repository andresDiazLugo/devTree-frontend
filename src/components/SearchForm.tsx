import { useForm } from "react-hook-form"
import slugify from "react-slugify"
import { useMutation } from "@tanstack/react-query"
import ErrorMessage from "./ErrorMessage";
import { searchUserByHandle } from "../api/DevTreeAPI";
import { Link } from "react-router-dom";

export default function SearchForm() {
    const mutation = useMutation({
        mutationFn: searchUserByHandle
    })
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const handle = watch("handle")
    const handleSearch = () => {
        const slug = slugify(handle)
        mutation.mutate(slug)
    }
    return (
        <form
            onSubmit={handleSubmit(handleSearch)}
            className="space-y-5">
            <div className="relative flex items-center  bg-white  px-2">
                <label
                    htmlFor="handle"
                >devtree.com/</label>
                <input
                    type="text"
                    id="handle"
                    className="border-none bg-transparent p-2 focus:ring-0 flex-1"
                    placeholder="elonmusk, zuck, jeffbezos"
                    {...register("handle", {
                        required: "Un Nombre de Usuario es obligatorio",
                    })}
                />

            </div>
            {errors.handle && (
                <ErrorMessage>{errors.handle.message as string}</ErrorMessage>
            )}

            <div className="mt-10">
                { mutation.isPending && <p>Buscando usuario...</p> }
                { mutation.isError && <p className="text-red-500 font-bold">{mutation.error.message}</p> }
                { mutation.isSuccess && <p className="text-cyan-500 font-bold">{mutation.data.message} ir a <Link className="text-cyan-500 underline" to="auth/register" state={{handle: slugify(handle)}}>Registro</Link> </p> }
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Obtener mi DevTree'
            />
        </form>
    )
}