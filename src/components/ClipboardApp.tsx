import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useWindowWidth } from '@/hooks/useWindowWidth';
import Header from '@/components/Header';
import ClipboardContent from '@/components/ClipboardContent';
import { Resizable } from 're-resizable';

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
    const [clipboardWidth, setClipboardWidth] = useState(windowWidth > 1128 ? windowWidth / 2 : windowWidth);

    useEffect(() => {
        setIsClient(true);

        // Add global paste event listener
        const handleGlobalPaste = (e: ClipboardEvent) => {
            handlePaste(e as unknown as React.ClipboardEvent);
        };

        window.addEventListener('paste', handleGlobalPaste);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('paste', handleGlobalPaste);
        };
    }, []);

    useEffect(() => {
        setClipboardWidth(windowWidth > 1128 ? windowWidth / 2 : windowWidth);
    }, [windowWidth]);

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
            <div className="flex flex-1 mt-20 px-2 overflow-hidden h-full">
                {windowWidth > 1128 ? (
                    <>
                        <Resizable
                            size={{ width: clipboardWidth, height: '100%' }}
                            onResizeStop={(e, direction, ref, d) => {
                                setClipboardWidth(clipboardWidth + d.width);
                            }}
                            minWidth={300}
                            maxWidth={windowWidth - 300}
                            enable={{ right: true }}
                            handleStyles={{
                                right: {
                                    width: '2px',
                                    right: '-1px',
                                }
                            }}
                            handleClasses={{
                                right: 'bg-transparent hover:bg-gray-500 transition-colors min-h-screen'
                            }}
                            className='h-full overflow-hidden'
                        >
                            <div className="h-full overflow-auto">
                                <ClipboardContent
                                    items={items}
                                    copyToClipboard={copyToClipboard}
                                    deleteItem={deleteItem}
                                />
                            </div>
                        </Resizable>
                        <div style={{ width: windowWidth - clipboardWidth }} className="h-full overflow-auto">
                            <Notepad
                                notepadContent={notepadContent}
                                setNotepadContent={setNotepadContent}
                            />
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full overflow-auto">
                        <ClipboardContent
                            items={items}
                            copyToClipboard={copyToClipboard}
                            deleteItem={deleteItem}
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