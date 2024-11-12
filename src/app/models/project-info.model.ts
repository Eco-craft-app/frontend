export type ProjectInfoPhotos = {
  url: string
  isMain: boolean
}

export interface ProjectInfo { 
  projectId: string
  title: string
  photos: ProjectInfoPhotos[]
  createdAt: string
  likeCount: number
  userId: string
  description: string
}