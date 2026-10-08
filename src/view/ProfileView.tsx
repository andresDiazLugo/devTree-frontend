import { useForm } from 'react-hook-form'
import ErrorMessage from '../components/ErrorMessage'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import type { ProfileForm, ProfileUser,  } from '../types'
import { updateProfile } from '../api/DevTreeAPI'
import { toast } from "sonner";

export default function ProfileView() {
    const queryClient = useQueryClient()
    const userData: ProfileForm = queryClient.getQueryData(['user'])!
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            handle: userData.user?.handle,
            description: userData.user?.description || '',
            avatarFile: null,
            image_public_id: userData.user?.image_public_id || ''
        }
    })
    console.log("esooo", userData)

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : 'Error updating profile'
            toast.error(errorMessage)
        },
        onSuccess: () => {
            // queryClient.setQueryData(['user'], data?.user)
            toast.success('Profile updated successfully')
            queryClient.invalidateQueries({
                queryKey: ['user']
            })
        }
    })
    const { isPending } = updateProfileMutation;
    const onSubmit = (data: ProfileUser) => { 
       const formData = new FormData();
       formData.append("handle", data.handle)
       formData.append("description", data.description ?? "")

       if(data.avatarFile?.[0]){
        formData.append("avatar", data.avatarFile[0])
       }
       updateProfileMutation.mutate(formData)
    }
    

    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register("handle", { required: "El Nombre de Usuario es obligatorio" })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register("description")}
                />
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="avatar"
                >Imagen:</label>
                <input
                    id="avatar"
                    type="file"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    {...register("avatarFile")}
                />
            </div>

            <button
            disabled={isPending}
            className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer">
           {isPending ? (
                // <div className="flex justify-center scale-[0.3] -my-8">
                // <TruckLoader />
                // </div>
                "Cargando..."
            ) : (
                "Guardar Cambios"
            )}
            </button>
        </form>
    )
}