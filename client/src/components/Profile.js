import {useEffect, useState} from "react";
import axios from "axios";
import { getUsername } from "../helper/helper";
import { useNavigate } from "react-router-dom";
import NavbarP from "./NavbarP";

export default function Profile(){
    const navigate = useNavigate();

    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [city,setCity] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [language,setLanguage] = useState([]);
    //const [services,setServices] = useState([]);
    const [services, setServices] = useState([
      {
        name: "",
        pricePerDay: 100,
      },
    ]);

    const {id:photographerId} = getUsername();
    const [dataFetched, setDataFetched] = useState(false);

    //////////////////////////////////////////////////
    //fetching the details if already exist

    useEffect(() => {
      // Fetch the user's existing profile data if available
      axios
        .get(`/description/${photographerId}`)
        .then((response) => {
          const profileData = response.data;
  
          if (profileData) {
            // Populate state variables with existing data
            setTitle(profileData.title || "");
            setDescription(profileData.description || "");
            setCity(profileData.city || "");
            setAddedPhotos(profileData.photos || []);
            setLanguage(profileData.languages || []);
  
            if (profileData.services) {
              setServices(profileData.services);
            }
            setDataFetched(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    }, [photographerId]);

    ///////////////////////////////////////////
    function inputHeader(text) {
        return (
          <h2 className="font-semibold mt-4 text-2xl">{text}</h2>
        );
      }
      function inputDescription(text) {
        return (
          <p className="text-gray-500 text-sm">{text}</p>
        );
      }
      function preInput(header,description) {
        return (
          <>
            {inputHeader(header)}
            {inputDescription(description)}
          </>
        );
      }
    ///////////////////////////

    function uploadPhoto(ev) {
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
          data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
          headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
          const {data:filenames} = response;
          setAddedPhotos(prev => {
            return [...prev, ...filenames];
          });
        })
      }


      function removePhoto(ev,filename) {
        ev.preventDefault();
        setAddedPhotos([...addedPhotos.filter(photo => photo !== filename)]);
      }

      function selectAsMainPhoto(ev,filename) {
        ev.preventDefault();
        setAddedPhotos([filename,...addedPhotos.filter(photo => photo !== filename)]);
      }

    ////////////////////

      function handleCbClick(ev) {
        const {checked,name} = ev.target;
        if (checked) {
          setLanguage([...language,name]);
        } else {
          setLanguage([...language.filter(selectedName => selectedName !== name)]);
        }
      }


      const addService = () => {
        setServices([...services, { name: "", pricePerDay: 0 }]);
      };
      const removeService = (index) => {
        const updatedServices = services.filter((_, i) => i !== index);
        setServices(updatedServices);
      };
      const updateService = (index, fieldName, value) => {
        const updatedServices = [...services];
        updatedServices[index][fieldName] = value;
        setServices(updatedServices);
      };
    
      ///////////

      function saveProfile(ev){
        ev.preventDefault();
        const data = {
          owner: photographerId,
          title,
          description,
          city,
          addedPhotos,
          language,
          services,
        };

        if(dataFetched){
          //update profile
          axios
          .put(`/updateProfile`, data)
          .then((updateResponse) => {
            alert("Profile updated successfully");
            console.log("Profile data updated:", updateResponse.data);
            navigate('/PHome');
          })
          .catch((updateError) => {
            alert("Error updating the profile");
            console.error("Error updating profile data:", updateError);
          });
        }
        else{
          //create new profile

          axios
        .post("/saveProfile", data)
        .then((response) => {
          // Handle the response as needed
          alert("successfull")
          console.log("Profile data saved:", response.data);
          navigate('/PHome');


      })
        .catch((error) => {
          // Handle any errors that occur during the request
          alert("errroror")
          console.error("Error saving profile data:", error);
      });

        }

        

      }

      ///////////
    return (

      <div>
        <NavbarP/>
      <div className="" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="mr-80 ml-80  pt-6 ">
          <h1 className="font-bold text-3xl">Profile</h1>
            <form onSubmit={saveProfile}>
            
            {preInput('Title', 'Title for your account. Should be short and catchy as in advertisement')}
            <input type="text" value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title, for example: XYZ Photography"/>
            
            {preInput('About', 'About yourself')}
            <textarea type="text" placeholder="Description" value={description} onChange={ev => setDescription(ev.target.value)}/>
            
            {preInput('City', '')}
            <input type="text" placeholder="Eg: Mumbai" value={city} onChange={ev => setCity(ev.target.value)}/>

            {preInput('Photos','')}
            <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
            
            {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div className="h-40 flex relative" key={link}>
                    <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/'+link} alt=""/>
                    <button onClick={ev => removePhoto(ev,link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    </button>
                    <button onClick={ev => selectAsMainPhoto(ev,link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                    {link === addedPhotos[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    )}
                    {link !== addedPhotos[0] && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    )}
                    </button>
                </div>
            ))}
            
            <label className="h-40 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
            <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
            Upload
            </label>
            </div>

            {preInput('Languages Known','Select the languages you can speak ')}
            <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input type="checkbox" checked={language.includes('English')} name="English" onChange={handleCbClick}/>
            <span>English</span>
            </label>
            <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input type="checkbox" checked={language.includes('Hindi')} name="Hindi" onChange={handleCbClick}/>
            <span>Hindi</span>
            </label><label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input type="checkbox" checked={language.includes('Gujarati')} name="Gujarati" onChange={handleCbClick}/>
            <span>Gujarati</span>
            </label><label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
            <input type="checkbox" checked={language.includes('Marathi')} name="Marathi" onChange={handleCbClick}/>
            <span>Marathi</span>
            </label>
            </div>


            {/* Service section */}
            {preInput('My Services','Add various services you provide ')}
            {services.map((service, index) => (
          <div key={index} >
            <div className="flex ">
            <h3 className="font-semibold pt-2 pr-2">Service name</h3>
            <input className="mr-12"
              type="text"
              placeholder="Service Name"
              value={service.name}
              onChange={(ev) => updateService(index, "name", ev.target.value)}
            />
            <h3 className="font-semibold pt-3 pr-2">Price </h3>
            <input
              type="number"
              placeholder="Price Per Day"
              value={service.pricePerDay}
              onChange={(ev) =>
                updateService(index, "pricePerDay", parseFloat(ev.target.value))
              }
            />
            <button
        type="button"
        className="primary my-1 mx-1 px-2 py-1 w-16"
        onClick={() => removeService(index)}
      >
        Remove
      </button>
            </div>
          </div>
        ))}
        <button type="button" className="cursor-pointer text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3 my-3" onClick={addService}>
          Add Another Service
        </button>



            <button type="submit" className="primary my-4 mx-4">Save</button>
            </form>

        </div>
        </div>
        </div>
    )
}