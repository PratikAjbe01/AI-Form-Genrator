'use client';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import FieldEdit from './FieldEdit';
import { db } from '@/app/configs';
import { and, eq } from 'drizzle-orm';

import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { JsonForms, userResponses } from '@/app/configs/Schema';


function FormUi({ JsonForm ,setJsonForm,record,selectTheme,selectedStyle,editable=true}) {
  const [updateTrigger,setUpdateTrigger]=useState();
    const [formData,setFormData]=useState();
    const [flag,setFlag]=useState(false);
 const { user } = useUser()
  useEffect(()=>{
    if(updateTrigger){
setJsonForm(JsonForm);
updateJsonFormInDb();
    }

  },[updateTrigger])
  if (!JsonForm || !Array.isArray(JsonForm.fields)) {
    return <p className="text-red-500">Form data is not valid.</p>;
  }

  const handleUpdate = (updatedField, index) => {
    JsonForm.fields[index].question = updatedField.label;
    JsonForm.fields[index].placeholder = updatedField.placeholder;
    console.log("after field update", JsonForm);
    setUpdateTrigger(Date.now())
  };

 const handleDelete = (index) => {
  const updatedFields = JsonForm.fields.filter((_, ind) => ind !== index);

  const updatedForm = {
    ...JsonForm,
    fields: updatedFields
  };

  setJsonForm(updatedForm);
  setUpdateTrigger(Date.now());
};

  const updateJsonFormInDb=async()=>{
    console.log("record:",record);
    console.log("email:",user?.primaryEmailAddress.emailAddress);




  try {
    const result = await db
      .update(JsonForms)
      .set({
        jsonform: JSON.stringify(JsonForm),
      })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy,user?.primaryEmailAddress.emailAddress)
        )
      );

    console.log('after update query:', result);
  } catch (error) {
    console.error('Failed to update form:', error);
  }


  }
const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => {
    if (type === 'checkbox') {
      const currentValues = prev?.[name] || [];
      return {
        ...prev,
        [name]: checked
          ? [...currentValues, value]
          : currentValues.filter((v) => v !== value),
      };
    } else if (type === 'radio') {
      return {
        ...prev,
        [name]: value,
      };
    } else {
      return {
        ...prev,
        [name]: value,
      };
    }
  });
};

// const onSubmit=async(event)=>{
//     event.preventDefault();
//   console.log('formData:',formData)
//   console.log("userResponses:", userResponses);
//   console.log('formRef', record?.id);


//   const result=await db.insert(userResponses).values({
//     jsonResponse:formData,
//     createdAt:moment().format('DD/MM/yyyy'),
//     formRef:record?.id
//   })
//   if (result){
//     console.log('userResponse :',result);
    
//   }
  
// }
const onSubmit = async (event) => {
  event.preventDefault();
  console.log('formData:', formData);
  console.log('record id:', record?.id);

  if (!record?.id) {
    console.error('Form ID is undefined');
    return;
  }

  const result = await db.insert(userResponses).values({
    jsonResponse: formData,
    createdAt: moment().format('DD/MM/yyyy'),
    formRef: record.id,
    createdBy:'anonymous'
  });

  if (result) {
    console.log('userResponse saved:', result);
    setFlag(true);
  }
};

  return (flag==false?<>  <div className="border p-5 space-y-2 overflow-y-auto "  style={{
      boxShadow: selectedStyle?.key=='boxshadow'&& '5px 5px 0px black',
      border:selectedStyle?.key=='border'&&selectedStyle.value
    }} data-theme={selectTheme}>
      <h2 className="font-bold text-2xl text-center">{JsonForm.form_title}</h2>
      <p className="text-sm text-gray-500 text-center">{JsonForm.form_description}</p>

      <form onSubmit={onSubmit} className="space-y-4">
        {JsonForm.fields.map((field, index) => {
          const {
            field_name,
            question,
            input_format,
            is_required,
            choices = [],
            placeholder = '',
          } = field;

          const label = (
            <Label htmlFor={field_name}>
              {question}
              {is_required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          );

          let inputElement = null;

          switch (input_format) {
            case 'text':
            case 'email':
            case 'date':
            case 'time':
            case 'number':
            case 'tel':
            case 'url':
              inputElement = (
                <Input
                onChange={(e)=>handleInputChange(e)}
                  id={field_name}
                  name={field_name}
                  type={input_format}
                  required={is_required}
                  placeholder={placeholder}
                />
              );
              break;

            case 'textarea':
              inputElement = (
                <Textarea
                  id={field_name}
                  name={field_name}
                  required={is_required}
                  placeholder={placeholder}
                         onChange={(e)=>handleInputChange(e)}
                />
              );
              break;

            case 'radio':
              inputElement = (
                <RadioGroup onChange={handleInputChange} name={field_name} required={is_required}>
                  {choices.map((choice) => (
                    <div key={choice.value} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={choice.value}
                        id={`${field_name}_${choice.value}`}
                      />
                      <Label htmlFor={`${field_name}_${choice.value}`}>
                        {choice.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              );
              break;

            case 'checkbox':
              inputElement = (
                <div className="flex flex-col gap-2">
                  {choices.map((choice) => (
                    <div key={choice.value} className="flex items-center space-x-2">


                      <Checkbox
                        onChange={handleInputChange}
                        id={`${field_name}_${choice.value}`}
                        name={field_name}
                         checked={(formData?.[field_name] || []).includes(choice.value)}
                     onCheckedChange={(checked) => {
    setFormData((prev) => {
      const currentValues = prev?.[field_name] || [];

      return {
        ...prev,
        [field_name]: checked
          ? [...currentValues, choice.value]
          : currentValues.filter((v) => v !== choice.value),
      };
    });
  }}
                        value={choice.value}
                      />
                      <Label htmlFor={`${field_name}_${choice.value}`}>
                        {choice.label}
                      </Label>
                    </div>
                  ))}
                </div>
              );
              break;

            case 'select':
              inputElement = (
                <Select required={is_required}   onValueChange={(value) =>
    setFormData((prev) => ({
      ...prev,
      [field_name]: value,
    })) }>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder || "Select an option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {choices.map((choice) => (
                      <SelectItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
              break;

            default:
              // Using div as fallback instead of input if needed
              inputElement = (
                <input type='file' placeholder='upload  file' className="p-2 border rounded"/>
                  
              
              );
              break;
          }

          return (
            <div key={field_name} className="relative rounded p-4">
              <div className="absolute top-2 right-2">
           {editable&&     <FieldEdit 
                  defaultValue={field}
                  onUpdate={(value) => handleUpdate(value, index)}
                  onDelete={() => handleDelete(index)}
                />}
              </div>
              <div className="space-y-2">
                {label}
                {inputElement}
              </div>
            </div>
          );
        })}
        <button type='submit' className='btn btn-primary'>Submit</button>
      </form>
    </div></>:<>Thanks for submitting Form</>
  
  );
}

export default FormUi;