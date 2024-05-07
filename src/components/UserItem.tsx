
import { forwardRef } from 'react'

type Props = {
   user: User
}

function UserItem ({user} : Props, ref: any) {

   if (ref) {
      return <p className='text-xl mb-4 ml-2' ref={ref}>{user.display_name}</p>
   }
   
   return (
      <p className='text-xl mb-4 ml-2'>{user.display_name}</p>
   )
   
}

export default forwardRef(UserItem)