import { useGetIdentity, useOne } from "@pankod/refine-core";
import { Profile } from "components";

const MyProfile = () => {
  const { data: user } = useGetIdentity();
  const { data, isLoading, isError } = useOne({
    resource: 'users',
    id: user?.userid
  });

  const myProfile = data?.data ?? [];

  if(isLoading) return <div style={{color: "#11142d"}}>loading may take a short time due to free hosting...</div>
  if(isError) return <div style={{color: "#11142d"}}>error</div>
  
  return (
    <Profile 
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
      />
  )
}

export default MyProfile