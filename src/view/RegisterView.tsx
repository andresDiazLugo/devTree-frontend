import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form'
import ErrorMessage from "../components/ErrorMessage";
import type { RegisterForm } from "../types";
import {isAxiosError} from "axios";
import { toast } from "sonner";
import  api  from "../config/axios";
import { useState } from "react";


export default function RegisterView() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const initialValues = {
    name: '',
    email: '',
    handle: location.state?.handle || '',
    password: '',
    password_confirmation: ''
  }
  const { register, watch, handleSubmit, reset ,formState:{ errors } } = useForm<RegisterForm>( {
    defaultValues: initialValues
  })
  const password = watch("password")

  const handleRegister = async (formData: RegisterForm) =>{
     try {
        if(!loading){
            setLoading(true)
            const response = await api.post('/auth/register', formData)
            if(response.status === 201){
                toast.success(response.data.message)
                navigate('/auth/login', { state: { email: formData.email } })
                reset()
            }
        }
     } catch (error) {
        if (isAxiosError(error) && error.response) {
            toast.error(error.response?.data.message);
        }
     } finally {
        setLoading(false)
     }
  }
  return (
        <>
        <h1 className="text-4xl text-white font-bold">Crear Cuenta</h1>
        <form 
            onSubmit={handleSubmit(handleRegister)}
            className="bg-white px-5 py-10 rounded-lg space-y-10"
        >
            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Tu Nombre"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("name", { required: "El nombre es obligatorio" })}
                />
                {
                    errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>
                }
            </div>
            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                <input
                    id="email"
                    type="email"
                    placeholder="Email de Registro"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"                   
                    {...register("email",
                    { required: "El email es obligatorio",
                     pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "E-mail no válido",
                    },                
                     })}
                />
                {
                    errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>
                }
            </div>
            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
                <input
                    id="handle"
                    type="text"
                    placeholder="Nombre de usuario: sin espacios"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("handle", { required: "El handle es obligatorio" })}
                />
                {
                    errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>
                }
            </div>
            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password de Registro"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("password", 
                        { 
                          required: "La password es obligatorio" ,
                          minLength: {
                            value: 8,
                            message: "La password debe tener al menos 8 caracteres"
                            }
                        }
            )}
                />
                {
                    errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>
                }
            </div>

            <div className="grid grid-cols-1 space-y-3">
                <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Repetir Password"
                    className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                    {...register("password_confirmation", 
                        { required: "La confirmación de la password es obligatoria",
                          validate: (value) => value === password || "Las passwords no coinciden" 
                        })}
                />
                {
                    errors.password_confirmation && <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
                }
            </div>


            <input
                type="submit"
                className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value={loading ? "Cargando..." : "Crear cuenta"}
            />  
        </form>
        <nav className="mt-10">
            <Link
                className="text-center text-white text-lg block"
                to="/auth/login">
                ¿Ya tienes cuenta? Inicia sesión aquí.
            </Link>
        </nav>
    </>
  )
}