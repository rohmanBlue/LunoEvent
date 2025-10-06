"use client";
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import * as React from 'react';
import DatePicker from 'react-datepicker';
import PhoneInput from 'react-phone-number-input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import withRole from '@/hoc/roleGuard';
import { UserContext } from '@/contexts/UserContext';
import { useMutation } from '@tanstack/react-query';
import apiCall from '@/helper/apiCall';
import { toast, ToastContainer } from 'react-toastify';


interface IAdminProfileProps {}

const AdminProfile: React.FunctionComponent<IAdminProfileProps> = (props) => {
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [address, setAddress] = React.useState<string>('');
  const [phone, setPhone] = React.useState<string>('');
  const [location, setLocation] = React.useState<string>('');
  const [gender, setGender] = React.useState<string>('MALE');
  const [date, setDate] = React.useState<Date | null>(new Date());
  const [isAdded, setIsAdded] = React.useState<boolean>(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imageUrl, setImageUrl] = React.useState<string>('/blackpink.webp');

  const { user } = React.useContext(UserContext);
  const token = localStorage.getItem('token');
  console.log(date);
  console.log(imageFile);
  console.log(imageUrl);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const url = URL.createObjectURL(file);
      setImageFile(file);
      setImageUrl(url);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    setImageFile(null);
    setImageUrl('/blackpink.webp'); // Reset to default image or placeholder
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await apiCall.get('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess: (data) => {
      setFirstName(data.result[0].firstName);
      setLastName(data.result[0].lastName);
      setAddress(data.result[0].address);
      setDate(data.result[0].dateOfBirth);
      setGender(data.result[0].gender);
      setPhone(data.result[0].phoneNumber);
      setImageFile(data.result[0].image);
      setLocation(data.result[0].location.locationName);
      setIsAdded(data.result[0].isAdded);
      console.log(data.result);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const mutateProfile = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('address', address);
      formData.append('gender', gender);
      formData.append('phoneNumber', phone);
      formData.append('dateOfBirth', date?.toISOString() || '');
      formData.append('location', location);
      if (imageFile) {
        formData.append('img', imageFile);
      }
      const { data } = await apiCall.post('/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      console.log(data);
      setIsAdded(data.result.isAdded);
      toast(data.message);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const handleProfileSubmit = () => {
    mutateProfile.mutate();
  };

  React.useEffect(() => {
    mutation.mutate();

    setEmail(user?.email);
    console.log(email);
  }, [user?.email, mutation, email]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('address', address);
      formData.append('gender', gender);
      formData.append('phoneNumber', phone);
      formData.append('dateOfBirth', date?.toString() || '');
      formData.append('location', location);
      if (imageFile) {
        formData.append('img', imageFile);
      }
      const { data } = await apiCall.patch('/api/user/profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: (data) => {
      console.log(data.result);
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
    onError: (error: any) => {
      console.log(error);
      toast.error(error, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
  });

  const handleUpdate = () => {
    updateProfile.mutate();
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-5 ml-[30rem]">
        <ToastContainer />
        <div className="w-full flex flex-col justify-center gap-5 items-start h-auto">
          <div className="w-full ">
            <p className="text-2xl">Your profile</p>
            <p className="text-slate-500">
              Real time information about your profile
            </p>
          </div>
          <div className="w-full h-0.5 bg-slate-200"></div>
          <div className="w-full p-10 flex justify-between items-center">
            <div className="w-full flex items-center">
              <div className="w-36 h-36 rounded-full relative bg-slate-400">
                <Image
                  layout="fill"
                  src={imageFile ? imageUrl : '/blackpink.webp'}
                  objectFit="cover"
                  alt="image"
                  className="rounded-full"
                />
              </div>
              <div className="mx-10">
                <p className="font-bold">Avatar</p>
                <p>Upload image under 1MB</p>
              </div>
            </div>
            <div className="flex gap-5">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
              <Button
                className="bg-slate-400 text-xl"
                onClick={triggerFileInput}
              >
                Upload Picture
              </Button>
              <Button
                className="bg-red-600 text-xl"
                onClick={handleDeleteImage}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Email</p>
            </div>
            <div className="w-full">
              <Input
                type="email"
                placeholder={email}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Phone number</p>
            </div>
            <div className="w-full">
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={(value) => setPhone(value || '')}
                className="w-full text-xl border-b-2 p-3 border-slate-600 focus:ring-0 focus:outline-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Address</p>
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">First name</p>
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Last name</p>
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Location</p>
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Date of birth</p>
            </div>
            <div className="w-full">
              <DatePicker
                dateFormat="yyyy-MM-dd"
                selected={date}
                onChange={(date) => setDate(date)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0 "
              />
            </div>
          </div>

          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Gender</p>
            </div>
            <RadioGroup
              className="w-full flex gap-5"
              value={gender}
              onValueChange={(value) => setGender(value)}
            >
              <div className="flex justify-center items-center gap-5">
                {' '}
                <RadioGroupItem className="border-black" value="MALE" />
                <Label className="text-xl font-bold">Male</Label>
              </div>
              <div className="flex justify-center items-center gap-5">
                <RadioGroupItem className="border-black" value="FEMALE" />
                <Label className="text-xl font-bold">Female</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="sticky bottom-0 right-0 w-full bg-slate-50 flex justify-end items-end p-3 rounded-xl">
            {isAdded ? (
              <Button
                className="text-2xl h-16 rounded-2xl  bg-blue-300"
                onClick={handleUpdate}
              >
                Update Information
              </Button>
            ) : (
              <Button
                className="text-2xl h-16 rounded-2xl  bg-blue-300"
                onClick={handleProfileSubmit}
              >
                Save Information
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRole(AdminProfile, 'ADMIN');
