import React from 'react';
import Image from 'next/image';
import { Plus, File } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type HeaderProps = {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Header: React.FC<HeaderProps> = ({
  input,
  setInput,
  handleSubmit,
  handlePaste,
  fileInputRef,
  handleFileUpload
}) => (
  <div className="fixed top-0 left-0 right-0 py-4 px-10 bg-[#1E1E1E] shadow-md z-20">
    <div className="flex justify-center mb-4 p-1">
      <Image
        src="/logo_banner_trans.png"
        alt="NacoClip Logo"
        width={150}
        height={30}
        objectFit="contain"
      />
    </div>
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onPaste={handlePaste}
        placeholder="Type or paste (Ctrl+V) to add"
        className="flex-grow bg-[#2D2D2D] text-white border-[#4A4AFF]"
      />
      <Button type="submit" className="bg-[#4A4AFF] hover:bg-[#00E5AE] transition-colors text-white p-2 w-10 h-10">
        <Plus className="h-6 w-6" />
      </Button>
      <Button 
        type="button" 
        onClick={() => fileInputRef.current?.click()} 
        className="bg-[#00E5AE] hover:bg-[#4A4AFF] transition-colors text-white p-2 w-10 h-10"
      >
        <File className="h-6 w-6" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
    </form>
  </div>
);

export default Header;