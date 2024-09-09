import React from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

type NotepadProps = {
    notepadContent: string;
    setNotepadContent: (value: string) => void;
};

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];

const Notepad: React.FC<NotepadProps> = ({ notepadContent, setNotepadContent }) => (
    <Card className="flex flex-col h-full m-6 bg-[#2D2D2D] overflow-hidden rounded-lg">
        <CardHeader>
            <h2 className="text-2xl font-bold text-white">Notepad</h2>
        </CardHeader>
        <CardContent className="flex-grow p-2 h-full">
            <div className="h-full">
                <ReactQuill
                    theme="snow"
                    value={notepadContent}
                    onChange={setNotepadContent}
                    modules={modules}
                    formats={formats}
                    className="h-full bg-[#2D2D2D] text-white rounded-lg min-h-[202px]"
                />
            </div>
        </CardContent>
        <style jsx global>{`
      .quill {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .ql-container {
        flex: 1;
        overflow: auto;
        font-size: 16px;
        border-bottom-left-radius: 0.5rem;
        border-bottom-right-radius: 0.5rem;
      }
      .ql-toolbar {
        background-color: #1E1E1E;
        border-color: #4A4AFF;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
      }
      .ql-toolbar .ql-stroke {
        stroke: #FFFFFF;
      }
      .ql-toolbar .ql-fill {
        fill: #FFFFFF;
      }
      .ql-toolbar .ql-picker {
        color: #FFFFFF;
      }
      .ql-editor {
        color: #FFFFFF;
      }
      .ql-editor.ql-blank::before {
        color: rgba(255, 255, 255, 0.6);
      }
    `}</style>
    </Card>
);

export default Notepad;