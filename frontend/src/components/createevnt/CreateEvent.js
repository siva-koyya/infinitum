import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateEvent({ eventData }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [eventName, setEventName] = useState('');
  const [userName, setUserName] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [previewVideos, setPreviewVideos] = useState([]);
  const navigate = useNavigate();
  const baseURL = 'http://localhost:5555/'; // Correct base URL for images

  useEffect(() => {
    if (eventData) {
      setEventName(eventData.eventname);
      setUserName(eventData.user);
      const imageUrls = eventData.images.map(img => `${baseURL}${img.path}`);
      const videoUrls = eventData.videos.map(img => `${baseURL}${img.path}`);
      setPreviewImages(imageUrls);
      setPreviewVideos(videoUrls)
    }
  }, [eventData]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const videoFiles = files.filter(file => file.type.startsWith('video/'));

    setSelectedFiles(files);

    const newImagePreviews = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newImagePreviews]);

    const newVideoPreviews = videoFiles.map(file => URL.createObjectURL(file));
    setPreviewVideos(prev => [...prev, ...newVideoPreviews]);
  };

  const postData = async () => {
    try {
      const formData = new FormData();
      formData.append('eventname', eventName);
      formData.append('user', userName);
      selectedFiles.forEach(file => formData.append('files', file)); // Append all files with a single key

      const response = await axios.post('http://localhost:5555/event', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        alert('Successfully created');
        navigate('/');
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating event');
    }
  };

  const editPostData = async (id) => {
    try {
      const formData = new FormData();
      formData.append('eventname', eventName);
      formData.append('user', userName);
      selectedFiles.forEach(file => formData.append('files', file)); // Append all files with a single key

      const response = await axios.patch(`http://localhost:5555/event/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.status === 200) {
        alert('Successfully updated');
        navigate('/');
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating event');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (eventData) {
      editPostData(eventData._id);
    } else {
      postData();
    }
  };

  return (
    <div className='flex justify-center   h-full w-full p-8 items-center flex-col gap-4 font-sans antialiased'>
      <h1 className='text-start bg-slate-500 w-10/12 h-10 p-1  shadow-slate-100 shadow-sm  rounded-sm text-xl'>
        {eventData ? 'Edit Event' : 'Create Event'}
      </h1>
      <form onSubmit={handleSubmit} className='flex  shadow-slate-300 shadow-md flex-col w-10/12 h-full gap-5 p-5 max-w-8xl text-lg'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='event'>Event Name</label>
          <input
            id='event'
            minLength={4}
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className='border-2 h-12 pl-4 outline-blue-600 rounded-sm'
            placeholder='Enter Event Name'
            type='text'
            required
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor='user'>User Email</label>
          <input
            id='user'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className='border-2 rounded-sm pl-4 h-12 outline-blue-600'
            type='email'
            placeholder='Enter email'
            required
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='imageInput'>Select files</label>
          <div className='relative'>
            <input
              id='imageInput'
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              type='file'
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
            <button
              type='button'
              className='px-4 py-2 bg-blue-500 text-white rounded-lg h-10'
              onClick={() => document.getElementById('imageInput').click()}
            >
              Choose Files
            </button>
          </div>
        </div>
        {/* <div className='flex flex-col gap-1'>
          <label htmlFor='videoInput'>Select Videos</label>
          <div className='relative'>
            <input
              id='videoInput'
              multiple
              accept="video/*"
              onChange={handleFileChange}
              type='file'
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
            <button
              type='button'
              className='px-4 py-2 bg-blue-500 text-white rounded-lg h-10'
              onClick={() => document.getElementById('videoInput').click()}
            >
              Choose Videos
            </button>
          </div>
        </div> */}
        <div>
          <button type='submit' className='w-full h-12 bg-green-800 rounded-md text-2xl text-white'>
            {eventData ? 'Save' : 'Create Event'}
          </button>
        </div>
        <div className='flex flex-col'>
          <h1 className='text-2xl underline m-3'>images and videos :</h1>
          {(previewImages.length > 0 || previewVideos.length > 0) && (
            <ul className='w-full'>
              <li className='w-full h-96 overflow-auto flex flex-wrap gap-2'>
                {previewImages.map((src, index) => (
                  <img
                    key={index}
                    src={src}
                    alt={`Preview ${index}`}
                    className='w-80 m-2 h-80 rounded-xl shadow-slate-500 shadow-md object-cover hover:opacity-80 '
                  />
                ))}
                {previewVideos.map((src, index) => (
                  <video
                    key={index}
                    src={src}
                    controls
                    className='w-80 m-2 h-80 object-cover rounded-xl  shadow-slate-500 shadow-md '
                  />
                ))}
              </li>
            </ul>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
