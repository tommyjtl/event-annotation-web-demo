import React from 'react';

interface SectionHeaderProps {
    label: string;
    children?: React.ReactNode;
    className?: string;
}

export default function SectionHeader({
    label,
    children,
    className = '', // custom header style
}: SectionHeaderProps) {
    return (
        <div className={`py-3 px-4 border-b border-gray-200 bg-gray-50 ${className}`}>
            <div className="flex items-center justify-between min-h-[2rem]">
                <h3 className="text-gray-700 font-bold text-lg flex items-center">
                    {label}
                </h3>
                {children && (
                    <div className="flex items-center gap-4">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};