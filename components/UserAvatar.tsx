import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface IUserAvatar {
  img: string;
  name: string;
  email?: string;
}

const UserAvatar = ({ img, name, email }: IUserAvatar) => {
  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarImage src={img} />
        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
          {name[0]}
          </AvatarFallback>
      </Avatar>
      <div className="hidden md:flex flex-col items-start">
        <span className="text-base font-medium text-gray-400 hover:text-yellow-500">
          {name}
        </span>
        {email && <span className="text-sm text-gray">{email}</span>}
      </div>
    </>
  )
}

export default UserAvatar