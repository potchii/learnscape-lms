// src/app/teacher/classes/[classId]/materials/new/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, File, X, Link as LinkIcon, Video, Image, FileText } from 'lucide-react';

export default function CreateMaterialPage() {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'DOCUMENT' as 'VIDEO' | 'IMAGE' | 'DOCUMENT' | 'LINK',
        url: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<{
        name: string;
        url: string;
        size: number;
        type: string;
    } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setUploadedFile({
                    name: result.filename,
                    url: result.url,
                    size: result.size,
                    type: result.type,
                });
                setFormData(prev => ({
                    ...prev,
                    url: result.url,
                }));
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setUploadedFile(null);
        setFormData(prev => ({
            ...prev,
            url: '',
        }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('image/')) return <Image className="w-5 h-5" />;
        if (type === 'application/pdf') return <FileText className="w-5 h-5" />;
        return <File className="w-5 h-5" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.type !== 'VIDEO' && !formData.url && !uploadedFile) {
            alert('Please provide a URL or upload a file');
            return;
        }

        if (formData.type === 'VIDEO' && !formData.url) {
            alert('Please provide a video URL');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/materials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    classId,
                    // Use uploaded file URL if available, otherwise use the URL input
                    url: uploadedFile ? uploadedFile.url : formData.url,
                }),
            });

            if (response.ok) {
                router.push(`/teacher/classes/${classId}`);
            } else {
                throw new Error('Failed to create learning material');
            }
        } catch (error) {
            console.error('Error creating material:', error);
            alert('Error creating learning material. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add Learning Material</h1>
                <p className="text-gray-600 mt-2">Share educational resources with your students</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Material Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter material title"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter material description"
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Material Type *
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="DOCUMENT">Document</option>
                            <option value="IMAGE">Image</option>
                            <option value="VIDEO">Video</option>
                            <option value="LINK">Link</option>
                        </select>
                    </div>

                    {/* File Upload Section - Show for DOCUMENT and IMAGE types */}
                    {(formData.type === 'DOCUMENT' || formData.type === 'IMAGE') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {formData.type === 'IMAGE' ? 'Upload Image' : 'Upload Document'}
                            </label>

                            {!uploadedFile ? (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 mb-1">
                                        Drag and drop your file here, or click to browse
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Max file size: 10MB
                                        {formData.type === 'IMAGE' && ' • Supported: JPG, PNG, GIF, WebP'}
                                        {formData.type === 'DOCUMENT' && ' • Supported: PDF, Word, Excel, PowerPoint, Text'}
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileChange}
                                        accept={
                                            formData.type === 'IMAGE'
                                                ? 'image/jpeg,image/jpg,image/png,image/gif,image/webp'
                                                : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt'
                                        }
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(uploadedFile.type)}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                                                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isUploading && (
                                <div className="mt-2 text-sm text-blue-600">
                                    Uploading file...
                                </div>
                            )}
                        </div>
                    )}

                    {/* URL Input Section - Show for VIDEO and LINK types, or as alternative for DOCUMENT/IMAGE */}
                    {(formData.type === 'VIDEO' || formData.type === 'LINK' ||
                        ((formData.type === 'DOCUMENT' || formData.type === 'IMAGE') && !uploadedFile)) && (
                            <div>
                                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                                    {formData.type === 'VIDEO' && <Video className="w-4 h-4 inline mr-1" />}
                                    {formData.type === 'LINK' && <LinkIcon className="w-4 h-4 inline mr-1" />}
                                    {formData.type === 'VIDEO' ? 'Video URL' :
                                        formData.type === 'LINK' ? 'Link URL' : 'Or provide URL'}
                                    {formData.type === 'VIDEO' && ' *'}
                                </label>
                                <input
                                    type="url"
                                    id="url"
                                    name="url"
                                    value={formData.url}
                                    onChange={handleChange}
                                    required={formData.type === 'VIDEO' || formData.type === 'LINK'}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={
                                        formData.type === 'VIDEO' ? 'https://youtube.com/watch?v=...' :
                                            formData.type === 'LINK' ? 'https://example.com/resource' :
                                                'https://example.com/document.pdf'
                                    }
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    {formData.type === 'VIDEO' && 'Enter YouTube, Vimeo, or other video platform URL'}
                                    {formData.type === 'LINK' && 'Enter the web address for this resource'}
                                    {(formData.type === 'DOCUMENT' || formData.type === 'IMAGE') &&
                                        'Alternatively, provide a direct URL to the file'}
                                </p>
                            </div>
                        )}

                    {/* Preview for uploaded files */}
                    {uploadedFile && uploadedFile.type.startsWith('image/') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image Preview
                            </label>
                            <div className="border border-gray-200 rounded-lg p-4">
                                <img
                                    src={uploadedFile.url}
                                    alt="Preview"
                                    className="max-w-full max-h-64 object-contain mx-auto"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push(`/teacher/classes/${classId}`)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Material'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}