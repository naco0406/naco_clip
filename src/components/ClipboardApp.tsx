import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Header from '@/components/Header';
import ClipboardContent from '@/components/ClipboardContent';

const Notepad = dynamic(() => import('@/components/Notepad'), { ssr: false });

type ClipboardItemType = {
    type: 'text' | 'image' | 'file';
    content: string;
    name?: string;
    size?: number;
};

const ClipboardApp = () => {
    const [items, setItems] = useLocalStorage<ClipboardItemType[]>('clipboardItems', []);
    const [input, setInput] = useState('');
    const [notepadContent, setNotepadContent] = useLocalStorage('notepadContent', '');
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const windowWidth = useWindowWidth();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            addItem({ type: 'text', content: input });
            setInput('');
        }
    };

    const handlePaste = async (e: React.ClipboardEvent) => {
        e.preventDefault();
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.type.indexOf('image') !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const content = e.target?.result as string;
                        addItem({ type: 'image', content, name: 'Pasted Image', size: blob.size });
                    };
                    reader.readAsDataURL(blob);
                }
            } else if (item.type === 'text/plain') {
                const text = await new Promise<string>((resolve) => item.getAsString(resolve));
                addItem({ type: 'text', content: text });
            }
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                addItem({ type: file.type.startsWith('image/') ? 'image' : 'file', content, name: file.name, size: file.size });
            };
            reader.readAsDataURL(file);
        }
    };

    const addItem = (newItem: ClipboardItemType) => {
        setItems([newItem, ...items]);
        toast({
            title: "Item Added",
            description: `A new ${newItem.type === 'text' ? 'text' : newItem.type === 'image' ? 'image' : 'file'} has been added to the clipboard.`,
            duration: 1500,
        });
    };

    const copyToClipboard = (item: ClipboardItemType) => {
        if (item.type === 'text') {
            navigator.clipboard.writeText(item.content);
        } else if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.content;
            document.body.appendChild(img);
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNode(img);
            selection?.removeAllRanges();
            selection?.addRange(range);
            document.execCommand('copy');
            document.body.removeChild(img);
        } else {
            navigator.clipboard.writeText(item.name || 'File');
        }
        toast({
            title: "Copied to Clipboard",
            description: `The selected ${item.type === 'text' ? 'text' : item.type === 'image' ? 'image' : 'file'} has been copied to the clipboard.`,
            duration: 1500,
        });
    };

    const deleteItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
        toast({
            title: "Item Deleted",
            // description: "The selected item has been removed from the clipboard.",
            variant: "destructive",
            duration: 1000,
        });
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#1E1E1E]">
            <Header
                input={input}
                setInput={setInput}
                handleSubmit={handleSubmit}
                handlePaste={handlePaste}
                fileInputRef={fileInputRef}
                handleFileUpload={handleFileUpload}
            />
            <div className={`flex flex-1 ${windowWidth > 1128 ? 'flex-row' : 'flex-col'} mt-32 px-4`}>
                <div className={`flex-1 ${windowWidth > 768 && windowWidth <= 1128 ? 'max-w-3xl mx-auto w-full' : ''}`}>
                    <ClipboardContent
                        items={items}
                        copyToClipboard={copyToClipboard}
                        deleteItem={deleteItem}
                    />
                </div>
                {windowWidth > 1128 && (
                    <div className="flex-1">
                        <Notepad
                            notepadContent={notepadContent}
                            setNotepadContent={setNotepadContent}
                        />
                    </div>
                )}
            </div>
            <footer className="text-center text-xs text-gray-500 pt-12 pb-4">
                © 2024 Naco. All rights reserved.
            </footer>
        </div>
    );
};

export default ClipboardApp;