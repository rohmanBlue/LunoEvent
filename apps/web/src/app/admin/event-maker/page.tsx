"use client";
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as React from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import { Textarea } from '@/components/ui/textarea';
// import 'react-datepicker/dist/react-datepicker.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import withRole from '@/hoc/roleGuard';

interface IEventMakerProps {}

function EventMaker() {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  const [images, setImages] = React.useState<File[]>([]);
  const [endDate, setEndDate] = React.useState<Date | null>(new Date());
  const [imageUrls, setImageUrls] = React.useState<string[]>([]);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const newUrls = newImages.map((image) => URL.createObjectURL(image));

      setImages([...images, ...newImages]);
      setImageUrls([...imageUrls, ...newUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);

    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-5 ml-[30rem]">
        <div className="w-full flex flex-col justify-center gap-5 items-start h-auto">
          <div className="w-full ">
            <p className="text-2xl">Your Event</p>
            <p className="text-slate-500">
              Create your dream event here to inspire others
            </p>
          </div>
          <div className="w-full h-0.5 bg-slate-200"></div>
          <div className="w-full p-10 flex justify-between items-center">
            <div className="w-full flex flex-col gap-5 items-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
                id="image-upload"
              />
              <Button
                onClick={triggerFileInput}
                className="bg-slate-400 text-xl"
              >
                Upload Picture
              </Button>

              <div className="flex justify-between items-center gap-2 flex-wrap">
                {images.map((image, index) => (
                  <div key={index} className="relative w-32 h-32">
                    <Image
                      src={URL.createObjectURL(image)}
                      layout="responsive"
                      width={128}
                      height={128}
                      objectFit="cover"
                      className="rounded-xl"
                      alt="uploaded image"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 p-1 bg-red-500 rounded-full h-6 w-6 text-white flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              {/* <div className="w-full min-h-[70vh] rounded-xl relative">
                <Image
                  layout="fill"
                  src="/blackpink.webp"
                  objectFit="cover"
                  alt="image"
                  className="rounded-xl"
                />
              </div> */}
              {/* <div className="flex gap-5">
                <Button className="bg-slate-400 text-xl">Upload Picture</Button>
                <Button className="bg-red-600 text-xl">Delete</Button>
              </div> */}
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Title</p>
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="Event title"
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Description</p>
            </div>
            <div className="w-full">
              <Textarea
                placeholder="Event Description"
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Price</p>
            </div>
            <div className="w-full">
              <Input
                type="number"
                placeholder="Event price"
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
                placeholder="Event location"
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Ticket Type</p>
            </div>
            <div className="w-full">
              <Select>
                <SelectTrigger className="w-full border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0">
                  <SelectValue placeholder="Select Ticket Type" />
                </SelectTrigger>
                <SelectContent className="bg-white text-2xl">
                  <SelectItem value="FREE" className="text-2xl">
                    Free
                  </SelectItem>
                  <SelectItem value="PAID" className="text-2xl">
                    Paid
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Start Time</p>
            </div>
            <div className="w-full">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0 "
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">End Time</p>
            </div>
            <div className="w-full">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0 "
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Category</p>
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="Event category"
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="flex-col flex w-full h-auto gap-5">
            <div className="w-full">
              <p className="text-xl">Available Seats</p>
            </div>
            <div className="w-full">
              <Input
                type="number"
                placeholder="Event seats"
                className="border-b-slate-600 text-xl border-0 border-b-2 rounded-none focus:ring-0 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="sticky bottom-0 right-0 w-full bg-slate-50 flex justify-end items-end p-3 rounded-xl">
            <Button className="text-2xl h-16 rounded-2xl  bg-blue-300"
          
            >
              Create Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRole(EventMaker, 'ADMIN');
