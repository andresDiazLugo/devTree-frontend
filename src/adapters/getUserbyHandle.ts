import type {  UserHandle } from "../types"

export const adapterLinkActive = (user:UserHandle): UserHandle => {
    return {
        user: {
            ...user.user,
            links: user.user.links.filter((link) => link.enabled)
        }
    }
}