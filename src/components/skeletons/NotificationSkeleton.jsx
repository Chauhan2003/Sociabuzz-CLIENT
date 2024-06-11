const NotificationSkeleton = () => {
    return (
        <div className='flex flex-col gap-2 w-full py-3 px-4'>
            <div className='flex gap-2 items-center'>
                <div className='skeleton w-10 h-10 rounded-full shrink-0'></div>
                <div className='flex flex-1 justify-between'>
                    <div className='flex gap-2 items-center'>
                        <div className='skeleton h-3 w-28 rounded-full'></div>
                        <div className='skeleton h-3 w-16 rounded-full'></div>
                    </div>
                    <div className='skeleton h-7 w-7 rounded-full'></div>
                </div>
            </div>
        </div>
    )
}

export default NotificationSkeleton
