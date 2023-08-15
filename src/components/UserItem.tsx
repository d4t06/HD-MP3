import {User} from '../types'

import { forwardRef } from 'react'

type Props = {
   user: User
}

function UserItem ({user} : Props, ref: any) {

   if (ref) {
      return <p className='text-xl mb-4 ml-2' ref={ref}>{user.username}</p>
   }
   
   return (
      <p className='text-xl mb-4 ml-2'>{user.username}</p>
   )
   
}

export default forwardRef(UserItem)