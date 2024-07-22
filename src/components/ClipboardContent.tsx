import React from 'react';
import { Clipboard, Trash2, File, ClipboardX } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type ClipboardItemType = {
    type: 'text' | 'image' | 'file';
    content: string;
    name?: string;
    size?: number;
};

type ClipboardContentProps = {
    items: ClipboardItemType[];
    copyToClipboard: (item: ClipboardItemType) => void;
    deleteItem: (index: number) => void;
};

const ClipboardContent: React.FC<ClipboardContentProps> = ({ items, copyToClipboard, deleteItem }) => (
    <Card className="flex flex-col h-full m-6 bg-[#2D2D2D] overflow-hidden rounded-lg">
        <CardHeader>
            <h2 className="text-2xl font-bold text-white">Clipboard</h2>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto">
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white">
                    <ClipboardX className="w-16 h-16 mb-4" />
                    <p>Clipboard is empty</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <Card
                            key={index}
                            className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-[#1E1E1E] animate-fadeIn cursor-pointer relative min-h-[100px] rounded-lg"
                            onClick={() => copyToClipboard(item)}
                        >
                            <CardContent className="flex items-center p-4 h-full">
                                <div className="flex items-center flex-grow h-full pr-10">
                                    {item.type === 'image' ? (
                                        <img src={item.content} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded" />
                                    ) : item.type === 'file' ? (
                                        <File className="w-16 h-16 mr-4 text-white" />
                                    ) : null}
                                    <span className="mr-2 flex-grow break-words text-white self-center">
                                        {item.type === 'text' ? item.content : item.name || 'File'}
                                        {item.size && <span className="text-sm text-[#00E5AE] ml-2">({(item.size / 1024).toFixed(2)} KB)</span>}
                                    </span>
                                </div>
                                <div className="absolute top-2 right-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteItem(index);
                                        }}
                                        className="text-[#00E5AE] hover:bg-[#00E5AE] hover:text-[#1E1E1E] transition-colors bg-[#1E1E1E] w-8 h-8 p-0"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="absolute bottom-2 right-2">
                                    <Clipboard className="w-4 h-4 text-[#4A4AFF]" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </CardContent>
    </Card>
);

export default ClipboardContent;