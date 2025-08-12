export interface Game {
  id: number
  name: string
  released: string
  background_image: string
  rating: number
  genres: Array<{
    id: number
    name: string
    slug: string
  }>

  parent_platforms: Array<{
    platform: {
      id: number
      name: string
      slug: string
    }
  }>
}

export interface GameDetails extends Game {
  description_raw: string
  developers: Array<{
    id: number
    name: string
    slug: string
  }>
  publishers: Array<{
    id: number
    name: string
    slug: string
  }>
  platforms: Array<{
    platform: {
      name: string
      slug: string
    }
    requirements: PlatformRequirement
  }>
}
export interface PlatformRequirement {
  minimum: string
  recommended: string
}
