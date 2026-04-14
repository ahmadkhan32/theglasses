import React, { useRef } from 'react';
import { Upload, Camera } from 'lucide-react';
import { motion } from 'framer-motion';

const ImageUpload = ({ onImageSelect, image }) => {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            onImageSelect(URL.createObjectURL(file));
        }
    };

    return (
        <div>
            <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => inputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                    border: `2px dashed ${image ? 'var(--accent-blue)' : 'var(--border-color)'}`,
                    borderRadius: '16px',
                    padding: '28px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: image ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                    transition: 'all 0.2s',
                }}
            >
                {image ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: 'var(--accent-blue)' }}>
                        <Camera size={22} />
                        <span style={{ fontWeight: 600 }}>Photo uploaded ✓ — click to change</span>
                    </div>
                ) : (
                    <div>
                        <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: '12px' }} />
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>Upload your photo</p>
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Drag & drop or click — JPG, PNG accepted
                        </p>
                    </div>
                )}
            </motion.div>
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default ImageUpload;
