import React, {useState} from "react"
import {useCallback} from "react";
import {useDropzone} from "react-dropzone";

interface IUser {
    onFileSelect: (file: File) => void;
}

const FileUploader = ({onFileSelect}: IUser) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        // Clear previous errors
        setError("");

        // Handle rejected files (size/type errors)
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors.some((e: any) => e.code === 'file-too-large')) {
                setError("File is too large! Maximum size is 20MB.");
            } else if (rejection.errors.some((e: any) => e.code === 'file-invalid-type')) {
                setError("Only PDF files are allowed!");
            } else {
                setError("File upload failed. Please try again.");
            }
            return;
        }

        // Handle accepted files
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            onFileSelect(selectedFile);
        }
    }, [onFileSelect]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxSize: 20 * 1024 * 1024, // 20MB in bytes (not KB)
        maxFiles: 1
    });

    const removeFile = () => {
        setFile(null);
        setError("");
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (!form) return;

        const formData = new FormData(form);
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string; // Fixed: was getting 'company-name' twice
        const jobDescription = formData.get('job-description') as string; // Fixed: was 'company-description'

        // Check if file exists (from your FileUploader component)
        if (!file) {
            setError("Please upload a PDF file first!");
            return;
        }

        console.log({
            companyName,
            jobTitle,
            jobDescription,
            file: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });

        // Here you can process the form data along with the uploaded file
        // Example: send to API, validate, etc.
    };

    return(
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer p-8">
                    <div className="mx-auto flex items-center justify-center">
                        <img src="/icons/info.svg" alt="upload" className="size-20"/>
                    </div>

                    {error && (
                        <div className="text-red-500 text-center font-medium">
                            ❌ {error}
                        </div>
                    )}

                    {file ? (
                        <div className="text-center space-y-2">
                            <div className="text-green-600 font-medium">
                                ✅ File uploaded successfully!
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <p className="font-semibold text-gray-800">{file.name}</p>
                                <p className="text-sm text-gray-600">
                                    Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeFile();
                                }}
                                className="text-red-500 hover:text-red-700 text-sm underline"
                            >
                                Remove file
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            {isDragActive ? (
                                <p className="text-lg text-blue-600 font-semibold">
                                    Drop your PDF here...
                                </p>
                            ) : (
                                <>
                                    <p className="text-lg text-gray-600">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        PDF ONLY (MAX 20 MB)
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader;