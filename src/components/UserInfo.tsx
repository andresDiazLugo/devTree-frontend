import type {  UserHandle } from "../types";

interface UserInfoProps {
  userData?: UserHandle;
}
export default function UserInfo({ userData }: UserInfoProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-bold text-white">handle: {userData?.user.name}</h2>
      <h2 className="text-2xl font-bold text-white">Nombre: {userData?.user.name}</h2>
      {
       userData?.user.avatar && (
      <div className="p-2 bg-white rounded-lg">
        <img src={userData?.user.avatar} alt={userData?.user.name} className="size-52 object-cover" />
      </div>
       )
      }
      <div className="px-2 max-w-xl">
        <p className="text-lg text-white font-bold">{userData?.user.description}</p>
      </div>
      <div className="flex flex-col gap-4">
        {userData?.user?.links?.map((link) => (
           <div
            className="flex  items-center gap-3 bg-white rounded-lg pr-6}">
            <div className="flex items-center gap-3 p-2 rounded-lg w-full cursor-default">
                <div
                    className="w-12 h-12 bg-cover p-2 bg-white rounded-full"
                    style={{
                        backgroundImage: `url('/social/icon_${link.name}.svg')`,
                    }}
                />

                <div className="flex gap-2">
                    <span className="text-black font-medium">
                        Visita mi:
                    </span>

                    <a
                        className="text-blue-500 hover:text-blue-700 uppercase font-bold cursor-pointer"
                        href={link.url}
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        {link.name}
                    </a>
                </div>
            </div>
        </div>
        ))}
      </div>
    </div>
  )
}