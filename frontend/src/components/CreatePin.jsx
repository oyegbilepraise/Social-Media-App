import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const updateImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Image upload error", err);
        });
    } else setWrongImageType(true);
  };

  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category
      }

      client.create(doc).then(() => {
        navigate('/')
      })
    } else{
      setFields(true)
      setTimeout(() => {
        setFields(false)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col justify-center item-container mt-5 lg:h4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in text-center">
          Please fill in all the field
        </p>
      )}
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 w-full lg:w4/5">
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray p-3 w-full h-420">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong Image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="flex flex-col justify-center items-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <div className="text-lg">Click to Upload</div>
                    <p className="mt-32 text-gray-400">
                      Use high-quality JPG, SVG, PNG, GIF or TIFF less than 20
                      MB
                    </p>
                  </div>
                  <input
                    type="file"
                    name="upload-image"
                    onChange={updateImage}
                    className="w-0 h-0"
                  />
                </div>
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="" className="h-full w-full" />
                <button
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  type="button"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input
            className="text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 outline-none p-2"
            type="text"
            placeholder="Add your title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          {user && (
            <div className="flex gap-2 items-center my-2">
              <img
                src={user.image}
                alt="user"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold">{user.UserName}</p>
            </div>
          )}
          <input
            className="text-base sm:text-lg border-b-2 border-gray-200 outline-none p-2"
            type="text"
            placeholder="What is your pin about"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
          />
          <input
            className="text-base sm:text-lg border-b-2 border-gray-200 outline-none p-2"
            type="text"
            placeholder="Add a destination link"
            onChange={(e) => setDestination(e.target.value)}
            value={destination}
          />
          <div className="flex flex-col">
            <div>
              <p className='font-semibold mb-2 text-lg sm:text-xl'>Choose Pin category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'>
              <option value="other" className='bg-white'>Select Category</option>
              {categories.map((category) => (
                <option className='text-base border-0 outline-none capitalize bg-white' value={category.name}>
                  {category.name} 
                </option>
              ))}
              </select>
            </div>
            <div className="flex justify-end items mt-5">
              <button type="button" className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none" onClick={savePin}>
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
