export type User = {
    handle: string,
    name: string,
    email: string
    description?: string,
    avatar?: string,
    image_public_id?: string,
    avatarFile?:FileList | null
}

export type RegisterForm = Pick<User, 'handle' | 'name' | 'email'> & {
    password: string,
    password_confirmation: string
}

export type LoginForm = Pick<User, 'email'> & {
    password: string
}
export type ProfileUser = Pick<User, 'handle' | 'description' | 'avatar' | 'avatarFile' | 'image_public_id' | 'name' | 'email'>

export type ProfileForm = {
    user: ProfileUser,
    links: SocialNetwork[]
}

export type SocialNetwork = {
    id: number,
    name: string
    url: string
    enabled: boolean
}

export type UserHandle = {
    user: {
        links: Array<SocialNetwork>,
        handle: string,
        name: string,
        description?: string,
        avatar?: string,
    }
}



export type DevTreeLink = Pick<SocialNetwork, 'name' | 'url' | 'enabled' | 'id'>
