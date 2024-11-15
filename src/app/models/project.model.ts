export interface Project { 
  projectId: string
  title: string
  photoUrl: string
  createdAt: string
  likeCount: number
  userId: string | null
  userName: string | null
  isLikedByCurrentUser: boolean
  userAvatarUrl: string | null
}