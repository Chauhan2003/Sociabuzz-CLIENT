import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setSuggestedUsers, setUserProfile } from '../../redux/userSlice';

const UserSuggestion = ({ user }) => {
    const [isPending, setIsPending] = useState(false);
    const { suggestedUsers, userProfile, authUser } = useSelector(store => store.user);
    const dispatch = useDispatch();

    const handleFollowUser = async (userId) => {
        setIsPending(true);
        try {
            const res = await axios.post(`http://localhost:8000/api/users/follow/${userId}`);
            toast.success(res.data.message);

            // Update suggested users list
            const updatedSuggestedUsers = suggestedUsers.filter((suggestedUser) => suggestedUser._id !== userId);
            dispatch(setSuggestedUsers(updatedSuggestedUsers));

            // Update userProfile if the followed user is the same as the userProfile user
            if (userProfile && userProfile?.user?._id === userId) {
                const updatedUserProfile = {
                    ...userProfile,
                    user: {
                        ...userProfile?.user,
                        followers: [...userProfile?.user?.followers, authUser?._id]
                    }
                };

                dispatch(setUserProfile(updatedUserProfile));
            }

            // Update authUser's following list
            dispatch(setAuthUser({
                ...authUser,
                following: [...authUser.following, userId]
            }));
        } catch (err) {
            console.log(err);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className='flex items-center justify-between gap-4' key={user._id}>
            <Link to={`/profile/${user.username}`} className='flex gap-2 items-center'>
                <div className='avatar'>
                    <div className='w-10 rounded-full'>
                        <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                </div>
                <div className='flex flex-col'>
                    <span className='font-semibold text-[16px] tracking-tight truncate w-28'>
                        {user.fullName}
                    </span>
                    <span className='text-[13px] -mt-1 text-slate-500'>@{user.username}</span>
                </div>
            </Link>
            <div>
                <button
                    className='btn bg-white text-black w-18 hover:bg-white hover:opacity-90 rounded-full btn-sm'
                    onClick={() => handleFollowUser(user._id)}
                    disabled={isPending}
                >
                    {isPending ? <LoadingSpinner size='sm' /> : "Follow"}
                </button>
            </div>
        </div>
    )
}

export default UserSuggestion
