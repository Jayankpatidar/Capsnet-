import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Building2, Upload, X, Plus } from 'lucide-react'
import { createCompany } from '../features/company/companySlice'
import toast from 'react-hot-toast'

const CreateCompany = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector(state => state.company)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    founded_year: '',
    company_size: '',
    mission: '',
    vision: '',
    values: []
  })

  const [logo, setLogo] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [newValue, setNewValue] = useState('')

  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Consulting', 'Media', 'Real Estate', 'Transportation',
    'Food & Beverage', 'Energy', 'Telecommunications', 'Entertainment',
    'Agriculture', 'Construction', 'Automotive', 'Pharmaceuticals',
    'Legal Services', 'Non-profit'
  ]

  const companySizes = [
    '1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      setLogo(file)
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      setCoverImage(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const removeLogo = () => {
    setLogo(null)
    setLogoPreview('')
  }

  const removeCover = () => {
    setCoverImage(null)
    setCoverPreview('')
  }

  const addValue = () => {
    if (newValue.trim() && !formData.values.includes(newValue.trim())) {
      setFormData(prev => ({
        ...prev,
        values: [...prev.values, newValue.trim()]
      }))
      setNewValue('')
    }
  }

  const removeValue = (valueToRemove) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter(value => value !== valueToRemove)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.industry || !formData.location) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const submitData = new FormData()

      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'values') {
          submitData.append(key, formData[key].join(','))
        } else {
          submitData.append(key, formData[key])
        }
      })

      // Add files
      if (logo) {
        submitData.append('logo', logo)
      }
      if (coverImage) {
        submitData.append('cover_image', coverImage)
      }

      const result = await dispatch(createCompany(submitData)).unwrap()
      toast.success('Company created successfully!')
      navigate(`/company/${result._id}`)
    } catch (error) {
      toast.error(error || 'Failed to create company')
    }
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Create Your Company</h1>
        <p className="text-gray-600">Build your company's presence on our platform</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-6 text-xl font-semibold">Basic Information</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, Country"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.company.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Founded Year
              </label>
              <input
                type="number"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Company Size
              </label>
              <select
                name="company_size"
                value={formData.company_size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select company size</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size} employees</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about your company..."
              required
            />
          </div>
        </div>

        {/* Company Images */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-6 text-xl font-semibold">Company Images</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Logo Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Company Logo
              </label>
              <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg">
                {logoPreview ? (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="object-contain w-full h-32 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <div className="mb-2 text-sm text-gray-600">Upload company logo</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="text-sm text-blue-600 cursor-pointer hover:text-blue-700"
                    >
                      Choose file
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Cover Image
              </label>
              <div className="p-4 border-2 border-gray-300 border-dashed rounded-lg">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="object-cover w-full h-32 rounded"
                    />
                    <button
                      type="button"
                      onClick={removeCover}
                      className="absolute p-1 text-white bg-red-500 rounded-full top-2 right-2 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <div className="mb-2 text-sm text-gray-600">Upload cover image</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                      id="cover-upload"
                    />
                    <label
                      htmlFor="cover-upload"
                      className="text-sm text-blue-600 cursor-pointer hover:text-blue-700"
                    >
                      Choose file
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="mb-6 text-xl font-semibold">Mission, Vision & Values</h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Mission Statement
              </label>
              <textarea
                name="mission"
                value={formData.mission}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What is your company's mission?"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Vision Statement
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="What is your company's vision for the future?"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Company Values
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a company value"
                />
                <button
                  type="button"
                  onClick={addValue}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {formData.values.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.values.map((value, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                    >
                      {value}
                      <button
                        type="button"
                        onClick={() => removeValue(value)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Building2 className="w-4 h-4" />
                Create Company
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateCompany
