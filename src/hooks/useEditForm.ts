import { useEffect, useState } from "react";
;

type Props = {
   data: Song;
   inputFields: {
      name: string;
      singer: string;
      image_url: string;
   };
   imageURLFromLocal: string;
};

const URL_REGEX = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export default function useEditForm({ data, inputFields, imageURLFromLocal }: Props) {
   const [validName, setValidName] = useState(!!data.name);
   const [validSinger, setValidSinger] = useState(!!data.singer);
   const [validURL, setValidURL] = useState(false);
   const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);
   const [isChangeInEdit, setIsChangeInEdit] = useState(false);

   // validate song name
   useEffect(() => {
      if (!inputFields.name) {
         setValidName(false);
      } else {
         setValidName(true);
      }
   }, [inputFields.name]);

   // validate song name
   useEffect(() => {
      if (!inputFields.singer) {
         setValidSinger(false);
      } else {
         setValidSinger(true);
      }
   }, [inputFields.singer]);

   useEffect(() => {
      if (!inputFields.image_url) {
         setValidURL(true);
         return;
      }
      const test1 = URL_REGEX.test(inputFields.image_url);
      setValidURL(test1);
   }, [inputFields.image_url]);

   useEffect(() => {
      if (
         inputFields.name !== data.name ||
         inputFields.singer !== data.singer ||
         inputFields.image_url
      ) {
         setIsChangeInEdit(true);
      }
   }, [inputFields, imageURLFromLocal]);

   useEffect(() => {
      setIsAbleToSubmit(validName && validSinger && validURL && isChangeInEdit);
   }, [validName, validSinger, validURL, isChangeInEdit]);

   
   return { validName, validSinger, validURL, isAbleToSubmit, isChangeInEdit, setValidURL };
}
