import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import UserProfileInfo from '../components/UserProfileInfo';
import PostCard from '../components/PostCard';
import ProfileModal from '../components/ProfileModal';
import moment from 'moment';
import api, { BASE_URL } from '../api/axios';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { getProfileImageURL, getCoverImageURL, getImageURL } from '../utils/imageUtils';

const Profile = () => {
  const { profileId } = useParams();
  const currentUser = useSelector((state) => state.user.value);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  // --------------------------
  // Fetch Profile + Posts
  // --------------------------
  const fetchUser = async (id) => {
    try {
      const { data } = await api.get(`/user/profiles/${id}`);

      if (data.success) {
        setUser(data.profile);
        setPosts(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to load profile");
      console.error(error);
    }
  };

  // --------------------------
  // Trigger API call
  // --------------------------
  useEffect(() => {
    const idToLoad = profileId || currentUser?._id;
    if (idToLoad) fetchUser(idToLoad);
  }, [profileId, currentUser]);

  if (!user) return <Loading />;

  return (
    <div className="relative h-full p-4 overflow-y-scroll bg-gray-50 md:p-6 mobile-fix">
      <div className="max-w-3xl mx-auto">

        {/* -------------------------- */}
        {/* Profile Card */}
        {/* -------------------------- */}
        <div className="overflow-hidden bg-white shadow rounded-2xl">
          {/* Cover Photo */}
          <div className="h-32 md:h-40 lg:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={getCoverImageURL(user.cover_photo)}
                alt="Cover"
                className="object-cover w-full h-full"
                onError={(e) => (e.target.src = "/default.png")}
              />
            )}
          </div>

          {/* User Info Section */}
          <UserProfileInfo
            user={user}
            profileId={profileId}
            posts={posts}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* -------------------------- */}
        {/* Tabs */}
        {/* -------------------------- */}
        <div className="mt-4 md:mt-6">
          <div className="flex max-w-2xl p-1 mx-auto bg-white shadow rounded-xl">
            {["posts", "media", "experience", "education", "skills"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 md:px-4 py-2 text-sm font-medium rounded-lg cursor-pointer min-h-[44px]
                  ${activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* -------------------------- */}
          {/* Tab: POSTS */}
          {/* -------------------------- */}
          {activeTab === "posts" && (
            <div className="flex flex-col items-center gap-4 mt-4 md:mt-6 md:gap-6">
              {posts.length > 0 ? (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              ) : (
                <p className="mt-4 text-gray-500">No posts yet.</p>
              )}
            </div>
          )}

          {/* -------------------------- */}
          {/* Tab: MEDIA */}
          {/* -------------------------- */}
          {activeTab === "media" && (
            <div className="flex flex-wrap justify-center max-w-6xl gap-2 mt-4 md:mt-6">
              {posts.filter((post) => post.image_urls.length).length === 0 ? (
                <p className="text-gray-500">No media available.</p>
              ) : (
                posts
                  .filter((post) => post.image_urls.length > 0)
                  .map((post) =>
                    post.image_urls.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageURL(image)}
                          alt="Post media"
                          className="object-cover w-32 rounded-lg md:w-48 lg:w-64 aspect-video"
                        />
                        <p className="absolute bottom-0 right-0 p-1 px-3 text-xs text-white duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-xl">
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </div>
                    ))
                  )
              )}
            </div>
          )}

          {/* -------------------------- */}
          {/* Tab: EXPERIENCE */}
          {/* -------------------------- */}
          {activeTab === "experience" && (
            <div className="p-6 mt-4 bg-white shadow md:mt-6 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold">Experience</h3>

              {user.experience?.length > 0 ? (
                user.experience.map((exp, index) => (
                  <div key={index} className="pl-4 mb-4 border-l-4 border-blue-500">
                    <h4 className="font-semibold">{exp.role}</h4>
                    <p className="text-blue-600">{exp.company}</p>
                    <p className="text-sm text-gray-600">
                      {moment(exp.start).format("MMM YYYY")} -{" "}
                      {exp.end ? moment(exp.end).format("MMM YYYY") : "Present"}
                    </p>
                    <p className="mt-2 text-gray-700">{exp.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No experience added yet.</p>
              )}
            </div>
          )}

          {/* -------------------------- */}
          {/* Tab: EDUCATION */}
          {/* -------------------------- */}
          {activeTab === "education" && (
            <div className="p-6 mt-4 bg-white shadow md:mt-6 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold">Education</h3>
              {user.education?.length > 0 ? (
                user.education.map((edu, index) => (
                  <div key={index} className="pl-4 mb-4 border-l-4 border-green-500 relative">
                    <h4 className="font-semibold">{edu.degree} in {edu.field}</h4>
                    <p className="text-green-600">{edu.institution}</p>
                    <p className="text-sm text-gray-600">
                      {edu.start_year} - {edu.end_year || "Present"}
                    </p>
                    <p className="mt-2 text-gray-700">Grade: {edu.grade}</p>
                    {!profileId && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                        <button className="text-red-500 hover:text-red-700">Delete</button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No education added yet.</p>
              )}
            </div>
          )}

          {/* -------------------------- */}
          {/* Tab: SKILLS */}
          {/* -------------------------- */}
          {activeTab === "skills" && (
            <div className="p-6 mt-4 bg-white shadow md:mt-6 rounded-xl">
              <h3 className="mb-4 text-lg font-semibold">Skills & Endorsements</h3>

              {user.skills?.length ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {user.skills.map((skill, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold">{skill.name}</h4>
                      <p className="text-sm text-gray-500">
                        {skill.endorsements?.length || 0} endorsements
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No skills added yet.</p>
              )}
            </div>
          )}

          {/* -------------------------- */}
          {/* Tab: QR CODE */}
          {/* -------------------------- */}
          {activeTab === "qr" && (
            <div className="p-6 mt-4 bg-white shadow md:mt-6 rounded-xl flex justify-center">
              <ProfileQRCode userId={user._id} />
            </div>
          )}
        </div>
      </div>

      {/* -------------------------- */}
      {/* Profile Edit Modal */}
      {/* -------------------------- */}
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  );
};

export default Profile;
