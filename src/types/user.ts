export interface UserType{
    email: string
    password: string
    status: string 
}

export interface UserTypeSubmit{
    email: string
    password: string
    status?: string
    photo?: string 
}