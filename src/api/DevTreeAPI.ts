import api from "../config/axios"
import { isAxiosError } from "axios"
import type { User, SocialNetwork, DevTreeLink, UserHandle } from "../types"
import { adapterLinkActive } from "../adapters/getUserbyHandle"
export async function getUser() {
     try {
        const { data } = await api<{
            user: User,
            links: SocialNetwork[]
        }>('/user')
       return data
    } catch (error) {
        if( isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
        console.log(error)
    }
}

export async function updateProfile(profileData: FormData) {
    try {
        
        const { data } = await api.put<{
            message: string,
            user: User
        }
        >('/user', profileData)
        return data
    } catch (error) {
        console.error('Error updating profile:', error)
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message);
        }
    }
}

export async function updateLink(links:DevTreeLink[]){
    try {
        const { data } = await api.put("/link",{
          links  
        })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errors = error.response.data.errors
            if (errors && Array.isArray(errors)) {
            throw new Error(
                errors.map((error: any) => error.msg).join(",\n")
            );
            }
        }
        throw error;
    }
}

export async function getLinks(){
     try {
       const { data } = await api<SocialNetwork[]>('/link')
       return data
    } catch (error) {
        if( isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export async function updateLinkOrder(links: SocialNetwork[]) {
    try {
        const { data } = await api.put("/link/order",{
          links 
        })
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errors = error.response.data.errors
            if (errors && Array.isArray(errors)) {
            throw new Error(
                errors.map((error: any) => error.msg).join(",\n")
            );
            }
        }
        throw error;
    }
}

export async function getUserByHandle(handle?: string) {
    try {
        const { data } = await api<UserHandle>(`/user/${handle}`)
        return adapterLinkActive(data)
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            const errors = error.response.data.errors
            if (errors && Array.isArray(errors)) {
            throw new Error(
                errors.map((error: any) => error.msg).join(",\n")
            );
            }
        }
        throw error;
    }
}

export async function searchUserByHandle(handle?: string) {
    try {
        const { data } = await api.post(`/search`, { handle })
        return data
    } catch (error) {
    if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message)
    }
    throw error
    }
}

