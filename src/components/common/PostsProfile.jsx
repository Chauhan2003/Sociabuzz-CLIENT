import Post from "./Post";

const PostsProfile = ({ posts }) => {
    return (
        <>
            {
                posts && (
                    <div>
                        {posts.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}
                    </div>
                )
            }
        </>
    );
};
export default PostsProfile;