
import { dev } from "$app/environment";
import PocketBase from "pocketbase";

import { writable } from "svelte/store";

export const pbUrl = dev ? "http://127.0.0.1:8090" : "http://127.0.0.1:8090"

export const pb = new PocketBase(pbUrl)

export const user = writable(pb.authStore.model)

pb.authStore.onChange((auth) => {
  user.set(pb.authStore.model)
})


export function fileUrl(collection: string, recId: string, path: string, thumb: string | null = null) {
  return dev
    ? `${pbUrl}/api/files/${collection}/${path}` + (thumb ? `?thumb=${thumb}` : '')
    : `${pbUrl}/api/files/${collection}/${path}` + (thumb ? `?thumb=${thumb}` : '')
}