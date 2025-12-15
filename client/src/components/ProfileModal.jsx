import React, { useState } from 'react'
import { Pencil } from 'lucide-react'
import { useDispatch, useSelector } from "react-redux"
import { updateUser, addExperience, uploadResume, uploadCertificate } from '../features/users/userSlice'
import toast from 'react-hot-toast'
import api from '../api/axios'

const ProfileModal = ({ setShowEdit }) => {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.value);
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        full_name: user.full_name,
        skills: user.skills || [],
        interests: user.interests || [],
        profile: null,
        cover: null,
        resume: null,
        certificate: null,
        certificateTitle: '',
        certificateIssuedBy: '',
        certificateDate: '',
        experience: {
            company: '',
            role: '',
            start: '',
            end: '',
            description: ''
        },
        education: {
            institution: '',
            degree: '',
            field: '',
            start_year: '',
            end_year: '',
            grade: ''
        }
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault()
        try {

            const userData = new FormData()
            const { username, professional_headline, bio, location, full_name, skills, interests, account_type, is_private, profile, cover } = editForm;

            userData.append("username", username);
            userData.append("professional_headline", professional_headline);
            userData.append("bio", bio);
            userData.append("location", location);
            userData.append("full_name", full_name);
            userData.append("skills", skills);
            userData.append("interests", interests);
            userData.append("account_type", account_type);
            userData.append("is_private", is_private);

            if (profile) userData.append("profile", profile);
            if (cover) userData.append("cover", cover);
 
            dispatch(updateUser({ userData }))

            setShowEdit(false)

        } catch (error) {
            toast.error(error.message)
        }
    }


    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 h-screen overflow-y-scroll z-110 bg-black/50 mobile-fix'>
            <div className='max-w-2xl mx-auto sm:py-6 '>
                <div className='p-6 bg-white rounded-lg shadow'>
                    <h1 className='mb-8 text-2xl font-bold text-gray-900'>Edit Profile</h1>
                    <form className='space-y-4 ' onSubmit={e=> toast.promise(
                        handleSaveProfile(e) , {"loading" : "Saving..."}
                    )}>
                        {/* Profile Picture */}
                        <div className='flex flex-col items-start gap-3 '>
                            <label htmlFor="profile"
                                className='block mb-1 text-sm font-medium text-gray-700'>
                                Profile Picture
                            </label>

                            <input type="file" accept='image/*' capture="environment" id='profile' name='profile'
                                className='w-full p-3 border border-gray-200 rounded-lg'
                                onChange={(e) => setEditForm({ ...editForm, profile: e.target.files[0] })} />

                            <div className='relative group/profile'>
                                <img
                                    src={
                                        editForm.profile instanceof File
                                            ? URL.createObjectURL(editForm.profile)
                                            : user.profile_picture
                                                ? `${api.defaults.baseURL}${user.profile_picture}`
                                                : "/default.png"
                                    }
                                    alt="Profile"
                                    className="object-cover w-24 h-24 mt-2 rounded-full"
                                    onError={(e) => (e.target.src = "/default.png")}
                                />

                                <div className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden w-24 rounded-full group-hover/profile:flex bg-black/20'>
                                    <Pencil className='w-5 h-5 text-white' />
                                </div>
                            </div>
                        </div>
                        {/* cover photo */}
                        <div className='flex flex-col items-start gap-3 '>
                            <label htmlFor="cover"
                                className='block mb-1 text-sm font-medium text-gray-700'>
                                Cover Photo
                            </label>

                            <input type="file" accept='image/*' capture="environment" id='cover' name='cover'
                                className='w-full p-3 border border-gray-200 rounded-lg'
                                onChange={(e) => setEditForm({ ...editForm, cover: e.target.files[0] })} />

                            <div className='relative group/cover'>
                                <img
                                    src={
                                        editForm.cover instanceof File
                                            ? URL.createObjectURL(editForm.cover)
                                            : user.cover_photo
                                                ? `${api.defaults.baseURL}${user.cover_photo}`
                                                : "/default.png"
                                    }
                                    alt="Cover"
                                    className="object-cover h-40 mt-2 rounded-lg w-80 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200"
                                    onError={(e) => (e.target.src = "/default.png")}
                                />

                                <div className='absolute top-0 bottom-0 left-0 right-0 items-center justify-center hidden rounded-lg group-hover/cover:flex bg-black/20'>
                                    <Pencil className='w-5 h-5 text-white' />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Name
                            </label>
                            <input type="text" placeholder='Enter your full Name'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                value={editForm.full_name} />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Username
                            </label>
                            <input type="text" placeholder='Enter your username'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                value={editForm.username} />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Professional Headline
                            </label>
                            <input type="text" placeholder='e.g., Software Engineer at XYZ Corp'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, professional_headline: e.target.value })}
                                value={editForm.professional_headline} />
                        </div>

                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Bio
                            </label>
                            <textarea rows={3} placeholder='Enter a short Bio'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                value={editForm.bio} />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Location
                            </label>
                            <input type="text" placeholder='Enter your Location'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                value={editForm.location} />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Skills (comma-separated)
                            </label>
                            <input type="text" placeholder='e.g., JavaScript, React, Node.js'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, skills: e.target.value.split(',').map(s => s.trim()) })}
                                value={editForm.skills.join(', ')} />
                        </div>
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Interests (comma-separated)
                            </label>
                            <input type="text" placeholder='e.g., Web Development, AI, Gaming'
                                className='w-full p-3 border rounded-lg border-gray-20'
                                onChange={(e) => setEditForm({ ...editForm, interests: e.target.value.split(',').map(s => s.trim()) })}
                                value={editForm.interests.join(', ')} />
                        </div>
                        {/* Resume Upload */}
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Resume
                            </label>
                            <input type="file" accept='.pdf,.doc,.docx' onChange={(e) => setEditForm({ ...editForm, resume: e.target.files[0] })} className='w-full p-3 border rounded-lg border-gray-20' />
                            <button type='button' onClick={async () => {
                                if (editForm.resume) {
                                    await dispatch(uploadResume(editForm.resume));
                                    toast.success('Resume uploaded');
                                }
                            }} className='px-4 py-2 mt-2 text-white bg-blue-500 rounded'>Upload Resume</button>
                        </div>
                        {/* Certificate Upload */}
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Certificate
                            </label>
                            <input type="file" accept='.pdf,.jpg,.png' onChange={(e) => setEditForm({ ...editForm, certificate: e.target.files[0] })} className='w-full p-3 border rounded-lg border-gray-20' />
                            <input type="text" placeholder='Title' onChange={(e) => setEditForm({ ...editForm, certificateTitle: e.target.value })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' />
                            <input type="text" placeholder='Issued By' onChange={(e) => setEditForm({ ...editForm, certificateIssuedBy: e.target.value })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' />
                            <input type="date" onChange={(e) => setEditForm({ ...editForm, certificateDate: e.target.value })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' />
                            <button type='button' onClick={async () => {
                                if (editForm.certificate) {
                                    await dispatch(uploadCertificate({
                                        file: editForm.certificate,
                                        title: editForm.certificateTitle,
                                        issuedBy: editForm.certificateIssuedBy,
                                        date: editForm.certificateDate
                                    }));
                                    toast.success('Certificate uploaded');
                                }
                            }} className='px-4 py-2 mt-2 text-white bg-green-500 rounded'>Upload Certificate</button>
                        </div>
                        {/* Add Experience */}
                        <div>
                            <label className='block mb-1 text-sm font-medium text-gray-700'>
                                Add Experience
                            </label>
                            <input type="text" placeholder='Company' onChange={(e) => setEditForm({ ...editForm, experience: { ...editForm.experience, company: e.target.value } })} className='w-full p-3 border rounded-lg border-gray-20' />
                            <input type="text" placeholder='Role' onChange={(e) => setEditForm({ ...editForm, experience: { ...editForm.experience, role: e.target.value } })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' />
                            <input type="date" placeholder='Start Date' onChange={(e) => setEditForm({ ...editForm, experience: { ...editForm.experience, start: e.target.value } })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' />
                            <input type="date" placeholder='End Date' onChange={(e) => setEditForm({ ...editForm, experience: { ...editForm.experience, end: e.target.value } })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' />
                            <textarea placeholder='Description' onChange={(e) => setEditForm({ ...editForm, experience: { ...editForm.experience, description: e.target.value } })} className='w-full p-3 mt-2 border rounded-lg border-gray-20' rows={3}></textarea>
                            <button type='button' onClick={async () => {
                                await dispatch(addExperience(editForm.experience));
                                toast.success('Experience added');
                            }} className='px-4 py-2 mt-2 text-white bg-purple-500 rounded'>Add Experience</button>
                        </div>
                        <div className='flex justify-end pt-6 space-x-3'>
                            <button onClick={() => setShowEdit(false)}
                                type='button' className='px-4 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 touch-manipulation min-h-[44px]'>Cancel</button>
                            <button
                                type='submit' className='px-4 py-2 text-white transition cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 to hover:to-purple-700 touch-manipulation min-h-[44px]'
                            >Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal