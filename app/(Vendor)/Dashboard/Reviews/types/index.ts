export interface Review {
  id: number
  description:string
  rating:string
  user:User
  updatedAt:Date
  hotel:Hotel
}
