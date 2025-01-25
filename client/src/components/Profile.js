import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getUsername } from "../helper/helper";
import { 
  ArrowRight, 
  ArrowLeft, 
  Image, 
  Globe, 
  Briefcase, 
  User, 
  CheckCircle2,
  CheckIcon 
} from 'lucide-react';
import NavbarP from "./NavbarP";
const Profile = () => {
  const navigate = useNavigate();
  const { id: photographerId } = getUsername();

  // State management
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    addedPhotos: [],
    language: [],
    services: [{ name: "", pricePerDay: '' }]
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch existing profile data
  useEffect(() => {
    axios
      .get(`/description/${photographerId}`)
      .then((response) => {
        const profileData = response.data;
        if (profileData) {
          setFormData({
            title: profileData.title || "",
            description: profileData.description || "",
            city: profileData.city || "",
            addedPhotos: profileData.photos || [],
            language: profileData.languages || [],
            services: profileData.services || [{ name: "", pricePerDay: 100 }]
          });
          setDataFetched(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
      });
  }, [photographerId]);

  // Form update handlers
  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const uploadPhoto = (ev) => {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }
    axios.post('/upload', data, {
      headers: {'Content-type':'multipart/form-data'}
    }).then(response => {
      const {data:filenames} = response;
      updateFormData('addedPhotos', [...formData.addedPhotos, ...filenames]);
      console.log('addedPhotos',filenames);
    });
  };
  const removePhoto = (ev, filename) => {
    ev.preventDefault();
    updateFormData('addedPhotos', formData.addedPhotos.filter(photo => photo !== filename));
  };
  
  const selectAsMainPhoto = (ev, filename) => {
    ev.preventDefault();
    const updatedPhotos = [
      filename, 
      ...formData.addedPhotos.filter(photo => photo !== filename)
    ];
    updateFormData('addedPhotos', updatedPhotos);
  };
  const saveProfile = () => {
    const data = {
      owner: photographerId,
      ...formData
    };

    if (dataFetched) {
      axios
        .put(`/updateProfile`, data)
        .then(() => {
          alert("Profile updated successfully");
          navigate('/PHome');
        })
        .catch((error) => {
          alert("Error updating the profile");
          console.error("Error updating profile data:", error);
        });
    } else {
      axios
        .post("/saveProfile", data)
        .then(() => {
          alert("Profile created successfully");
          navigate('/PHome');
        })
        .catch((error) => {
          alert("Error saving profile");
          console.error("Error saving profile data:", error);
        });
    }
  };
  // Step rendering
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800"> Overview</h3>
              
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Title  
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => {
                      updateFormData('title', e.target.value);
                     
                    }}
                    placeholder="Professional Photography Brand"
                    style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Description
                </label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => {
                    updateFormData('description', e.target.value);
                    
                  }}
                  style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                  placeholder="Craft a compelling narrative about your photography journey and expertise"
                  className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300 min-h-[120px]"
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Location & Languages</h3>
              {completedSteps.includes(2) && (
                <div className="flex items-center text-green-600">
                  <CheckIcon className="mr-2" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Operating City
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    type="text"
                    value={formData.city}
                    onChange={(e) => {
                      updateFormData('city', e.target.value);
                    }}
                    style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                    placeholder="Primary City of Operation"
                    className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Languages
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['English', 'Hindi', 'Gujarati', 'Marathi'].map(lang => (
                    <label 
                      key={lang} 
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition duration-300"
                    >
                      <input
                        type="checkbox"
                        checked={formData.language.includes(lang)}
                        onChange={() => {
                          const currentLanguages = formData.language;
                          const newLanguages = currentLanguages.includes(lang)
                            ? currentLanguages.filter(l => l !== lang)
                            : [...currentLanguages, lang];
                          updateFormData('language', newLanguages);
                          
                          
                        }}
                        className="form-checkbox h-4 w-4 text-gray-600 rounded focus:ring-gray-500"
                      />
                      <span className="text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Portfolio Images</h3>
              {completedSteps.includes(3) && (
                <div className="flex items-center text-green-600">
                  <CheckIcon className="mr-2" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Portfolio Images
                </label>
                <div className="grid grid-cols-3 gap-4">
                {formData.addedPhotos.map(link => (
  <div 
    key={link} 
    className="relative group overflow-hidden rounded-lg shadow-md"
  >
    <img 
      src={'http://localhost:4000/'+link}
      alt="Portfolio" 
      onError={(e) => {
        console.error('Image load error for link:', link);
      }}
      className="w-full h-48 object-cover transition duration-300 transform group-hover:scale-110"
    />
    <button onClick={ev => removePhoto(ev,link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    </button>
    <button onClick={ev => selectAsMainPhoto(ev,link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
      {link === formData.addedPhotos[0] && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      )}
      {link !== formData.addedPhotos[0] && (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      )}
    </button>
  </div>
))}
                  <label 
                    className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition duration-300"
                    onChange={(e) => {
                      uploadPhoto(e);
                     
                    }}
                  >
                    <input 
                      type="file" 
                      multiple 
                      className="hidden" 
                    />
                    <Image size={40} className="text-gray-400 mb-2" />
                    <span className="text-gray-500">Upload Photos</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Photography Services</h3>
              {completedSteps.includes(4) && (
                <div className="flex items-center text-green-600">
                  <CheckIcon className="mr-2" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Photography Services
                </label>
                {formData.services.map((service, index) => (
                  <div 
                    key={index} 
                    className="flex space-x-3 mb-3 items-center"
                  >
                    <div className="relative flex-grow">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text"
                        placeholder="Service Name"
                        value={service.name}
                        onChange={(e) => {
                          const updatedServices = [...formData.services];
                          updatedServices[index].name = e.target.value;
                          updateFormData('services', updatedServices);
                          
                          
                        }}
                        style={{ paddingLeft: '2.5rem', paddingRight: '1rem' }}
                        className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300"
                      />
                    </div>
                    <div className="relative w-1/3">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                      <input 
                        type="number"
                        placeholder="Per Day Price"
                        value={service.pricePerDay}
                        onChange={(e) => {
                          const updatedServices = [...formData.services];
                          updatedServices[index].pricePerDay = parseFloat(e.target.value);
                          updateFormData('services', updatedServices);
                        }}
                        style={{ paddingLeft: '1.5rem', paddingRight: '1rem' }}
                        className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition duration-300"
                      />
                    </div>
                    <button 
                      onClick={() => {
                        const updatedServices = formData.services.filter((_, i) => i !== index);
                        updateFormData('services', updatedServices);
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition duration-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    updateFormData('services', [...formData.services, { name: "", pricePerDay: '' }]);
                  }}
                  className="w-full py-2 border-2 border-gray-500 text-gray-500 rounded-lg hover:bg-gray-50 transition duration-300 flex items-center justify-center"
                >
                  + Add Service
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
    <NavbarP/>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="px-8 pt-8 pb-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Profile Setup
          </h2>
          <div className="flex justify-center space-x-4 mt-4">
            {[1, 2, 3, 4].map((step) => (
              <div 
                key={step}
                className={`w-12 h-1.5 rounded-full transition-colors duration-300 ${
                  currentStep >= step ? 'bg-gray-700' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-8">
          {renderStepContent()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button 
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center text-gray-700 px-2 py-2 rounded-lg hover:text-black transition duration-300"
              >
                <ArrowLeft className="mr-2" /> Previous
              </button>
            )}
            
            {currentStep < 4 ? (
              <button 
                onClick={() => setCurrentStep(currentStep + 1)}
                className="ml-auto flex items-center bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
              >
                Next <ArrowRight className="ml-2" />
              </button>
            ) : (
              <button 
                onClick={saveProfile}
                className="ml-auto flex items-center bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition duration-300"
              >
                <CheckCircle2 className="mr-2" /> Complete Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;